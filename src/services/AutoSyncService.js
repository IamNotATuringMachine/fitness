import { secureStorage } from '../utils/security';
import safeSyncService from './SafeSyncService';

class AutoSyncService {
  constructor() {
    this.debounceTimeout = null;
    this.syncDelay = 5000; // 5 seconds debounce delay to reduce sync conflicts
    this.isEnabled = false;
    this.isPaused = false; // Add pause capability
    this.watchedKeys = [
      'workoutState',
      'userProfile', 
      'nutritionState',
      'gamificationState',
      'userSettings'
    ];
    
    this.syncQueue = new Set();
    this.lastSyncTime = Date.now();
    this.minSyncInterval = 1000; // Minimum 1 second between syncs
    
    // Real-time cloud sync configuration
    this.cloudCheckInterval = 10000; // Check for cloud changes every 10 seconds
    this.cloudCheckTimer = null;
    this.lastCloudCheckTime = 0;
    this.isCheckingCloud = false;
    this.lastCloudDataHash = null;
    
    console.log('🔄 AutoSyncService: Initialized with real-time sync');
  }

  // Enable auto-sync for authenticated users
  enable() {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    this.wrapSecureStorage();
    this.startCloudChecking();
    console.log('✅ AutoSyncService: Auto-sync and real-time cloud checking enabled');
  }

  // Disable auto-sync (for demo mode or when offline)
  disable() {
    if (!this.isEnabled) return;
    
    this.isEnabled = false;
    this.clearDebounceTimeout();
    this.stopCloudChecking();
    this.unwrapSecureStorage();
    console.log('❌ AutoSyncService: Auto-sync and real-time cloud checking disabled');
  }

  // Wrap secureStorage.set to trigger automatic sync
  wrapSecureStorage() {
    if (secureStorage._originalSet) return; // Already wrapped
    
    // Store original method
    secureStorage._originalSet = secureStorage.set;
    
    // Override with auto-sync version
    secureStorage.set = (key, value) => {
      // Call original method
      const result = secureStorage._originalSet(key, value);
      
      // Trigger auto-sync if enabled and key is watched
      if (this.isEnabled && this.watchedKeys.includes(key)) {
        this.triggerAutoSync(key);
      }
      
      return result;
    };
    
    console.log('🔗 AutoSyncService: Wrapped secureStorage.set for auto-sync');
  }

  // Restore original secureStorage.set method
  unwrapSecureStorage() {
    if (secureStorage._originalSet) {
      secureStorage.set = secureStorage._originalSet;
      delete secureStorage._originalSet;
      console.log('🔗 AutoSyncService: Restored original secureStorage.set');
    }
  }

  // Trigger auto-sync with debouncing
  triggerAutoSync(changedKey) {
    // Check if auto-sync is temporarily paused
    if (this.isPaused) {
      console.log(`⏸️ AutoSyncService: Auto-sync paused, queuing ${changedKey} for later`);
      this.syncQueue.add(changedKey);
      return;
    }
    
    // Add to sync queue
    this.syncQueue.add(changedKey);
    
    // Clear existing timeout
    this.clearDebounceTimeout();
    
    // Set new debounced sync with longer delay to prevent conflicts
    this.debounceTimeout = setTimeout(() => {
      this.performAutoSync();
    }, this.syncDelay);
    
    console.log(`🔄 AutoSyncService: Queued auto-sync for key: ${changedKey}`);
  }

  // Temporarily pause auto-sync during critical operations
  pauseAutoSync() {
    this.isPaused = true;
    this.clearDebounceTimeout();
    console.log('⏸️ AutoSyncService: Auto-sync paused');
  }

  // Resume auto-sync and process queued changes
  resumeAutoSync() {
    this.isPaused = false;
    console.log('▶️ AutoSyncService: Auto-sync resumed');
    
    // Process any queued changes
    if (this.syncQueue.size > 0) {
      console.log(`🔄 AutoSyncService: Processing ${this.syncQueue.size} queued changes`);
      this.triggerAutoSync('queued-changes');
    }
  }

