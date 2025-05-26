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
  const [appRebuildHash, setAppRebuildHash] = useState(Math.random().toString(36).substring(7));

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const userRef = useRef(user);
  const isSyncing = useRef(false);
  const supabaseSubscription = useRef(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const deepMergeStates = useCallback(async (remoteDataPayload) => {
    if (isSyncing.current && remoteDataPayload.eventType !== 'INITIAL_SYNC') { // Allow initial sync to proceed, but not concurrent real-time events if one is processing
      console.log('🔄 AuthContext: Sync already in progress, skipping merge for this real-time event.');
      return;
    }
    isSyncing.current = true;
    console.log('🔄 AuthContext: Starting deep merge with remote data. Event Type:', remoteDataPayload.eventType, 'Payload:', remoteDataPayload);

    try {
      const currentUser = userRef.current;
      if (!currentUser && !isDemoMode) {
        console.log('🔄 AuthContext: No user for deep merge, skipping.');
        isSyncing.current = false;
        return;
      }

      const remoteEventData = remoteDataPayload.new; // data from the 'new' field in Supabase payload
      if (!remoteEventData || !remoteEventData.data) {
        console.log('🔄 AuthContext: No remote data in payload (payload.new.data is missing), skipping merge.');
        isSyncing.current = false;
        return;
      }
      const remoteMasterData = remoteEventData.data; // This is the full JSONB 'data' field from Supabase

      // Get current local states - deep clone to avoid modifying a shared object if secureStorage returns one
      let localWorkoutState = secureStorage.get('workoutState');
      localWorkoutState = localWorkoutState ? JSON.parse(JSON.stringify(localWorkoutState)) : JSON.parse(JSON.stringify(safeSyncService.defaultPatterns.workoutState));
      
      let localUserProfile = secureStorage.get('userProfile');
      localUserProfile = localUserProfile ? JSON.parse(JSON.stringify(localUserProfile)) : {};
      
      let localGamificationState = secureStorage.get('gamificationState');
      localGamificationState = localGamificationState ? JSON.parse(JSON.stringify(localGamificationState)) : JSON.parse(JSON.stringify(safeSyncService.defaultPatterns.gamificationState));
      
      let localNutritionState = secureStorage.get('nutritionState');
      localNutritionState = localNutritionState ? JSON.parse(JSON.stringify(localNutritionState)) : JSON.parse(JSON.stringify(safeSyncService.defaultPatterns.nutritionState));
      
      const changedKeys = [];
      let needsLocalUpdate = false;

      // --- Helper for merging arrays of objects with 'id' and 'last_modified' ---
      const mergeItemArray = (localItemsParam, remoteItemsParam, itemName) => {
        const localItems = Array.isArray(localItemsParam) ? localItemsParam : [];
        const remoteItems = Array.isArray(remoteItemsParam) ? remoteItemsParam : [];

        const localMap = new Map(localItems.map(item => [item.id, item]));
        const mergedItems = [];
        let arrayChanged = false;

        // Process remote items (updates and new additions)
        for (const remoteItem of remoteItems) {
          if (!remoteItem.id) { // last_modified can be checked during comparison
            console.warn(`Remote ${itemName} item missing id, skipping item:`, remoteItem);
            // Skip items without IDs - they cannot be properly merged
            continue;
          }
          const localItem = localItems.find(li => li.id === remoteItem.id);
          
          if (localItem) { // Item exists locally
            const localTS = new Date(localItem.last_modified || 0).getTime();
            const remoteTS = new Date(remoteItem.last_modified || 0).getTime();

            if (remoteTS > localTS) {
              mergedItems.push(remoteItem); // Remote is newer
              arrayChanged = true;
              console.log(`🔄 Merged ${itemName} (ID: ${remoteItem.id}): Updated from remote (remote newer).`);
            } else if (remoteTS < localTS) {
              mergedItems.push(localItem); // Local is newer, keep local
              // If local is strictly newer, this indicates a local change not yet pushed.
              // `arrayChanged` might be true if this differs from original local item list order or content, handled by final check.
            } else { // Timestamps are equal (or both invalid and defaulted to 0)
              if (JSON.stringify(localItem) !== JSON.stringify(remoteItem)) {
                mergedItems.push(remoteItem); // Timestamps equal, content differs, take remote for consistency
                arrayChanged = true;
                console.log(`🔄 Merged ${itemName} (ID: ${remoteItem.id}): Timestamps equal, content differed, took remote.`);
              } else {
                mergedItems.push(localItem); // Timestamps and content equal
              }
            }
            localMap.delete(remoteItem.id); // Mark as processed
          } else { // Item is new from remote
            mergedItems.push(remoteItem);
            arrayChanged = true;
            console.log(`🔄 Merged ${itemName} (ID: ${remoteItem.id}): Added new from remote.`);
          }
        }

        // Items remaining in localMap were present locally but not in remote list, so they are effectively deleted.
        if (localMap.size > 0) {
            arrayChanged = true; 
            localMap.forEach(deletedItem => {
                 console.log(`🔄 Merged ${itemName} (ID: ${deletedItem.id}): Removed (was local, not in remote).`);
            });
        }
        
        // Final check: if arrayChanged is true, but the actual content and order of IDs is the same, reset arrayChanged.
        // This avoids flagging a change if items were just reordered by the merge but content is identical.
        if (arrayChanged) {
            if (localItems.length === mergedItems.length) {
                let contentAndOrderIdentical = true;
                for (let i = 0; i < localItems.length; i++) {
                    if (localItems[i].id !== mergedItems[i].id || JSON.stringify(localItems[i]) !== JSON.stringify(mergedItems[i])) {
                        contentAndOrderIdentical = false;
                        break;
                    }
                }
                if (contentAndOrderIdentical) arrayChanged = false;
            }
        }
        
        return arrayChanged ? mergedItems : localItems; // Return original localItems if no effective change
      };

      // --- Deep merge workoutState ---
      if (remoteMasterData.workoutState) {
        const remoteWorkoutState = remoteMasterData.workoutState;
        let currentWorkoutStateChanged = false; // Shadowing outer scope variable

        const mergedExercises = mergeItemArray(
          localWorkoutState.exercises, 
          remoteWorkoutState.exercises, 
          'exercises'
        );
        if (mergedExercises !== localWorkoutState.exercises) { // Check for reference change
            localWorkoutState.exercises = mergedExercises;
            currentWorkoutStateChanged = true;
        }

        const mergedWorkoutPlans = mergeItemArray(
          localWorkoutState.workoutPlans, 
          remoteWorkoutState.workoutPlans, 
          'workoutPlans'
        );
        if (mergedWorkoutPlans !== localWorkoutState.workoutPlans) {
            localWorkoutState.workoutPlans = mergedWorkoutPlans;
            currentWorkoutStateChanged = true;
        }
        
        const mergedWorkoutHistory = mergeItemArray(
          localWorkoutState.workoutHistory, 
          remoteWorkoutState.workoutHistory, 
          'workoutHistory'
        );
         if (mergedWorkoutHistory !== localWorkoutState.workoutHistory) {
            localWorkoutState.workoutHistory = mergedWorkoutHistory;
            currentWorkoutStateChanged = true;
        }
        
        // Example for customExercises, add if you have it.
        // const mergedCustomExercises = mergeItemArray(localWorkoutState.customExercises, remoteWorkoutState.customExercises, 'customExercises');
        // if (mergedCustomExercises !== localWorkoutState.customExercises) {
        //     localWorkoutState.customExercises = mergedCustomExercises;
        //     currentWorkoutStateChanged = true;
        // }


        // Merge other direct properties of workoutState
        // Example for currentWorkout (object, not array)
        if (remoteWorkoutState.currentWorkout) {
          if (!localWorkoutState.currentWorkout || 
              new Date(remoteWorkoutState.currentWorkout.last_modified || 0) > new Date(localWorkoutState.currentWorkout.last_modified || 0)) {
            if(JSON.stringify(localWorkoutState.currentWorkout) !== JSON.stringify(remoteWorkoutState.currentWorkout)){
                localWorkoutState.currentWorkout = remoteWorkoutState.currentWorkout;
                currentWorkoutStateChanged = true;
                console.log('🔄 Merged workoutState: Updated currentWorkout from remote.');
            }
          }
        } else if (localWorkoutState.currentWorkout) { // Remote cleared it
            localWorkoutState.currentWorkout = null; // Or appropriate default
            currentWorkoutStateChanged = true;
            console.log('🔄 Merged workoutState: Cleared currentWorkout as it was null in remote.');
        }
        
        // Update root lastModified for workoutState if any of its contents changed or if remote is newer
        if (currentWorkoutStateChanged || (remoteWorkoutState.lastModified && new Date(remoteWorkoutState.lastModified) > new Date(localWorkoutState.lastModified || 0))) {
          localWorkoutState.lastModified = remoteWorkoutState.lastModified || new Date().toISOString();
          secureStorage.set('workoutState', localWorkoutState);
          changedKeys.push('workoutState');
          needsLocalUpdate = true;
          console.log('🔄 AuthContext: workoutState updated after deep merge.');
        }
      }

      // --- Deep merge userProfile ---
      if (remoteMasterData.userProfile) {
        const remoteUserProfile = remoteMasterData.userProfile;
        // User profile is usually simpler, often a "remote wins if newer" or field-by-field if complex
        if (new Date(remoteUserProfile.lastModified || 0) > new Date(localUserProfile.lastModified || 0)) {
           if(JSON.stringify(localUserProfile) !== JSON.stringify(remoteUserProfile)){
                secureStorage.set('userProfile', remoteUserProfile);
                localUserProfile = remoteUserProfile; 
                changedKeys.push('userProfile');
                needsLocalUpdate = true;
                console.log('🔄 AuthContext: userProfile updated from remote (remote was newer and different).');
           }
        }
      }
      
      // --- Deep merge gamificationState ---
      if (remoteMasterData.gamificationState) {
        const remoteGamificationState = remoteMasterData.gamificationState;
        let currentGamificationStateChanged = false;

        const mergedBadges = mergeItemArray(localGamificationState.badges, remoteGamificationState.badges, 'badges');
        if (mergedBadges !== localGamificationState.badges) {
            localGamificationState.badges = mergedBadges;
            currentGamificationStateChanged = true;
        }

        const mergedChallenges = mergeItemArray(localGamificationState.challenges, remoteGamificationState.challenges, 'challenges');
        if (mergedChallenges !== localGamificationState.challenges) {
            localGamificationState.challenges = mergedChallenges;
            currentGamificationStateChanged = true;
        }
        
        // For simple properties like userLevel, userPoints, streaks - usually remote wins if object is newer
        // or if specific fields are different and remote is generally newer
        if (new Date(remoteGamificationState.lastModified || 0) > new Date(localGamificationState.lastModified || 0)) {
            if (localGamificationState.userLevel !== remoteGamificationState.userLevel) {
                localGamificationState.userLevel = remoteGamificationState.userLevel;
                currentGamificationStateChanged = true;
            }
            if (localGamificationState.userPoints !== remoteGamificationState.userPoints) {
                localGamificationState.userPoints = remoteGamificationState.userPoints;
                currentGamificationStateChanged = true;
            }
            if (JSON.stringify(localGamificationState.streaks) !== JSON.stringify(remoteGamificationState.streaks)) {
                localGamificationState.streaks = remoteGamificationState.streaks;
                currentGamificationStateChanged = true;
            }
        }

        if (currentGamificationStateChanged || (remoteGamificationState.lastModified && new Date(remoteGamificationState.lastModified) > new Date(localGamificationState.lastModified || 0))) {
          localGamificationState.lastModified = remoteGamificationState.lastModified || new Date().toISOString();
          secureStorage.set('gamificationState', localGamificationState);
          changedKeys.push('gamificationState');
          needsLocalUpdate = true;
          console.log('🔄 AuthContext: gamificationState updated after deep merge.');
        }
      }

      // --- Deep merge nutritionState ---
      if (remoteMasterData.nutritionState) {
        const remoteNutritionState = remoteMasterData.nutritionState;
        let currentNutritionStateChanged = false;
        
        const mergedFoodItems = mergeItemArray(localNutritionState.foodItems, remoteNutritionState.foodItems, 'foodItems');
        if (mergedFoodItems !== localNutritionState.foodItems) {
            localNutritionState.foodItems = mergedFoodItems;
            currentNutritionStateChanged = true;
        }

        const mergedMealHistory = mergeItemArray(localNutritionState.mealHistory, remoteNutritionState.mealHistory, 'mealHistory');
        if (mergedMealHistory !== localNutritionState.mealHistory) {
            localNutritionState.mealHistory = mergedMealHistory;
            currentNutritionStateChanged = true;
        }
        
        if (new Date(remoteNutritionState.lastModified || 0) > new Date(localNutritionState.lastModified || 0)) {
            if (JSON.stringify(localNutritionState.waterIntake) !== JSON.stringify(remoteNutritionState.waterIntake)){ // Example
                localNutritionState.waterIntake = remoteNutritionState.waterIntake;
                currentNutritionStateChanged = true;
            }
             // Add other simple fields from nutritionState here
        }

        if (currentNutritionStateChanged || (remoteNutritionState.lastModified && new Date(remoteNutritionState.lastModified) > new Date(localNutritionState.lastModified || 0))) {
          localNutritionState.lastModified = remoteNutritionState.lastModified || new Date().toISOString();
          secureStorage.set('nutritionState', localNutritionState);
          changedKeys.push('nutritionState');
          needsLocalUpdate = true;
          console.log('🔄 AuthContext: nutritionState updated after deep merge.');
        }
      }

      if (needsLocalUpdate) {
        console.log('🔄 AuthContext: Local data updated from remote. Changed keys:', changedKeys);
        window.dispatchEvent(new CustomEvent('userDataSynced', { detail: { source: 'realtime', changedKeys } }));
      } else {
        console.log('🔄 AuthContext: Deep merge complete. No local data changes were made based on remote.');
      }

    } catch (error) {
      console.error('❌ AuthContext: Error during deep merge:', error);
      // Potentially dispatch an error event or set an error state
    } finally {
      isSyncing.current = false;
      console.log('🔄 AuthContext: Deep merge finished.');
    }
  }, [isDemoMode]); // userRef is accessed directly. isDemoMode is used.

  useEffect(() => {
    let mounted = true;
    let initComplete = false;
    const initializationAttemptsRef = { current: 0 };
    const lastInitializationTimeRef = { current: Date.now() };

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
    const { data: authStateChangeResult, error: authStateChangeError } = authService.onAuthStateChange(
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
        
        if (session && (!session.user || (session.expires_at && Math.floor(Date.now() / 1000) > session.expires_at))) {
          console.warn('🔧 AuthContext: Invalid session detected in auth state change, treating as signed out');
          event = 'SIGNED_OUT';
          session = null;
        }
        
        if (mounted) {
          if (event === 'SIGNED_OUT') {
            console.log('🔧 AuthContext: Auth state changed to SIGNED_OUT. Clearing user and local data.');
            if (supabaseSubscription.current && typeof supabaseSubscription.current.unsubscribe === 'function') {
              console.log('🔧 AuthContext: Unsubscribing from real-time updates (on SIGNED_OUT).');
              supabaseSubscription.current.unsubscribe();
              supabaseSubscription.current = null;
            }
            setUser(null);
            userRef.current = null;
            await clearLocalData();
            setIsDemoMode(false);
            setLoading(false);
            setIsInitialized(true);
            setAppRebuildHash(Math.random().toString(36).substring(7));

          } else if (event === 'SIGNED_IN' && session?.user) {
            console.log('🔧 AuthContext: Processing SIGNED_IN event - START');
            setUser(session.user);
            userRef.current = session.user;
            setError(null);
            setLoading(false);
            setIsInitialized(true);
            setIsDemoMode(false);

            if (!isDemoMode) {
              autoSyncService.enable();
              console.log('🔧 AuthContext: Auto-sync enabled for authenticated user');

              // Perform initial safe sync FIRST
              console.log('🔧 AuthContext: Starting initial safe sync for user:', session.user.email);
              safeSyncService.performLoginSync(session.user)
                .then(syncResult => {
                  console.log('🔧 AuthContext: Initial login sync completed.', syncResult);
                  if (syncResult.success && syncResult.hasUpdates) {
                     window.dispatchEvent(new CustomEvent('userDataSynced', { detail: { source: 'initial', updatedKeys: syncResult.updatedKeys } }));
                  }
                  // After initial sync, (re)set up real-time subscription
                  // Ensure we are subscribing for the currently confirmed user
                  if (userRef.current && userRef.current.id === session.user.id) {
                    if (supabaseSubscription.current && typeof supabaseSubscription.current.unsubscribe === 'function') {
                      console.log('🔧 AuthContext: Unsubscribing existing real-time subscription before new setup.');
                      supabaseSubscription.current.unsubscribe();
                      supabaseSubscription.current = null;
                    }
                    if (dataService && typeof dataService.subscribeToUserData === 'function') {
                      console.log('🔧 AuthContext: Setting up real-time subscription for user ID:', session.user.id);
                      supabaseSubscription.current = dataService.subscribeToUserData(session.user.id, (payload) => {
                        console.log('🔔 AuthContext: Real-time data received. Payload:', payload);
                        if (payload.new?.user_id === userRef.current?.id) {
                           if (payload.eventType === 'UPDATE' && payload.old?.data && payload.new?.data && JSON.stringify(payload.old.data) === JSON.stringify(payload.new.data)) {
                                console.log('🔄 AuthContext: Real-time update received, but data is identical to old data. Skipping merge.');
                                return;
                           }
                           console.log('🔄 AuthContext: Forwarding real-time payload to deepMergeStates.');
                           deepMergeStates(payload);
                        } else {
                          console.log('🔄 AuthContext: Received real-time update for a different/old user or irrelevant. Ignoring.', {
                            payloadUserId: payload.new?.user_id,
                            currentUserRefId: userRef.current?.id
                          });
                        }
                      });
                      if (supabaseSubscription.current) {
                         console.log('🔧 AuthContext: Real-time subscription successfully established.');
                      } else {
                         console.warn('🔧 AuthContext: Failed to establish real-time subscription (subscribeToUserData returned null/undefined).');
                      }
                    } else {
                      console.warn('🔧 AuthContext: dataService.subscribeToUserData is not available. Real-time sync disabled.');
                    }
                  } else {
                     console.warn('🔧 AuthContext: User changed during/after initial sync or no userRef.current.id; skipping real-time subscription setup for this event.');
                  }
                })
                .catch(err => {
                  console.error('❌ AuthContext: Error during initial login sync or subscription setup:', err);
                   window.dispatchEvent(new CustomEvent('loginSyncFailed', {
                    detail: {
                      message: 'Initial cloud sync failed. Please try manually or refresh.',
                      error: err.message
                    }
                  }));
                });
            }
            console.log('🔧 AuthContext: Processing SIGNED_IN event - END. User set, loading false, initialized true.');
            return; 
          }
          
          // Handle other events (TOKEN_REFRESHED, USER_UPDATED) or initial session check
          const newUser = session?.user ?? null;
          const currentUserId = userRef.current?.id;
          const newUserId = newUser?.id;

          if (currentUserId !== newUserId) {
            console.log('🔧 AuthContext: User changed (e.g., token refresh with same user, or different user), updating state.');
            setUser(newUser);
          }
          
          // Ensure loading is false if it's still true and we have a session or no session (initial load)
          // This also covers the case where initializeAuth might not have set loading to false
          if (loading) { // Use direct state 'loading'
             console.log('🔧 AuthContext: Auth state change (other event), setting loading to false.');
             setLoading(false);
          }

          if (!isInitialized) { // Use direct state 'isInitialized'
            console.log('🔧 AuthContext: Auth state change (other event), setting isInitialized to true.');
            setIsInitialized(true);
          }
        }
      }
    );

    // Emergency failsafe for stuck authentication
    const emergencyTimer = setTimeout(() => {
      // use 'mounted' to ensure this doesn't run after unmount, and 'loading' state variable
      if (mounted && !initComplete && loading) { 
        console.error('🚨 AuthContext: Emergency timeout reached while still loading, clearing cache and reloading...');
        // clearCacheAndReload(); // Temporarily disabled for debugging rapid refresh. Review if needed.
        // As a less drastic measure, ensure loading is false and user is null.
        if (mounted) {
            setUser(null);
            setError(new Error('Authentication emergency timeout'));
            setLoading(false);
            setIsInitialized(true); 
        }
      }
    }, 20000); // 20 second emergency timeout

    return () => {
      mounted = false;
      clearTimeout(emergencyTimer);
      
      autoSyncService.destroy();
      console.log('🔧 AuthContext: Auto-sync service cleaned up');
      
      if (supabaseSubscription.current && typeof supabaseSubscription.current.unsubscribe === 'function') {
        console.log('🔧 AuthContext: Unsubscribing from real-time updates on component unmount.');
        supabaseSubscription.current.unsubscribe();
        supabaseSubscription.current = null;
      }
      
      if (authStateChangeResult?.subscription?.unsubscribe) {
        console.log('🔧 AuthContext: Unsubscribing from auth state changes.');
        authStateChangeResult.subscription.unsubscribe();
      } else if (authStateChangeResult?.data?.subscription?.unsubscribe) {
         console.log('🔧 AuthContext: Unsubscribing from auth state changes (fallback path).');
        authStateChangeResult.data.subscription.unsubscribe();
      } else {
        console.log('🔧 AuthContext: No auth state subscription to unsubscribe or structure changed.');
      }
      if(authStateChangeError) {
        console.error("🔧 AuthContext: Error during onAuthStateChange setup", authStateChangeError);
      }
    }; // This is the end of the main useEffect's callback function body
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepMergeStates, isDemoMode]); // Dependencies for the main useEffect

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
    if (isSyncing.current) {
      console.log('🔧 AuthContext: Cloud save skipped, sync already in progress.');
      return { success: false, error: 'Sync in progress' };
    }
    if (!userRef.current && !isDemoMode) {
      console.log('🔧 AuthContext: No user available for cloud save');
      return { success: false, error: 'No user authenticated' };
    }
    
    console.log('🔧 AuthContext: Starting cloud save for user:', userRef.current?.email || 'Demo User');
    isSyncing.current = true;

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
        // Ensure lastModified is updated at the root for SafeSyncService compatibility
        lastModified: new Date().toISOString() 
      };
      
      console.log('🔧 AuthContext: Prepared data for cloud save:', {
        userId: userRef.current?.id,
        dataKeys: Object.keys(dataToSave),
        sizes: {
          workoutState: Object.keys(workoutData).length,
          userProfile: Object.keys(userProfile).length,
          gamificationState: Object.keys(gamificationData).length,
          nutritionState: Object.keys(nutritionData).length
        }
      });
      
      const { error } = await dataService.saveUserData(userRef.current.id, dataToSave);
      
      if (error) {
        console.error('🔧 AuthContext: Error saving user data to cloud:', error);
        isSyncing.current = false;
        return { success: false, error };
      }
      
      secureStorage.set('lastSyncTime', new Date().toISOString());
      console.log('🔧 AuthContext: User data saved to cloud successfully');
      isSyncing.current = false;
      return { success: true };
    } catch (error) {
      console.error('🔧 AuthContext: Error saving user data to cloud:', error);
      isSyncing.current = false;
      return { success: false, error };
    }
  }, [isDemoMode]);

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

  const signOut = async (options = { saveBeforeSignOut: true }) => {
    const { saveBeforeSignOut } = options;
    console.log(`🔧 AuthContext: signOut called. Save before sign out: ${saveBeforeSignOut}`);
    setLoading(true);
    setError(null);
    
    try {
      // Unsubscribe from real-time updates early in the sign-out process for authenticated users
      if (userRef.current && !isDemoMode) {
        if (supabaseSubscription.current && typeof supabaseSubscription.current.unsubscribe === 'function') {
          console.log('🔧 AuthContext: Unsubscribing from real-time updates during sign out.');
          supabaseSubscription.current.unsubscribe();
          supabaseSubscription.current = null;
        }
      }

      if (isDemoMode) {
        console.log('🔧 AuthContext: Demo mode - performing local logout');
        await clearLocalData();
        setUser(null);
        userRef.current = null;
        setIsDemoMode(false);
        setLoading(false);
        return { success: true };
      }
      
      if (userRef.current && saveBeforeSignOut) {
        try {
          console.log('🔧 AuthContext: Attempting to save data to cloud before logout...');
          await Promise.race([
            saveUserDataToCloud(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Save timeout')), 5000))
          ]);
          console.log('🔧 AuthContext: Data saved to cloud successfully');
        } catch (error) {
          console.warn('🔧 AuthContext: Failed to save data to cloud before logout, continuing anyway:', error);
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
      
      // Clear local data (moved here to ensure it happens after potential save)
      await clearLocalData();
      
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

  const loadUserDataFromCloud = async (userIdToLoad) => {
    const targetUserId = userIdToLoad || (userRef.current && userRef.current.id);

    if (!targetUserId && !isDemoMode) {
      console.warn('🔧 AuthContext: No user ID available for loading data from cloud.');
      return { success: false, error: 'No user ID available for loading data from cloud' };
    }

    console.log('🔧 AuthContext: Attempting to load user data from cloud for user:', targetUserId);
    isSyncing.current = true;

    try {
      const { data: remoteData, error } = await dataService.getUserData(targetUserId);
      
      if (error) {
        console.error('Error loading user data from cloud:', error);
        isSyncing.current = false;
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
        
        isSyncing.current = false;
        return { success: true, data: remoteData };
      }
      
      isSyncing.current = false;
      return { success: true, data: {} };
    } catch (error) {
      console.error('Error loading user data from cloud:', error);
      isSyncing.current = false;
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
    clearError: () => setError(null),
    appRebuildHash
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