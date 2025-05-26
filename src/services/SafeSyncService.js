import { secureStorage } from '../utils/security';
import { dataService } from './SupabaseService';

class SafeSyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.isAuthenticated = false;
    this.userId = null;
    this.lastSyncTime = null;
    
    // Default/empty data patterns to recognize
    this.defaultPatterns = {
      workoutState: {
        workoutPlans: [],
        exercises: [],
        workoutHistory: [],
        userProfile: {},
        currentWorkout: null,
        measurements: []
      },
      nutritionState: {
        nutritionPlans: [],
        foodItems: [],
        mealHistory: [],
        waterIntake: []
      },
      gamificationState: {
        userLevel: 1,
        userPoints: 0,
        badges: [],
        challenges: [],
        streaks: {
          currentWorkoutStreak: 0,
          longestWorkoutStreak: 0,
          currentNutritionStreak: 0,
          longestNutritionStreak: 0
        }
      }
    };
  }

  // Check if data looks like default/empty data
  isDefaultData(data, type) {
    if (!data || typeof data !== 'object') return true;
    
    const defaultPattern = this.defaultPatterns[type];
    if (!defaultPattern) return false;
    
    // Check if all important arrays are empty
    for (const [key, defaultValue] of Object.entries(defaultPattern)) {
      const currentValue = data[key];
      
      if (Array.isArray(defaultValue)) {
        // For arrays, check if they're empty
        if (currentValue && Array.isArray(currentValue) && currentValue.length > 0) {
          return false; // Has actual data
        }
      } else if (typeof defaultValue === 'object' && defaultValue !== null) {
        // For objects, check if they have meaningful content
        if (currentValue && typeof currentValue === 'object' && Object.keys(currentValue).length > 0) {
          return false; // Has actual data
        }
      } else if (typeof defaultValue === 'number') {
        // For numbers, check if they're above default thresholds
        if (currentValue && currentValue > defaultValue) {
          return false; // Has meaningful progress
        }
      }
    }
    
    return true; // Looks like default data
  }

  // Calculate data freshness score
  getDataFreshness(data) {
    const now = Date.now();
    const dataTimestamp = data.lastModified ? new Date(data.lastModified).getTime() : 0;
    const ageInHours = (now - dataTimestamp) / (1000 * 60 * 60);
    
    return {
      timestamp: dataTimestamp,
      ageInHours,
      isRecent: ageInHours < 24 // Data is recent if less than 24 hours old
    };
  }

  // Smart merge strategy to prevent data loss
  smartMerge(localData, remoteData, dataType) {
    if (!localData && !remoteData) return null;
    if (!localData) return remoteData;
    if (!remoteData) return localData;

    const localIsDefault = this.isDefaultData(localData, dataType);
    const remoteIsDefault = this.isDefaultData(remoteData, dataType);
    
    // If remote has data and local is default, use remote
    if (!remoteIsDefault && localIsDefault) {
      console.log(`📥 SafeSync: Using remote ${dataType} (local is default)`);
      return remoteData;
    }
    
    // If local has data and remote is default, use local
    if (!localIsDefault && remoteIsDefault) {
      console.log(`📤 SafeSync: Keeping local ${dataType} (remote is default)`);
      return localData;
    }
    
    // If both have data, use timestamp-based merging
    const localFreshness = this.getDataFreshness(localData);
    const remoteFreshness = this.getDataFreshness(remoteData);
    
    if (remoteFreshness.timestamp > localFreshness.timestamp) {
      console.log(`📥 SafeSync: Using remote ${dataType} (newer: ${remoteFreshness.ageInHours.toFixed(1)}h vs ${localFreshness.ageInHours.toFixed(1)}h)`);
      return remoteData;
    } else {
      console.log(`📤 SafeSync: Keeping local ${dataType} (newer: ${localFreshness.ageInHours.toFixed(1)}h vs ${remoteFreshness.ageInHours.toFixed(1)}h)`);
      return localData;
    }
  }

  // Immediate sync on login - pull first, never overwrite with defaults
  async performLoginSync(user) {
    this.userId = user.id;
    this.isAuthenticated = true;
    
    console.log('🔄 SafeSync: Starting immediate login sync for user:', user.email);
    
    try {
      // Step 1: Always fetch remote data first
      console.log('📥 SafeSync: Fetching data from cloud...');
      const { data: remoteData, error: fetchError } = await dataService.getUserData(user.id);
      
      if (fetchError) {
        console.warn('⚠️ SafeSync: Failed to fetch remote data:', fetchError);
        return { success: false, error: fetchError, phase: 'fetch' };
      }

      // Step 2: Get current local data
      const localWorkoutData = secureStorage.get('workoutState') || {};
      const localUserProfile = secureStorage.get('userProfile') || {};
      const localGamificationData = secureStorage.get('gamificationState') || {};
      const localNutritionData = secureStorage.get('nutritionState') || {};

      // Step 3: Apply smart merging for each data type
      const mergedData = {};
      let hasUpdates = false;

      if (remoteData?.workoutState) {
        const merged = this.smartMerge(localWorkoutData, remoteData.workoutState, 'workoutState');
        if (merged !== localWorkoutData) {
          mergedData.workoutState = merged;
          hasUpdates = true;
        }
      }

      if (remoteData?.userProfile) {
        const merged = this.smartMerge(localUserProfile, remoteData.userProfile, 'userProfile');
        if (merged !== localUserProfile) {
          mergedData.userProfile = merged;
          hasUpdates = true;
        }
      }

      if (remoteData?.gamificationState) {
        const merged = this.smartMerge(localGamificationData, remoteData.gamificationState, 'gamificationState');
        if (merged !== localGamificationData) {
          mergedData.gamificationState = merged;
          hasUpdates = true;
        }
      }

      if (remoteData?.nutritionState) {
        const merged = this.smartMerge(localNutritionData, remoteData.nutritionState, 'nutritionState');
        if (merged !== localNutritionData) {
          mergedData.nutritionState = merged;
          hasUpdates = true;
        }
      }

      // Step 4: Apply updates to local storage
      if (hasUpdates) {
        console.log('📝 SafeSync: Applying merged data to local storage');
        Object.entries(mergedData).forEach(([key, value]) => {
          secureStorage.set(key, value);
        });

        // Notify UI of data updates
        window.dispatchEvent(new CustomEvent('safeDataSynced', { 
          detail: { 
            timestamp: new Date().toISOString(),
            updatedKeys: Object.keys(mergedData)
          } 
        }));
      }

      // Step 5: Only push to cloud if we have non-default local data that's newer
      const shouldPushToCloud = this.shouldPushLocalData(
        { 
          workoutState: localWorkoutData, 
          userProfile: localUserProfile,
          gamificationState: localGamificationData,
          nutritionState: localNutritionData
        },
        remoteData
      );

      if (shouldPushToCloud.shouldPush) {
        console.log('📤 SafeSync: Pushing local changes to cloud:', shouldPushToCloud.reasons);
        await this.pushSafeToCloud(shouldPushToCloud.dataToPush);
      }

      this.lastSyncTime = new Date().toISOString();
      secureStorage.set('lastSyncTime', this.lastSyncTime);

      console.log('✅ SafeSync: Login sync completed successfully');
      return { 
        success: true, 
        hasUpdates,
        updatedKeys: Object.keys(mergedData),
        pushedToCloud: shouldPushToCloud.shouldPush
      };

    } catch (error) {
      console.error('❌ SafeSync: Login sync failed:', error);
      return { success: false, error, phase: 'sync' };
    }
  }

  // Determine if local data should be pushed to cloud
  shouldPushLocalData(localData, remoteData) {
    const dataToPush = {};
    const reasons = [];
    
    Object.entries(localData).forEach(([key, localValue]) => {
      const remoteValue = remoteData?.[key];
      
      // Don't push if local data is default/empty
      if (this.isDefaultData(localValue, key)) {
        return;
      }
      
      // Push if remote doesn't have this data type
      if (!remoteValue) {
        dataToPush[key] = { ...localValue, lastModified: new Date().toISOString() };
        reasons.push(`${key}: remote missing`);
        return;
      }
      
      // Push if local data is newer OR if timestamps are identical but content differs
      const localFreshness = this.getDataFreshness(localValue);
      const remoteFreshness = this.getDataFreshness(remoteValue);
      
      if (localFreshness.timestamp > remoteFreshness.timestamp ||
          (localFreshness.timestamp === remoteFreshness.timestamp && JSON.stringify(localValue) !== JSON.stringify(remoteValue))
      ) {
        // Always update lastModified for the data being pushed to ensure it's the newest on next sync
        dataToPush[key] = { ...localValue, lastModified: new Date().toISOString() };
        reasons.push(`${key}: local newer or content changed`);
      }
    });
    
    return {
      shouldPush: Object.keys(dataToPush).length > 0,
      dataToPush,
      reasons
    };
  }

  // Safely push data to cloud
  async pushSafeToCloud(dataToPush) {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await dataService.saveUserData(this.userId, dataToPush);
      
      if (error) {
        throw new Error(`Failed to save to cloud: ${error.message}`);
      }
      
      console.log('📤 SafeSync: Data pushed to cloud successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ SafeSync: Failed to push to cloud:', error);
      throw error;
    }
  }

  // Force immediate bidirectional sync
  async forceSync() {
    if (!this.isAuthenticated || !this.userId) {
      return { success: false, error: 'Not authenticated' };
    }

    console.log('🔄 SafeSync: Starting forced sync');
    
    try {
      const { data: remoteData, error } = await dataService.getUserData(this.userId);
      
      if (error) {
        return { success: false, error };
      }

      // Get all local data
      const allLocalData = {
        workoutState: secureStorage.get('workoutState') || {},
        userProfile: secureStorage.get('userProfile') || {},
        gamificationState: secureStorage.get('gamificationState') || {},
        nutritionState: secureStorage.get('nutritionState') || {}
      };

      // Smart merge everything
      const updates = {};
      let hasChanges = false;

      Object.entries(allLocalData).forEach(([key, localValue]) => {
        const remoteValue = remoteData?.[key];
        const merged = this.smartMerge(localValue, remoteValue, key);
        
        if (JSON.stringify(merged) !== JSON.stringify(localValue)) {
          updates[key] = merged;
          hasChanges = true;
        }
      });

      // Apply updates
      if (hasChanges) {
        Object.entries(updates).forEach(([key, value]) => {
          secureStorage.set(key, value);
        });
      }

      // Push any new local data
      const pushResult = this.shouldPushLocalData(allLocalData, remoteData);
      if (pushResult.shouldPush) {
        await this.pushSafeToCloud(pushResult.dataToPush);
      }

      return { 
        success: true, 
        localUpdates: hasChanges ? Object.keys(updates) : [],
        cloudUpdates: pushResult.shouldPush
      };
    } catch (error) {
      console.error('❌ SafeSync: Force sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Check for cloud changes without syncing
  async checkForCloudChanges() {
    if (!this.isAuthenticated || !this.userId) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Get remote data to check timestamps
      const { data: remoteData, error } = await dataService.getUserData(this.userId);
      
      if (error) {
        return { success: false, error };
      }

      if (!remoteData) {
        return { success: true, hasChanges: false };
      }

      // Get local data timestamps
      const localWorkoutData = secureStorage.get('workoutState') || {};
      const localUserProfile = secureStorage.get('userProfile') || {};
      const localGamificationData = secureStorage.get('gamificationState') || {};
      const localNutritionData = secureStorage.get('nutritionState') || {};

      const localData = {
        workoutState: localWorkoutData,
        userProfile: localUserProfile,
        gamificationState: localGamificationData,
        nutritionState: localNutritionData
      };

      // Check if any remote data is newer than local
      let hasChanges = false;
      const changedKeys = [];

      Object.entries(remoteData).forEach(([key, remoteValue]) => {
        const localValue = localData[key];
        
        if (remoteValue && typeof remoteValue === 'object') {
          const localFreshness = this.getDataFreshness(localValue);
          const remoteFreshness = this.getDataFreshness(remoteValue);
          
          // Check if remote is newer and not default data
          if (remoteFreshness.timestamp > localFreshness.timestamp && 
              !this.isDefaultData(remoteValue, key)) {
            hasChanges = true;
            changedKeys.push(key);
          }
        }
      });

      return { 
        success: true, 
        hasChanges,
        changedKeys,
        remoteDataTimestamp: remoteData.lastModified
      };
    } catch (error) {
      console.error('❌ SafeSync: Check for cloud changes failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get sync status
  getStatus() {
    return {
      isAuthenticated: this.isAuthenticated,
      isOnline: this.isOnline,
      userId: this.userId,
      lastSyncTime: this.lastSyncTime
    };
  }
}

// Create singleton instance
const safeSyncService = new SafeSyncService();

export default safeSyncService; 