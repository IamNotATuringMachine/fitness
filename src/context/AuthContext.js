import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, dataService } from '../services/SupabaseService';
import { secureStorage } from '../utils/security';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { session } = await authService.getSession();
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError(error);
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null);

          // Handle sign out - clear local data
          if (event === 'SIGNED_OUT') {
            await clearLocalData();
          }

          // Handle sign in - sync data
          if (event === 'SIGNED_IN' && session?.user) {
            await syncUserDataOnSignIn(session.user);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearLocalData = async () => {
    try {
      // Clear sensitive data but keep app preferences
      secureStorage.remove('workoutState');
      secureStorage.remove('userProfile');
      secureStorage.remove('gamificationState');
      secureStorage.remove('nutritionState');
      secureStorage.remove('lastSyncTime');
      secureStorage.remove('authToken');
      
      console.log('Local data cleared on sign out');
    } catch (error) {
      console.error('Error clearing local data:', error);
    }
  };

  const syncUserDataOnSignIn = async (user) => {
    try {
      console.log('Syncing user data on sign in...');
      
      // Get remote data
      const { data: remoteData } = await dataService.getUserData(user.id);
      
      if (remoteData && Object.keys(remoteData).length > 0) {
        // Merge with local data if exists
        const localData = secureStorage.get('workoutState') || {};
        
        // Simple merge strategy - remote takes precedence for now
        // In a more sophisticated implementation, you'd do conflict resolution
        const mergedData = {
          ...localData,
          ...remoteData
        };
        
        secureStorage.set('workoutState', mergedData);
        secureStorage.set('lastSyncTime', new Date().toISOString());
        
        console.log('User data synced successfully');
      }
    } catch (error) {
      console.error('Error syncing user data on sign in:', error);
    }
  };

  const signUp = async (email, password, userData = {}) => {
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
    try {
      setLoading(true);
      setError(null);
      
      // Save current data to cloud before signing out
      if (user) {
        await saveUserDataToCloud();
      }
      
      const { error } = await authService.signOut();
      
      if (error) {
        setError(error);
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
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

  const saveUserDataToCloud = async () => {
    if (!user) return;
    
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
      
      const { error } = await dataService.saveUserData(user.id, dataToSave);
      
      if (error) {
        console.error('Error saving user data to cloud:', error);
        return { success: false, error };
      }
      
      secureStorage.set('lastSyncTime', new Date().toISOString());
      console.log('User data saved to cloud successfully');
      
      return { success: true };
    } catch (error) {
      console.error('Error saving user data to cloud:', error);
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
    signUp,
    signIn,
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