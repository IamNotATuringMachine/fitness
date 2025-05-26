import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { authService, dataService } from '../services/SupabaseService';
import { secureStorage } from '../utils/security';
import autoSyncService from '../services/AutoSyncService';
import safeSyncService from '../services/SafeSyncService';

const AuthContext = createContext();

// Demo user for offline/test mode
const DEMO_USER = {
  id: 'demo-user-12345',
  email: 'demo@fittrack.app',
  user_metadata: {
    name: 'Demo User',
    avatar_url: null
  },
  app_metadata: {},
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString()
};

// Cache busting utility (used in emergency scenarios)
// eslint-disable-next-line no-unused-vars
const clearCacheAndReload = () => {
  console.log('🔄 Clearing cache and reloading due to authentication loop...');
  
  // Clear service worker caches
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
  
  // Clear relevant localStorage
  ['workoutState', 'userProfile', 'gamificationState', 'nutritionState', 'app_version'].forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Force hard reload
  window.location.reload(true);
};

export function AuthProvider({ children }) {
  // Force rebuild with new hash - fix for auth loop v2.0
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Use refs to track state without causing re-renders
  const userRef = useRef(null);
  const loadingRef = useRef(true);
  const isInitializedRef = useRef(false);
  
  // Anti-loop protection
  const initializationAttemptsRef = useRef(0);
  const lastInitializationTimeRef = useRef(Date.now());
  
  // Update refs when state changes
  userRef.current = user;
  loadingRef.current = loading;
  isInitializedRef.current = isInitialized;

  useEffect(() => {
    let mounted = true;
    let initComplete = false;

    const initializeAuth = async () => {
      try {
        console.log('🔧 AuthContext: Initializing auth...');
        
        // Anti-loop protection
        initializationAttemptsRef.current += 1;
        const now = Date.now();
        const timeSinceLastInit = now - lastInitializationTimeRef.current;
        lastInitializationTimeRef.current = now;
        
        console.log('🔧 AuthContext: Initialization attempt #' + initializationAttemptsRef.current, {
          timeSinceLastInit,
          mounted,
          initComplete
        });
        
        // If we've tried too many times in a short period, force complete initialization
        if (initializationAttemptsRef.current > 3 && timeSinceLastInit < 2000) {
          console.error('🚨 AuthContext: Too many initialization attempts detected, forcing completion...');
          if (mounted && !initComplete) {
            setUser(null);
            setError(new Error('Authentication initialization failed - too many attempts'));
            setLoading(false);
            setIsInitialized(true);
            initComplete = true;
          }
          return;
        }
        
        // Add timeout for session retrieval
        const sessionPromise = authService.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session retrieval timeout')), 10000)
        );
        
        const { session, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (mounted && !initComplete) {
          if (error && error.message.includes('Supabase not configured')) {
            console.log('🔧 AuthContext: Supabase not configured - running in offline mode');
            setIsDemoMode(true);
            
            // Check if user was previously logged in to demo mode
            const demoUserSession = secureStorage.get('demoUserSession');
            if (demoUserSession) {
              console.log('🔧 AuthContext: Restoring demo user session');
              setUser(DEMO_USER);
            } else {
              setUser(null);
            }
            
            setError(null); // Don't treat missing config as an error
            setLoading(false);
            setIsInitialized(true);
            initComplete = true;
            return;
          }
          
          if (error && error.message.includes('timeout')) {
            console.error('🔧 AuthContext: Session retrieval timed out, continuing without session');
            setUser(null);
            setError(null);
            setLoading(false);
            setIsInitialized(true);
            initComplete = true;
            return;
          }
          
          // Enhanced session debugging
          console.log('🔧 AuthContext: Session retrieval response:', {
            hasSession: !!session,
            hasUser: !!session?.user,
            userEmail: session?.user?.email,
            userId: session?.user?.id,
            sessionExpiry: session?.expires_at,
            currentTime: Math.floor(Date.now() / 1000),
            isExpired: session?.expires_at ? Math.floor(Date.now() / 1000) > session.expires_at : false,
            expiryInMinutes: session?.expires_at ? Math.round((session.expires_at - Math.floor(Date.now() / 1000)) / 60) : 'N/A',
            error: error?.message || 'none',
            sessionObject: session ? Object.keys(session) : 'none'
          });
          
          // Handle case where session exists but user is null or session is expired
          if (session && (!session.user || (session.expires_at && Math.floor(Date.now() / 1000) > session.expires_at))) {
            console.warn('🔧 AuthContext: Session exists but user is null or session expired, clearing auth state');
            
            // Log detailed session info for debugging
            console.log('🔧 AuthContext: Invalid session details:', {
              hasUser: !!session.user,
              expiresAt: session.expires_at,
              currentTime: Math.floor(Date.now() / 1000),
              isExpired: session.expires_at ? Math.floor(Date.now() / 1000) > session.expires_at : false,
              timeDifferenceMinutes: session.expires_at ? Math.round((session.expires_at - Math.floor(Date.now() / 1000)) / 60) : 'N/A'
            });
            
            // Try to sign out to clear the invalid session
            try {
              await authService.signOut();
              console.log('🔧 AuthContext: Invalid session cleared successfully');
            } catch (signOutError) {
              console.warn('🔧 AuthContext: Failed to clear invalid session:', signOutError);
              // Clear localStorage auth data manually
              console.log('🔧 AuthContext: Manually clearing localStorage auth data...');
              const authKeys = Object.keys(localStorage).filter(key => 
                key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')
              );
              authKeys.forEach(key => {
                console.log('🔧 AuthContext: Removing localStorage key:', key);
                localStorage.removeItem(key);
              });
            }
            
            setUser(null);
            setError(null);
            setLoading(false);
            setIsInitialized(true);
            initComplete = true;
            return;
          }
          
          console.log('🔧 AuthContext: Setting initial auth state', { 
            hasUser: !!session?.user, 
            email: session?.user?.email,
            userId: session?.user?.id
          });
          
          setUser(session?.user ?? null);
          setLoading(false);
          setIsInitialized(true);
          initComplete = true;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted && !initComplete) {
          // Don't treat Supabase configuration errors as critical auth errors
          if (error.message?.includes('Supabase not configured')) {
            console.log('🔧 AuthContext: Handling Supabase config error gracefully');
            setIsDemoMode(true);
            setUser(null);
            setError(null);
          } else {
            setError(null); // Don't show errors to user, just log them
          }
          setLoading(false);
          setIsInitialized(true);
          initComplete = true;
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const authStateChangeResult = authService.onAuthStateChange(
      async (event, session) => {
        console.log('🔧 AuthContext: Auth state changed:', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          userId: session?.user?.id,
          sessionExpiry: session?.expires_at,
          isExpired: session?.expires_at ? Math.floor(Date.now() / 1000) > session.expires_at : false,
          timestamp: new Date().toISOString()
        });
        
        // Check for invalid session in auth state changes too
        if (session && (!session.user || (session.expires_at && Math.floor(Date.now() / 1000) > session.expires_at))) {
          console.warn('🔧 AuthContext: Invalid session detected in auth state change, treating as signed out');
          event = 'SIGNED_OUT';
          session = null;
        }
        
        if (mounted) {
          // Handle different auth events
          if (event === 'SIGNED_OUT') {
            console.log('🔧 AuthContext: Processing SIGNED_OUT event - START');
            try {
              // Disable auto-sync immediately
              autoSyncService.disable();
              console.log('🔧 AuthContext: Auto-sync disabled on sign out');
              
              setUser(null);
              await clearLocalData(); // Ensure local data is cleared before UI might try to access it
              setError(null);
              setLoading(false); // Explicitly set loading to false here
              setIsInitialized(true); // Ensure initialization is marked complete
              console.log('🔧 AuthContext: Processing SIGNED_OUT event - END. User null, loading false, initialized true.');
            } catch (error) {
              console.error('🔧 AuthContext: Error during SIGNED_OUT processing:', error);
              setUser(null);
              setError(null);
              setLoading(false);
              setIsInitialized(true); // Ensure initialization is marked complete even on error
            }
            return; 
          }
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('🔧 AuthContext: Processing SIGNED_IN event - START');
            
            // Set user state immediately to prevent UI blocking
            setUser(session.user);
            setError(null);
            setLoading(false);
            setIsInitialized(true);
            
            // Enable auto-sync for authenticated users (not demo mode)
            if (!isDemoMode) {
              autoSyncService.enable();
              console.log('🔧 AuthContext: Auto-sync enabled for authenticated user');
            }
            
            // Perform immediate safe sync (pull data immediately, never overwrite cloud with defaults)
            const performImmediateSync = async () => {
              let retryCount = 0;
              const maxRetries = 3;
              const retryDelay = 2000; // 2 seconds
              
              while (retryCount < maxRetries) {
                try {
                  console.log(`🔄 AuthContext: Starting immediate safe sync (attempt ${retryCount + 1}/${maxRetries})...`);
                  const syncResult = await safeSyncService.performLoginSync(session.user);
                  
                  if (syncResult.success) {
                    console.log('✅ AuthContext: Immediate sync completed successfully');
                    if (syncResult.hasUpdates) {
                      console.log('📥 AuthContext: Data updated from cloud:', syncResult.updatedKeys);
                      // Show notification that data was updated
                      window.dispatchEvent(new CustomEvent('loginDataSynced', {
                        detail: {
                          message: 'Your data has been synced from the cloud',
                          updatedKeys: syncResult.updatedKeys
                        }
                      }));
                    }
                    if (syncResult.pushedToCloud) {
                      console.log('📤 AuthContext: Local data pushed to cloud');
                    }
                    return; // Success, exit retry loop
                  } else {
                    console.warn(`⚠️ AuthContext: Immediate sync failed (attempt ${retryCount + 1}):`, syncResult.error);
                    if (retryCount === maxRetries - 1) {
                      // Last attempt failed
                      console.error('❌ AuthContext: All immediate sync attempts failed, user will need to manually sync');
                      // Show a notification about sync failure
                      window.dispatchEvent(new CustomEvent('loginSyncFailed', {
                        detail: {
                          message: 'Cloud sync failed - please manually sync your data',
                          error: syncResult.error
                        }
                      }));
                    }
                  }
                } catch (syncError) {
                  console.error(`❌ AuthContext: Immediate sync error (attempt ${retryCount + 1}):`, syncError);
                  if (retryCount === maxRetries - 1) {
                    // Last attempt failed
                    console.error('❌ AuthContext: All immediate sync attempts failed due to errors');
                    window.dispatchEvent(new CustomEvent('loginSyncFailed', {
                      detail: {
                        message: 'Cloud sync failed - please manually sync your data',
                        error: syncError.message
                      }
                    }));
                  }
                }
                
                retryCount++;
                if (retryCount < maxRetries) {
                  console.log(`⏳ AuthContext: Retrying immediate sync in ${retryDelay/1000} seconds...`);
                  await new Promise(resolve => setTimeout(resolve, retryDelay));
                }
              }
            };
            
            // Start immediate sync but don't await it to avoid blocking UI
            performImmediateSync();
            
            console.log('🔧 AuthContext: Processing SIGNED_IN event - END. User set, loading false, initialized true.');
            return; 
          }
          
          // Handle other events (TOKEN_REFRESHED, USER_UPDATED) or initial session check
          const newUser = session?.user ?? null;
          const currentUserId = userRef.current?.id; // Use ref for current user ID
          const newUserId = newUser?.id;

          if (currentUserId !== newUserId) {
            console.log('🔧 AuthContext: User changed (e.g., token refresh with same user, or different user), updating state.');
            setUser(newUser); // This will update userRef automatically due to component re-render
          }
          
          // Ensure loading is false if it's still true and we have a session or no session (initial load)
          // This also covers the case where initializeAuth might not have set loading to false
          if (loadingRef.current) { // Use ref for current loading state
             console.log('🔧 AuthContext: Auth state change (other event), setting loading to false.');
             setLoading(false);
          }

          if (!isInitializedRef.current) { // Use ref for current initialized state
            console.log('🔧 AuthContext: Auth state change (other event), setting isInitialized to true.');
            setIsInitialized(true);
          }
        }
      }
    );

    // Emergency failsafe for stuck authentication
    const emergencyTimer = setTimeout(() => {
      if (mounted && !initComplete && loadingRef.current) {
        console.error('🚨 AuthContext: Emergency timeout reached, clearing cache and reloading...');
        // clearCacheAndReload(); // Temporarily disabled for debugging rapid refresh
      }
    }, 20000); // 20 second emergency timeout

    return () => {
      mounted = false;
      clearTimeout(emergencyTimer);
      
      // Cleanup auto-sync service
      autoSyncService.destroy();
      console.log('🔧 AuthContext: Auto-sync service cleaned up');
      
      // Handle both real and mock subscriptions
      if (authStateChangeResult?.data?.subscription?.unsubscribe) {
        authStateChangeResult.data.subscription.unsubscribe();
      } else {
        console.log('🔧 AuthContext: No subscription to unsubscribe (likely mock)');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep empty dependency array to prevent re-initialization

  const clearLocalData = async () => {
    try {
      // Clear sensitive data but keep app preferences
      secureStorage.remove('workoutState');
      secureStorage.remove('userProfile');
      secureStorage.remove('gamificationState');
      secureStorage.remove('nutritionState');
      secureStorage.remove('lastSyncTime');
      secureStorage.remove('authToken');
      secureStorage.remove('demoUserSession');
      
      console.log('🔧 AuthContext: Local data cleared on sign out');
    } catch (error) {
      console.error('🔧 AuthContext: Error clearing local data:', error);
    }
  };

  // Debug function to manually clear all auth-related data
  const clearAllAuthData = useCallback(async () => {
    console.log('🔧 AuthContext: Manually clearing all auth data...');
    
    try {
      // Clear local app data
      await clearLocalData();
      
      // Clear Supabase auth data from localStorage
      const authKeys = Object.keys(localStorage).filter(key => 
        key.includes('sb-') || key.includes('supabase') || key.includes('auth')
      );
      
      authKeys.forEach(key => {
        console.log('🔧 AuthContext: Clearing localStorage key:', key);
        localStorage.removeItem(key);
      });
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Sign out from Supabase
      if (!isDemoMode) {
        try {
          await authService.signOut();
        } catch (error) {
          console.warn('🔧 AuthContext: Error during signOut:', error);
        }
      }
      
      // Reset state
      setUser(null);
      setError(null);
      setLoading(false);
      setIsInitialized(true);
      
      console.log('🔧 AuthContext: All auth data cleared successfully');
      return { success: true };
    } catch (error) {
      console.error('🔧 AuthContext: Error clearing auth data:', error);
      return { success: false, error };
    }
  }, [isDemoMode]);



  const saveUserDataToCloud = useCallback(async () => {
    if (!user) {
      console.log('🔧 AuthContext: No user available for cloud save');
      return { success: false, error: 'No user authenticated' };
    }
    
    console.log('🔧 AuthContext: Starting cloud save for user:', user.email);
    
    try {
      const workoutData = secureStorage.get('workoutState') || {};
      const userProfile = secureStorage.get('userProfile') || {};
      const gamificationData = secureStorage.get('gamificationState') || {};
      const nutritionData = secureStorage.get('nutritionState') || {};
      
      const dataToSave = {
        workoutState: workoutData,
        userProfile: userProfile,
        gamificationState: gamificationData,
        nutritionState: nutritionData,
        lastModified: new Date().toISOString()
      };
      
      console.log('🔧 AuthContext: Prepared data for cloud save:', {
        userId: user.id,
        dataKeys: Object.keys(dataToSave),
        sizes: {
          workoutState: Object.keys(workoutData).length,
          userProfile: Object.keys(userProfile).length,
          gamificationState: Object.keys(gamificationData).length,
          nutritionState: Object.keys(nutritionData).length
        }
      });
      
      const { error } = await dataService.saveUserData(user.id, dataToSave);
      
      if (error) {
        console.error('🔧 AuthContext: Error saving user data to cloud:', error);
        return { success: false, error };
      }
      
      secureStorage.set('lastSyncTime', new Date().toISOString());
      console.log('🔧 AuthContext: User data saved to cloud successfully');
      
      return { success: true };
    } catch (error) {
      console.error('🔧 AuthContext: Error saving user data to cloud:', error);
      return { success: false, error };
    }
  }, [user]);

  // Demo mode login functions
  const signInDemo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔧 AuthContext: Demo login initiated');
      
      // Simulate a small delay like a real login
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store demo session
      secureStorage.set('demoUserSession', true);
      
      // Set demo user
      setUser(DEMO_USER);
      
      // Disable auto-sync for demo mode
      autoSyncService.disable();
      console.log('🔧 AuthContext: Auto-sync disabled for demo mode');
      
      console.log('🔧 AuthContext: Demo login successful');
      return { success: true, data: { user: DEMO_USER } };
    } catch (error) {
      console.error('Demo sign in error:', error);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    // In demo mode, treat signup as demo login
    if (isDemoMode) {
      console.log('🔧 AuthContext: Demo mode - treating signup as demo login');
      return await signInDemo();
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await authService.signUp(email, password, userData);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    // In demo mode, use demo login regardless of credentials
    if (isDemoMode) {
      console.log('🔧 AuthContext: Demo mode - using demo login');
      return await signInDemo();
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    // In demo mode, use demo login
    if (isDemoMode) {
      console.log('🔧 AuthContext: Demo mode - using demo login for Google');
      return await signInDemo();
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await authService.signInWithGoogle();
      
      if (error) {
        setError(error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    // In demo mode, use demo login
    if (isDemoMode) {
      console.log('🔧 AuthContext: Demo mode - using demo login for GitHub');
      return await signInDemo();
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await authService.signInWithGitHub();
      
      if (error) {
        setError(error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('GitHub sign in error:', error);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('🔧 AuthContext: Starting sign out process...');
    
    // Set loading state to prevent UI issues during logout
    setLoading(true);
    setError(null);
    
    try {
      // In demo mode, just clear local data and set user to null
      if (isDemoMode) {
        console.log('🔧 AuthContext: Demo mode - performing local logout');
        await clearLocalData();
        setUser(null);
        setLoading(false);
        return { success: true };
      }
      
      // Save current data to cloud before signing out, but don't let it block logout if it fails
      if (userRef.current) {
        try {
          console.log('🔧 AuthContext: Attempting to save data to cloud before logout...');
          await Promise.race([
            saveUserDataToCloud(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Save timeout')), 5000))
          ]);
          console.log('🔧 AuthContext: Data saved to cloud successfully');
        } catch (error) {
          console.warn('🔧 AuthContext: Failed to save data to cloud before logout, continuing anyway:', error);
          // Don't block logout if cloud save fails
        }
      }
      
      console.log('🔧 AuthContext: Calling authService.signOut()...');
      const { error: signOutError } = await authService.signOut();
      
      if (signOutError) {
        console.error('🔧 AuthContext: Sign out error from authService:', signOutError);
        setError(signOutError);
        setLoading(false);
        return { success: false, error: signOutError };
      }
      
      console.log('🔧 AuthContext: authService.signOut() successful. Waiting for auth state change...');
      // The onAuthStateChange event for SIGNED_OUT will handle the rest:
      // - setUser(null)
      // - setLoading(false) 
      // - clearLocalData()

      return { success: true };
    } catch (error) {
      console.error('🔧 AuthContext: Critical error during sign out process:', error);
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      
      const { data, error } = await authService.resetPassword(email);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error);
      return { success: false, error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      
      const { data, error } = await authService.updatePassword(newPassword);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Update password error:', error);
      setError(error);
      return { success: false, error };
    }
  };

  const loadUserDataFromCloud = async () => {
    if (!user) return;
    
    try {
      const { data: remoteData, error } = await dataService.getUserData(user.id);
      
      if (error) {
        console.error('Error loading user data from cloud:', error);
        return { success: false, error };
      }
      
      if (remoteData && Object.keys(remoteData).length > 0) {
        // Apply remote data to local storage
        if (remoteData.workoutState) {
          secureStorage.set('workoutState', remoteData.workoutState);
        }
        if (remoteData.userProfile) {
          secureStorage.set('userProfile', remoteData.userProfile);
        }
        if (remoteData.gamificationState) {
          secureStorage.set('gamificationState', remoteData.gamificationState);
        }
        if (remoteData.nutritionState) {
          secureStorage.set('nutritionState', remoteData.nutritionState);
        }
        
        secureStorage.set('lastSyncTime', new Date().toISOString());
        console.log('User data loaded from cloud successfully');
        
        return { success: true, data: remoteData };
      }
      
      return { success: true, data: {} };
    } catch (error) {
      console.error('Error loading user data from cloud:', error);
      return { success: false, error };
    }
  };

  const createBackup = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      const workoutData = secureStorage.get('workoutState') || {};
      const userProfile = secureStorage.get('userProfile') || {};
      const gamificationData = secureStorage.get('gamificationState') || {};
      const nutritionData = secureStorage.get('nutritionState') || {};
      
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        workoutState: workoutData,
        userProfile: userProfile,
        gamificationState: gamificationData,
        nutritionState: nutritionData
      };
      
      const { data, error } = await dataService.createBackup(user.id, backupData);
      
      if (error) {
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating backup:', error);
      return { success: false, error };
    }
  };

  const getBackups = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      const { data, error } = await dataService.getUserBackups(user.id);
      
      if (error) {
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error getting backups:', error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    loading,
    error,
    isInitialized,
    isDemoMode,
    signUp,
    signIn,
    signInDemo,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updatePassword,
    saveUserDataToCloud,
    loadUserDataFromCloud,
    createBackup,
    getBackups,
    clearAllAuthData,
    clearError: () => setError(null)
  };

  // Set up debug functions for console access
  useEffect(() => {
    // Force immediate sync debug functions
    if (user && !isDemoMode) {
      window.forceSyncNow = async () => {
        try {
          console.log('🔄 Debug: Forcing immediate sync via AutoSyncService...');
          await autoSyncService.forceSyncNow();
          console.log('✅ Debug: Immediate sync completed');
        } catch (error) {
          console.error('❌ Debug: Error during forced sync:', error);
        }
      };
      
      window.forceSafeSync = async () => {
        try {
          console.log('🔄 Debug: Forcing safe sync...');
          const result = await safeSyncService.forceSync();
          console.log('✅ Debug: Safe sync completed:', result);
          return result;
        } catch (error) {
          console.error('❌ Debug: Error during safe sync:', error);
          return { success: false, error: error.message };
        }
      };
      
      // Get sync status
      window.getAutoSyncStatus = () => {
        const autoStatus = autoSyncService.getStatus();
        const safeStatus = safeSyncService.getStatus();
        console.log('📊 Auto-sync status:', autoStatus);
        console.log('📊 Safe-sync status:', safeStatus);
        return { autoSync: autoStatus, safeSync: safeStatus };
      };
      
      // Configure real-time sync
      window.configureRealTimeSync = (intervalSeconds = 10) => {
        const intervalMs = Math.max(5, intervalSeconds) * 1000; // Minimum 5 seconds
        autoSyncService.updateConfig({ cloudCheckInterval: intervalMs });
        console.log(`⚙️ Real-time sync interval set to ${intervalMs/1000} seconds`);
        return autoSyncService.getStatus();
      };
      
      // Manually trigger cloud check
      window.checkCloudNow = async () => {
        console.log('🔍 Manually triggering cloud check...');
        try {
          await autoSyncService.checkForCloudChanges();
          console.log('✅ Manual cloud check completed');
        } catch (error) {
          console.error('❌ Manual cloud check failed:', error);
        }
      };
    } else {
      // Remove debug functions when user is not authenticated
      window.forceSyncNow = null;
      window.forceSafeSync = null;
      window.getAutoSyncStatus = null;
      window.configureRealTimeSync = null;
      window.checkCloudNow = null;
    }
    
    // Always expose auth debug function for troubleshooting
    window.clearAuthData = async () => {
      console.log('🔧 Debug: Clearing all auth data from console...');
      const result = await clearAllAuthData();
      if (result.success) {
        console.log('✅ Debug: Auth data cleared successfully. Please refresh the page.');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.error('❌ Debug: Failed to clear auth data:', result.error);
      }
    };
    
    // Cleanup on unmount
    return () => {
      if (window.forceSyncNow) {
        window.forceSyncNow = null;
      }
      if (window.forceSafeSync) {
        window.forceSafeSync = null;
      }
      if (window.getAutoSyncStatus) {
        window.getAutoSyncStatus = null;
      }
      if (window.configureRealTimeSync) {
        window.configureRealTimeSync = null;
      }
      if (window.checkCloudNow) {
        window.checkCloudNow = null;
      }
      if (window.clearAuthData) {
        window.clearAuthData = null;
      }
    };
  }, [user, isDemoMode, clearAllAuthData]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 