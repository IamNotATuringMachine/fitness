import autoSyncService from '../services/AutoSyncService';

/**
 * Utility to execute operations while temporarily pausing auto-sync
 * This prevents sync conflicts during critical data operations
 */
export const withSyncPause = async (operation) => {
  try {
    console.log('🔒 SyncUtils: Pausing auto-sync for critical operation');
    autoSyncService.pauseAutoSync();
    
    // Execute the operation
    const result = await operation();
    
    return result;
  } catch (error) {
    console.error('❌ SyncUtils: Error during paused operation:', error);
    throw error;
  } finally {
    console.log('🔓 SyncUtils: Resuming auto-sync after operation');
    autoSyncService.resumeAutoSync();
  }
};

/**
 * Pause auto-sync for a specific duration
 * Useful when making multiple quick changes
 */
export const pauseSyncFor = (duration = 10000) => {
  console.log(`⏸️ SyncUtils: Pausing auto-sync for ${duration}ms`);
  autoSyncService.pauseAutoSync();
  
  setTimeout(() => {
    console.log('▶️ SyncUtils: Auto-resuming sync after timeout');
    autoSyncService.resumeAutoSync();
  }, duration);
};

/**
 * Manual sync control
 */
export const pauseSync = () => {
  autoSyncService.pauseAutoSync();
};

export const resumeSync = () => {
  autoSyncService.resumeAutoSync();
};

/**
 * Get sync status
 */
export const getSyncStatus = () => {
  return autoSyncService.getStatus();
}; 