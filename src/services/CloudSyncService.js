import { secureStorage } from '../utils/security';
import { authService, dataService } from './SupabaseService';

class CloudSyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.isAuthenticated = false;
    this.userId = null;
    this.lastSyncTime = null;
    this.conflictResolutionStrategy = 'latest-wins'; // 'latest-wins', 'manual', 'merge'
    
    // Configuration
    this.config = {
      syncInterval: 30000, // 30 seconds
      maxRetries: 3,
      retryDelay: 1000,
      batchSize: 50,
      compressionEnabled: true,
      encryptionEnabled: true
    };
    
    this.initialize();
  }

  async initialize() {
    // Check authentication status
    this.isAuthenticated = await this.checkAuthStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Start periodic sync if authenticated and online
    if (this.isAuthenticated && this.isOnline) {
      this.startPeriodicSync();
    }
    
    // Listen for app visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isAuthenticated) {
        this.triggerSync();
      }
    });
  }

  async checkAuthStatus() {
    try {
      const { user } = await authService.getCurrentUser();
      if (user) {
        this.userId = user.id;
        this.isAuthenticated = true;
        return true;
      }
      
      this.isAuthenticated = false;
      this.userId = null;
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      this.isAuthenticated = false;
      this.userId = null;
      return false;
    }
  }

  async authenticate(credentials) {
    try {
      const { data, error } = await authService.signIn(credentials.email, credentials.password);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      if (data?.user) {
        this.userId = data.user.id;
        this.isAuthenticated = true;
        
        // Start syncing after authentication
        if (this.isOnline) {
          await this.performFullSync();
          this.startPeriodicSync();
        }
        
        return { success: true, user: data.user };
      }
      
      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Authentication failed:', error);
      return { success: false, error: 'Network error during authentication' };
    }
  }

  async signOut() {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.isAuthenticated = false;
      this.userId = null;
      this.stopPeriodicSync();
    }
  }

  // Main sync methods
  async performFullSync() {
    if (!this.isAuthenticated || !this.isOnline) {
      console.log('Cannot perform full sync: not authenticated or offline');
      return { success: false, error: 'Not authenticated or offline' };
    }

    try {
      console.log('Starting full sync...');
      
      const startTime = Date.now();
      const localData = await this.getLocalData();
      const remoteData = await this.getRemoteData();
      
      // Merge and resolve conflicts
      const mergedData = await this.mergeData(localData, remoteData);
      
      // Apply changes locally
      await this.applyLocalChanges(mergedData.localChanges);
      
      // Push changes to remote
      if (mergedData.remoteChanges.length > 0) {
        await this.pushToRemote(mergedData.remoteChanges);
      }
      
      this.lastSyncTime = new Date().toISOString();
      secureStorage.set('lastSyncTime', this.lastSyncTime);
      
      const syncDuration = Date.now() - startTime;
      console.log(`Full sync completed in ${syncDuration}ms`);
      
      return {
        success: true,
        syncTime: this.lastSyncTime,
        duration: syncDuration,
        changes: {
          local: mergedData.localChanges.length,
          remote: mergedData.remoteChanges.length
        }
      };
    } catch (error) {
      console.error('Full sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  async triggerSync() {
    if (!this.isAuthenticated || !this.isOnline) {
      return;
    }

    try {
      // Get changes since last sync
      const lastSync = secureStorage.get('lastSyncTime') || new Date(0).toISOString();
      const localChanges = await this.getLocalChangesSince(lastSync);
      const remoteChanges = await this.getRemoteChangesSince(lastSync);
      
      if (localChanges.length === 0 && remoteChanges.length === 0) {
        console.log('No changes to sync');
        return { success: true, changes: 0 };
      }
      
      // Process changes
      const mergedChanges = await this.mergeChanges(localChanges, remoteChanges);
      
      // Apply local changes
      if (mergedChanges.localChanges.length > 0) {
        await this.applyLocalChanges(mergedChanges.localChanges);
      }
      
      // Push remote changes
      if (mergedChanges.remoteChanges.length > 0) {
        await this.pushToRemote(mergedChanges.remoteChanges);
      }
      
      this.lastSyncTime = new Date().toISOString();
      secureStorage.set('lastSyncTime', this.lastSyncTime);
      
      return {
        success: true,
        changes: localChanges.length + remoteChanges.length,
        conflicts: mergedChanges.conflicts
      };
    } catch (error) {
      console.error('Sync failed:', error);
      this.addToSyncQueue('retry-sync', { timestamp: Date.now() });
      return { success: false, error: error.message };
    }
  }

  // Data synchronization
  async getLocalData() {
    const workoutData = secureStorage.get('workoutState') || {};
    const userData = secureStorage.get('userProfile') || {};
    const settingsData = secureStorage.get('userSettings') || {};
    
    return {
      workouts: workoutData.workoutHistory || [],
      plans: workoutData.workoutPlans || [],
      measurements: workoutData.bodyMeasurements || [],
      profile: userData,
      settings: settingsData,
      lastModified: secureStorage.get('dataLastModified') || new Date(0).toISOString()
    };
  }

  async getRemoteData() {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await dataService.getUserData(this.userId);
    
    if (error) {
      throw new Error(`Failed to fetch remote data: ${error.message}`);
    }
    
    return data || {};
  }

  async getLocalChangesSince(timestamp) {
    // Get changes from local change log
    const changeLog = secureStorage.get('changeLog') || [];
    return changeLog.filter(change => change.timestamp > timestamp);
  }

  async getRemoteChangesSince(timestamp) {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await dataService.getUserDataChangesSince(this.userId, timestamp);
    
    if (error) {
      throw new Error(`Failed to fetch remote changes: ${error.message}`);
    }
    
    return data || [];
  }

  async mergeData(localData, remoteData) {
    const conflicts = [];
    const localChanges = [];
    const remoteChanges = [];
    
    // Compare timestamps and resolve conflicts
    const localTime = new Date(localData.lastModified).getTime();
    const remoteTime = new Date(remoteData.lastModified).getTime();
    
    // Workout history merge
    const { merged: mergedWorkouts, conflicts: workoutConflicts } = 
      this.mergeArrays(localData.workouts, remoteData.workouts, 'id');
    
    if (workoutConflicts.length > 0) {
      conflicts.push(...workoutConflicts.map(c => ({ type: 'workout', ...c })));
    }
    
    // Plans merge
    const { merged: mergedPlans, conflicts: planConflicts } = 
      this.mergeArrays(localData.plans, remoteData.plans, 'id');
    
    if (planConflicts.length > 0) {
      conflicts.push(...planConflicts.map(c => ({ type: 'plan', ...c })));
    }
    
    // Determine what needs to be updated
    if (localTime > remoteTime) {
      // Local is newer, push to remote
      remoteChanges.push({
        type: 'update',
        data: {
          workouts: mergedWorkouts,
          plans: mergedPlans,
          measurements: localData.measurements,
          profile: localData.profile,
          settings: localData.settings
        }
      });
    } else if (remoteTime > localTime) {
      // Remote is newer, update local
      localChanges.push({
        type: 'update',
        data: {
          workouts: mergedWorkouts,
          plans: mergedPlans,
          measurements: remoteData.measurements,
          profile: remoteData.profile,
          settings: remoteData.settings
        }
      });
    }
    
    return { localChanges, remoteChanges, conflicts };
  }

  mergeArrays(localArray, remoteArray, idField) {
    const conflicts = [];
    const merged = [];
    const localMap = new Map(localArray.map(item => [item[idField], item]));
    const remoteMap = new Map(remoteArray.map(item => [item[idField], item]));
    
    // Process all unique IDs
    const allIds = new Set([...localMap.keys(), ...remoteMap.keys()]);
    
    for (const id of allIds) {
      const localItem = localMap.get(id);
      const remoteItem = remoteMap.get(id);
      
      if (!localItem) {
        // Only in remote
        merged.push(remoteItem);
      } else if (!remoteItem) {
        // Only in local
        merged.push(localItem);
      } else {
        // In both - check for conflicts
        const localTime = new Date(localItem.lastModified || localItem.date || 0).getTime();
        const remoteTime = new Date(remoteItem.lastModified || remoteItem.date || 0).getTime();
        
        if (this.areItemsEqual(localItem, remoteItem)) {
          // No conflict
          merged.push(localItem);
        } else {
          // Conflict detected
          conflicts.push({
            id,
            local: localItem,
            remote: remoteItem,
            resolution: this.resolveConflict(localItem, remoteItem)
          });
          
          // Use resolution strategy
          if (this.conflictResolutionStrategy === 'latest-wins') {
            merged.push(localTime > remoteTime ? localItem : remoteItem);
          } else {
            // For manual resolution, include both versions
            merged.push(localItem);
          }
        }
      }
    }
    
    return { merged, conflicts };
  }

  areItemsEqual(item1, item2) {
    // Deep comparison excluding timestamps
    const cleanItem1 = { ...item1 };
    const cleanItem2 = { ...item2 };
    
    delete cleanItem1.lastModified;
    delete cleanItem2.lastModified;
    delete cleanItem1.syncVersion;
    delete cleanItem2.syncVersion;
    
    return JSON.stringify(cleanItem1) === JSON.stringify(cleanItem2);
  }

  resolveConflict(localItem, remoteItem) {
    // Simple latest-wins strategy
    const localTime = new Date(localItem.lastModified || localItem.date || 0).getTime();
    const remoteTime = new Date(remoteItem.lastModified || remoteItem.date || 0).getTime();
    
    return localTime > remoteTime ? 'local' : 'remote';
  }

  async applyLocalChanges(changes) {
    for (const change of changes) {
      if (change.type === 'update') {
        const currentState = secureStorage.get('workoutState') || {};
        
        // Instead of completely overwriting, merge carefully
        const updatedState = this.mergeStatesCarefully(currentState, change.data);
        
        // Only update if there are actual changes
        if (JSON.stringify(updatedState) !== JSON.stringify(currentState)) {
          console.log('🔄 CloudSyncService: Applying carefully merged local changes');
          secureStorage.set('workoutState', updatedState);
          secureStorage.set('dataLastModified', new Date().toISOString());
        } else {
          console.log('🔄 CloudSyncService: No changes to apply');
        }
      }
    }
  }

  // Carefully merge states to preserve all data
  mergeStatesCarefully(currentState, newData) {
    const merged = { ...currentState };
    
    // Merge arrays by combining and deduplicating by ID
    if (newData.workoutPlans && Array.isArray(newData.workoutPlans)) {
      merged.workoutPlans = this.mergeArraysByIdWithTimestamp(
        currentState.workoutPlans || [], 
        newData.workoutPlans
      );
    }
    
    if (newData.exercises && Array.isArray(newData.exercises)) {
      merged.exercises = this.mergeArraysByIdWithTimestamp(
        currentState.exercises || [], 
        newData.exercises
      );
    }
    
    if (newData.workoutHistory && Array.isArray(newData.workoutHistory)) {
      merged.workoutHistory = this.mergeArraysByIdWithTimestamp(
        currentState.workoutHistory || [], 
        newData.workoutHistory
      );
    }
    
    if (newData.bodyMeasurements && Array.isArray(newData.bodyMeasurements)) {
      merged.bodyMeasurements = this.mergeArraysByIdWithTimestamp(
        currentState.bodyMeasurements || [], 
        newData.bodyMeasurements
      );
    }
    
    // Merge user profile carefully
    if (newData.userProfile) {
      merged.userProfile = { ...currentState.userProfile, ...newData.userProfile };
    }
    
    // Keep other properties that might exist
    Object.keys(newData).forEach(key => {
      if (!['workoutPlans', 'exercises', 'workoutHistory', 'bodyMeasurements', 'userProfile'].includes(key)) {
        merged[key] = newData[key];
      }
    });
    
    return merged;
  }
  
  // Merge arrays by ID, keeping newer items based on timestamp
  mergeArraysByIdWithTimestamp(currentArray, newArray) {
    const currentMap = new Map(currentArray.map(item => [item.id, item]));
    const newMap = new Map(newArray.map(item => [item.id, item]));
    
    // Start with current array
    const merged = [...currentArray];
    
    // Add or update items from new array
    newArray.forEach(newItem => {
      const currentItem = currentMap.get(newItem.id);
      
      if (!currentItem) {
        // New item, add it
        merged.push(newItem);
      } else {
        // Item exists, check which is newer
        const currentTime = new Date(currentItem.lastModified || currentItem.createdAt || currentItem.date || 0).getTime();
        const newTime = new Date(newItem.lastModified || newItem.createdAt || newItem.date || 0).getTime();
        
        if (newTime > currentTime || !currentItem.lastModified) {
          // New item is newer, replace it
          const index = merged.findIndex(item => item.id === newItem.id);
          if (index !== -1) {
            merged[index] = newItem;
          }
        }
        // If current item is newer or equal, keep it (don't replace)
      }
    });
    
    return merged;
  }

  async pushToRemote(changes) {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }
    
    for (const change of changes) {
      try {
        const { error } = await dataService.saveUserData(this.userId, change.data);
        
        if (error) {
          throw new Error(`Failed to push change: ${error.message}`);
        }
      } catch (error) {
        console.error('Failed to push change:', error);
        this.addToSyncQueue('push-change', change);
      }
    }
  }

  // Offline queue management
  addToSyncQueue(type, data) {
    this.syncQueue.push({
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString(),
      retries: 0
    });
    
    // Persist queue
    secureStorage.set('syncQueue', this.syncQueue);
  }

  async processSyncQueue() {
    if (!this.isOnline || !this.isAuthenticated) {
      return;
    }
    
    const queue = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const item of queue) {
      try {
        await this.processQueueItem(item);
      } catch (error) {
        console.error('Failed to process queue item:', error);
        
        if (item.retries < this.config.maxRetries) {
          item.retries++;
          this.syncQueue.push(item);
        } else {
          console.error('Max retries exceeded for queue item:', item);
        }
      }
    }
    
    secureStorage.set('syncQueue', this.syncQueue);
  }

  async processQueueItem(item) {
    switch (item.type) {
      case 'push-change':
        await this.pushToRemote([item.data]);
        break;
      case 'retry-sync':
        await this.triggerSync();
        break;
      default:
        console.warn('Unknown queue item type:', item.type);
    }
  }

  // Backup and restore
  async createBackup() {
    try {
      const localData = await this.getLocalData();
      const backup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        userId: this.userId,
        data: localData,
        checksum: await this.calculateChecksum(localData)
      };
      
      if (this.config.encryptionEnabled) {
        backup.data = await this.encryptData(backup.data);
        backup.encrypted = true;
      }
      
      return backup;
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw error;
    }
  }

  async restoreFromBackup(backup) {
    try {
      let data = backup.data;
      
      if (backup.encrypted) {
        data = await this.decryptData(data);
      }
      
      // Verify checksum
      const calculatedChecksum = await this.calculateChecksum(data);
      if (calculatedChecksum !== backup.checksum) {
        throw new Error('Backup integrity check failed');
      }
      
      // Apply data
      await this.applyLocalChanges([{ type: 'update', data }]);
      
      // Trigger sync to update remote
      if (this.isOnline) {
        await this.triggerSync();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw error;
    }
  }

  async calculateChecksum(data) {
    const dataString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async encryptData(data) {
    // Implement encryption using Web Crypto API
    // This is a simplified version
    const dataString = JSON.stringify(data);
    const encoder = new TextEncoder();
    return encoder.encode(dataString);
  }

  async decryptData(encryptedData) {
    // Implement decryption using Web Crypto API
    // This is a simplified version
    const decoder = new TextDecoder();
    const dataString = decoder.decode(encryptedData);
    return JSON.parse(dataString);
  }

  // Periodic sync
  startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      this.triggerSync();
    }, this.config.syncInterval);
  }

  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Event handling
  onSyncStart(callback) {
    this.addEventListener('syncStart', callback);
  }

  onSyncComplete(callback) {
    this.addEventListener('syncComplete', callback);
  }

  onSyncError(callback) {
    this.addEventListener('syncError', callback);
  }

  onConflict(callback) {
    this.addEventListener('conflict', callback);
  }

  addEventListener(event, callback) {
    if (!this.eventListeners) {
      this.eventListeners = {};
    }
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  emit(event, data) {
    if (this.eventListeners && this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  // Status and debugging
  getStatus() {
    return {
      isAuthenticated: this.isAuthenticated,
      isOnline: this.isOnline,
      userId: this.userId,
      lastSyncTime: this.lastSyncTime,
      queueSize: this.syncQueue.length,
      syncInterval: this.config.syncInterval
    };
  }

  // Cleanup
  destroy() {
    this.stopPeriodicSync();
    window.removeEventListener('online', this.onOnline);
    window.removeEventListener('offline', this.onOffline);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}

// Create singleton instance
const cloudSyncService = new CloudSyncService();

export default cloudSyncService; 