import { secureStorage } from '../utils/security';
import cloudSyncService from './CloudSyncService';
import safeSyncService from './SafeSyncService';

class AutoSyncService {
  constructor() {
    this.debounceTimeout = null;
    this.syncDelay = 2000; // 2 seconds debounce delay
    this.isEnabled = false;
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
    
    console.log('🔄 AutoSyncService: Initialized');
  }

  // Enable auto-sync for authenticated users
  enable() {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    this.wrapSecureStorage();
    console.log('✅ AutoSyncService: Auto-sync enabled');
  }

  // Disable auto-sync (for demo mode or when offline)
  disable() {
    if (!this.isEnabled) return;
    
    this.isEnabled = false;
    this.clearDebounceTimeout();
    this.unwrapSecureStorage();
    console.log('❌ AutoSyncService: Auto-sync disabled');
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
    // Add to sync queue
    this.syncQueue.add(changedKey);
    
    // Clear existing timeout
    this.clearDebounceTimeout();
    
    // Set new debounced sync
    this.debounceTimeout = setTimeout(() => {
      this.performAutoSync();
    }, this.syncDelay);
    
    console.log(`🔄 AutoSyncService: Queued auto-sync for key: ${changedKey}`);
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

  // Show subtle sync notification
  showSyncNotification(type, message) {
    // Create or update sync indicator
    let indicator = document.getElementById('auto-sync-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'auto-sync-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        color: white;
        z-index: 10000;
        transition: all 0.3s ease;
        pointer-events: none;
        opacity: 0;
        transform: translateY(-10px);
      `;
      document.body.appendChild(indicator);
    }
    
    // Set colors based on type
    const colors = {
      success: '#2ed573',
      warning: '#ffa502', 
      error: '#ff3838'
    };
    
    indicator.style.backgroundColor = colors[type] || colors.success;
    indicator.textContent = message;
    
    // Show animation
    indicator.style.opacity = '1';
    indicator.style.transform = 'translateY(0)';
    
    // Hide after delay
    setTimeout(() => {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateY(-10px)';
    }, 3000);
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
      queueSize: this.syncQueue.size,
      queuedKeys: Array.from(this.syncQueue),
      lastSyncTime: this.lastSyncTime,
      hasPendingSync: !!this.debounceTimeout
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
    
    console.log('⚙️ AutoSyncService: Configuration updated:', {
      syncDelay: this.syncDelay,
      minSyncInterval: this.minSyncInterval,
      watchedKeys: this.watchedKeys
    });
  }

  // Cleanup
  destroy() {
    this.disable();
    this.clearDebounceTimeout();
    
    // Remove sync indicator
    const indicator = document.getElementById('auto-sync-indicator');
    if (indicator) {
      indicator.remove();
    }
    
    console.log('🧹 AutoSyncService: Cleaned up');
  }
}

// Create singleton instance
const autoSyncService = new AutoSyncService();

export default autoSyncService; 