  // Perform the actual sync
  async performAutoSync() {
    if (!this.isEnabled) return;
    
    // Check minimum interval
    const now = Date.now();
    if (now - this.lastSyncTime < this.minSyncInterval) {
      console.log('⏳ AutoSyncService: Skipping sync due to minimum interval');
      return;
    }
    
    const changedKeys = Array.from(this.syncQueue);
    this.syncQueue.clear();
    
    console.log('🚀 AutoSyncService: Starting auto-sync for keys:', changedKeys);
    
    try {
      // Use the safe sync service for auto-sync operations
      const result = await safeSyncService.forceSync();
      
      if (result && result.success) {
        console.log('✅ AutoSyncService: Auto-sync completed successfully');
        
        // Show appropriate notification based on what happened
        if (result.localUpdates && result.localUpdates.length > 0) {
          this.showSyncNotification('success', `Data updated: ${result.localUpdates.join(', ')}`);
        } else if (result.cloudUpdates) {
          this.showSyncNotification('success', 'Data saved to cloud');
        } else {
          this.showSyncNotification('success', 'Data synchronized');
        }
      } else {
        console.warn('⚠️ AutoSyncService: Auto-sync completed with warnings:', result?.error);
        this.showSyncNotification('warning', 'Sync completed with warnings');
      }
      
      this.lastSyncTime = now;
      
      // Dispatch sync event for UI updates
      window.dispatchEvent(new CustomEvent('autoSyncCompleted', {
        detail: {
          success: true,
          changedKeys,
          timestamp: new Date().toISOString()
        }
      }));
      
    } catch (error) {
      console.error('❌ AutoSyncService: Auto-sync failed:', error);
      this.showSyncNotification('error', 'Auto-sync failed');
      
      // Dispatch error event
      window.dispatchEvent(new CustomEvent('autoSyncError', {
        detail: {
          error: error.message,
          changedKeys,
          timestamp: new Date().toISOString()
        }
      }));
    }
  }

