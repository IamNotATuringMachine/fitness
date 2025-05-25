import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { authService, dataService } from '../services/SupabaseService';
import { secureStorage } from '../utils/security';

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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Use refs to track state without causing re-renders
  const userRef = useRef(null);
  const loadingRef = useRef(true);
  const isInitializedRef = useRef(false);
  
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
        
        // Get initial session
        const { session, error } = await authService.getSession();
        
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
          
          console.log('🔧 AuthContext: Setting initial auth state', { 
            hasUser: !!session?.user, 
            email: session?.user?.email 
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
            setError(error);
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
          userEmail: session?.user?.email,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });
        
        if (mounted) {
          // Handle different auth events
          if (event === 'SIGNED_OUT') {
            console.log('🔧 AuthContext: Processing SIGNED_OUT event - START');
            try {
              setUser(null);
              await clearLocalData(); // Ensure local data is cleared before UI might try to access it
              setError(null);
              setLoading(false); // Explicitly set loading to false here
              console.log('🔧 AuthContext: Processing SIGNED_OUT event - END. User null, loading false.');
            } catch (error) {
              console.error('🔧 AuthContext: Error during SIGNED_OUT processing:', error);
              setUser(null);
              setError(null);
              setLoading(false);
            }
            return; 
          }
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('🔧 AuthContext: Processing SIGNED_IN event - START');
            try {
              console.log('🔧 AuthContext: Syncing user data on sign in...');
              await syncUserDataOnSignIn(session.user);
              console.log('🔧 AuthContext: Data sync completed successfully');
            } catch (syncError) {
              console.error('🔧 AuthContext: Data sync failed (non-critical):', syncError);
              // Don't block signin for sync errors
            }
            setUser(session.user); // Set user after sync attempt
            setError(null);
            setLoading(false); // Explicitly set loading to false here
            console.log('🔧 AuthContext: Processing SIGNED_IN event - END. User set, loading false.');
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

    return () => {
      mounted = false;
      // Handle both real and mock subscriptions
      if (authStateChangeResult?.data?.subscription?.unsubscribe) {
        authStateChangeResult.data.subscription.unsubscribe();
      } else {
        console.log('🔧 AuthContext: No subscription to unsubscribe (likely mock)');
      }
    };
  }, []); // Keep empty dependency array

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

  const syncUserDataOnSignIn = async (user) => {
    console.log('🔧 AuthContext: Starting user data sync on sign in for:', user.email);
    
    try {
      // First, try to load existing data from cloud
      const { data: remoteData, error: loadError } = await dataService.getUserData(user.id);
      
      if (loadError) {
        console.warn('🔧 AuthContext: Failed to load remote data:', loadError);
        // Continue without remote data
      } else if (remoteData && Object.keys(remoteData).length > 0) {
        console.log('🔧 AuthContext: Remote data found, applying to local storage');
        
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
        console.log('🔧 AuthContext: Remote data applied successfully');
      } else {
        console.log('🔧 AuthContext: No remote data found (new user or clean slate)');
      }
      
      return { success: true };
    } catch (error) {
      console.error('🔧 AuthContext: Data sync error (non-critical):', error);
      return { success: false, error };
    }
  };

  const saveUserDataToCloud = async () => {
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
  };

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
    clearError: () => setError(null)
  };

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