  // Clear debounce timeout
  clearDebounceTimeout() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
  }

  // Show subtle sync notification - only dispatch events, no top-right UI
  showSyncNotification(type, message) {
    // Only dispatch events for the bottom-right AutoSyncIndicator component
    if (type === 'success') {
      window.dispatchEvent(new CustomEvent('autoSyncCompleted', {
        detail: {
          success: true,
          message: message,
          timestamp: new Date().toISOString()
        }
      }));
    } else if (type === 'error') {
      window.dispatchEvent(new CustomEvent('autoSyncError', {
        detail: {
          success: false,
          message: message,
          timestamp: new Date().toISOString()
        }
      }));
    }
    
    console.log(`🔄 AutoSync ${type}: ${message}`);
  }

  // Force immediate sync (bypass debouncing)
  async forceSyncNow() {
    if (!this.isEnabled) {
      console.log('⚠️ AutoSyncService: Cannot force sync - auto-sync is disabled');
      return;
    }
    
    this.clearDebounceTimeout();
    await this.performAutoSync();
  }

  // Get current status
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      isPaused: this.isPaused,
      queueSize: this.syncQueue.size,
      queuedKeys: Array.from(this.syncQueue),
      lastSyncTime: this.lastSyncTime,
      hasPendingSync: !!this.debounceTimeout,
      cloudChecking: {
        isActive: !!this.cloudCheckTimer,
        interval: this.cloudCheckInterval,
        lastCheckTime: this.lastCloudCheckTime,
        isChecking: this.isCheckingCloud
      }
    };
  }

  // Update configuration
  updateConfig(config) {
    if (config.syncDelay !== undefined) {
      this.syncDelay = Math.max(500, config.syncDelay); // Minimum 500ms
    }
    if (config.minSyncInterval !== undefined) {
      this.minSyncInterval = Math.max(1000, config.minSyncInterval); // Minimum 1s
    }
    if (config.watchedKeys !== undefined && Array.isArray(config.watchedKeys)) {
      this.watchedKeys = config.watchedKeys;
    }
    if (config.cloudCheckInterval !== undefined) {
      this.cloudCheckInterval = Math.max(5000, config.cloudCheckInterval); // Minimum 5s
      if (this.isEnabled) {
        this.stopCloudChecking();
        this.startCloudChecking();
      }
    }
    
    console.log('⚙️ AutoSyncService: Configuration updated:', {
      syncDelay: this.syncDelay,
      minSyncInterval: this.minSyncInterval,
      cloudCheckInterval: this.cloudCheckInterval,
      watchedKeys: this.watchedKeys
    });
  }

  // Start real-time cloud checking for multi-device sync
  startCloudChecking() {
    if (this.cloudCheckTimer) {
      clearInterval(this.cloudCheckTimer);
    }
    
    this.cloudCheckTimer = setInterval(() => {
      this.checkForCloudChanges();
    }, this.cloudCheckInterval);
    
    // Perform initial check after a short delay
    setTimeout(() => {
      this.checkForCloudChanges();
    }, 2000);
    
    console.log(`🌐 AutoSyncService: Started real-time cloud checking (${this.cloudCheckInterval/1000}s interval)`);
  }

  // Stop real-time cloud checking
  stopCloudChecking() {
    if (this.cloudCheckTimer) {
      clearInterval(this.cloudCheckTimer);
      this.cloudCheckTimer = null;
      console.log('🌐 AutoSyncService: Stopped real-time cloud checking');
    }
  }

  // Check for changes in cloud data
  async checkForCloudChanges() {
    if (!this.isEnabled || this.isCheckingCloud) {
      return;
    }

    const now = Date.now();
    if (now - this.lastCloudCheckTime < 5000) { // Minimum 5 seconds between checks
      return;
    }

    this.isCheckingCloud = true;
    this.lastCloudCheckTime = now;

    try {
      console.log('🔍 AutoSyncService: Checking for cloud changes...');
      
      // Get current cloud data hash to detect changes
      const result = await safeSyncService.checkForCloudChanges();
      
      if (result.success && result.hasChanges) {
        console.log('📥 AutoSyncService: Cloud changes detected, triggering sync');
        
        // Perform sync to get the latest data
        const syncResult = await safeSyncService.forceSync();
        
        if (syncResult.success && syncResult.localUpdates && syncResult.localUpdates.length > 0) {
          console.log(`✅ AutoSyncService: Real-time sync completed - updated: ${syncResult.localUpdates.join(', ')}`);
          
          // Show notification about cloud updates
          this.showSyncNotification('success', `Cloud sync: ${syncResult.localUpdates.join(', ')} updated`);
          
          // Dispatch event for UI updates
          window.dispatchEvent(new CustomEvent('cloudDataUpdated', {
            detail: {
              updatedKeys: syncResult.localUpdates,
              timestamp: new Date().toISOString(),
              source: 'real-time-sync'
            }
          }));
        }
      } else if (result.success) {
        // No changes detected
        console.log('🔍 AutoSyncService: No cloud changes detected');
      } else {
        console.warn('⚠️ AutoSyncService: Cloud check failed (non-critical):', result.error);
      }
      
    } catch (error) {
      console.warn('⚠️ AutoSyncService: Cloud check error (non-critical):', error.message);
    } finally {
      this.isCheckingCloud = false;
    }
  }

  // Cleanup
  destroy() {
    this.disable();
    this.clearDebounceTimeout();
    this.stopCloudChecking();
    
    console.log('🧹 AutoSyncService: Cleaned up');
  }
}

// Create singleton instance
const autoSyncService = new AutoSyncService();

export default autoSyncService; 