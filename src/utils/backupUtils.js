import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// App version for backup compatibility checking
const APP_VERSION = '1.0.0';
const BACKUP_VERSION = '1.0.0';

/**
 * Creates a comprehensive backup of all application data
 * @returns {Object} Complete backup object
 */
export const createBackup = () => {
  try {
    // Get data from all contexts
    const workoutState = JSON.parse(localStorage.getItem('workoutState') || '{}');
    const nutritionState = JSON.parse(localStorage.getItem('nutritionState') || '{}');
    const gamificationState = JSON.parse(localStorage.getItem('gamificationState') || '{}');

    const backup = {
      metadata: {
        version: BACKUP_VERSION,
        appVersion: APP_VERSION,
        createdAt: new Date().toISOString(),
        createdBy: workoutState.userProfile?.name || 'Unbekannter Benutzer',
        description: 'Vollständiges Backup aller Fitness-App Daten'
      },
      data: {
        workout: workoutState,
        nutrition: nutritionState,
        gamification: gamificationState
      }
    };

    return backup;
  } catch (error) {
    console.error('Fehler beim Erstellen des Backups:', error);
    throw new Error('Backup konnte nicht erstellt werden: ' + error.message);
  }
};

/**
 * Exports backup data as downloadable JSON file
 * @param {Object} backup - The backup object to export
 * @param {string} filename - Optional custom filename
 */
export const exportBackup = (backup, filename) => {
  try {
    const defaultFilename = `fitness-backup-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss', { locale: de })}.json`;
    const finalFilename = filename || defaultFilename;
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Fehler beim Exportieren des Backups:', error);
    throw new Error('Export fehlgeschlagen: ' + error.message);
  }
};

/**
 * Validates backup data structure and content
 * @param {Object} backup - The backup object to validate
 * @returns {Object} Validation result with isValid boolean and issues array
 */
export const validateBackup = (backup) => {
  const issues = [];
  
  try {
    // Check basic structure
    if (!backup || typeof backup !== 'object') {
      issues.push('Backup ist kein gültiges Objekt');
      return { isValid: false, issues };
    }

    // Check metadata
    if (!backup.metadata) {
      issues.push('Backup-Metadaten fehlen');
    } else {
      if (!backup.metadata.version) {
        issues.push('Backup-Version fehlt');
      }
      if (!backup.metadata.createdAt) {
        issues.push('Erstellungsdatum fehlt');
      }
    }

    // Check data structure
    if (!backup.data) {
      issues.push('Backup-Daten fehlen');
      return { isValid: false, issues };
    }

    // Validate workout data structure
    if (backup.data.workout) {
      const workoutIssues = validateWorkoutData(backup.data.workout);
      issues.push(...workoutIssues);
    }

    // Validate nutrition data structure
    if (backup.data.nutrition) {
      const nutritionIssues = validateNutritionData(backup.data.nutrition);
      issues.push(...nutritionIssues);
    }

    // Validate gamification data structure
    if (backup.data.gamification) {
      const gamificationIssues = validateGamificationData(backup.data.gamification);
      issues.push(...gamificationIssues);
    }

    // Check for version compatibility
    if (backup.metadata.version && backup.metadata.version !== BACKUP_VERSION) {
      issues.push(`Backup-Version (${backup.metadata.version}) unterscheidet sich von aktueller Version (${BACKUP_VERSION})`);
    }

    return {
      isValid: issues.length === 0,
      issues,
      hasWorkoutData: !!backup.data.workout,
      hasNutritionData: !!backup.data.nutrition,
      hasGamificationData: !!backup.data.gamification
    };
  } catch (error) {
    issues.push('Fehler bei der Backup-Validierung: ' + error.message);
    return { isValid: false, issues };
  }
};

/**
 * Validates workout data structure
 * @param {Object} workoutData 
 * @returns {Array} Array of validation issues
 */
const validateWorkoutData = (workoutData) => {
  const issues = [];
  
  // Check required arrays
  const requiredArrays = ['workoutPlans', 'exercises', 'workoutHistory', 'bodyMeasurements'];
  requiredArrays.forEach(key => {
    if (workoutData[key] && !Array.isArray(workoutData[key])) {
      issues.push(`Workout-Daten: ${key} ist kein Array`);
    }
  });

  // Validate workout plans structure
  if (workoutData.workoutPlans && Array.isArray(workoutData.workoutPlans)) {
    workoutData.workoutPlans.forEach((plan, index) => {
      if (!plan.id) {
        issues.push(`Trainingsplan ${index + 1}: ID fehlt`);
      }
      if (!plan.name) {
        issues.push(`Trainingsplan ${index + 1}: Name fehlt`);
      }
      if (plan.days && !Array.isArray(plan.days)) {
        issues.push(`Trainingsplan ${index + 1}: Tage sind kein Array`);
      }
    });
  }

  // Validate exercises structure
  if (workoutData.exercises && Array.isArray(workoutData.exercises)) {
    workoutData.exercises.forEach((exercise, index) => {
      if (!exercise.id) {
        issues.push(`Übung ${index + 1}: ID fehlt`);
      }
      if (!exercise.name) {
        issues.push(`Übung ${index + 1}: Name fehlt`);
      }
    });
  }

  return issues;
};

/**
 * Validates nutrition data structure
 * @param {Object} nutritionData 
 * @returns {Array} Array of validation issues
 */
const validateNutritionData = (nutritionData) => {
  const issues = [];
  
  const requiredArrays = ['nutritionPlans', 'foodItems', 'dailyLogs'];
  requiredArrays.forEach(key => {
    if (nutritionData[key] && !Array.isArray(nutritionData[key])) {
      issues.push(`Ernährungs-Daten: ${key} ist kein Array`);
    }
  });

  return issues;
};

/**
 * Validates gamification data structure
 * @param {Object} gamificationData 
 * @returns {Array} Array of validation issues
 */
const validateGamificationData = (gamificationData) => {
  const issues = [];
  
  const requiredArrays = ['badges', 'challenges', 'achievements'];
  requiredArrays.forEach(key => {
    if (gamificationData[key] && !Array.isArray(gamificationData[key])) {
      issues.push(`Gamification-Daten: ${key} ist kein Array`);
    }
  });

  if (typeof gamificationData.userPoints !== 'number' && gamificationData.userPoints !== undefined) {
    issues.push('Gamification-Daten: userPoints ist keine Zahl');
  }

  return issues;
};

/**
 * Parses a backup file and returns the backup object
 * @param {File} file - The backup file to parse
 * @returns {Promise<Object>} Promise that resolves to the backup object
 */
export const parseBackupFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Keine Datei ausgewählt'));
      return;
    }

    if (!file.name.endsWith('.json')) {
      reject(new Error('Datei muss eine JSON-Datei sein'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        resolve(backup);
      } catch (error) {
        reject(new Error('Datei ist keine gültige JSON-Datei: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Restores data from backup with selective restore options
 * @param {Object} backup - The validated backup object
 * @param {Object} options - Restore options
 * @param {boolean} options.restoreWorkout - Whether to restore workout data
 * @param {boolean} options.restoreNutrition - Whether to restore nutrition data
 * @param {boolean} options.restoreGamification - Whether to restore gamification data
 * @param {boolean} options.mergeData - Whether to merge with existing data or replace
 * @returns {Object} Result object with success status and details
 */
export const restoreFromBackup = (backup, options = {}) => {
  const {
    restoreWorkout = true,
    restoreNutrition = true,
    restoreGamification = true,
    mergeData = false
  } = options;

  const results = {
    success: true,
    restored: [],
    errors: []
  };

  try {
    console.log('🔄 restoreFromBackup: Starting restore process...');
    console.log('📦 Backup data keys:', Object.keys(backup.data || {}));
    console.log('⚙️ Restore options:', options);
    
    // Backup current data before restore
    const currentBackup = createBackup();
    localStorage.setItem('fitness-backup-before-restore', JSON.stringify(currentBackup));
    console.log('💾 Created safety backup before restore');

    // Restore workout data
    if (restoreWorkout && backup.data.workout) {
      try {
        console.log('🏋️ Restoring workout data...');
        console.log('📊 Workout data keys:', Object.keys(backup.data.workout || {}));
        
        if (mergeData) {
          const currentWorkout = JSON.parse(localStorage.getItem('workoutState') || '{}');
          const mergedWorkout = mergeWorkoutData(currentWorkout, backup.data.workout);
          localStorage.setItem('workoutState', JSON.stringify(mergedWorkout));
          console.log('🔀 Merged workout data with existing data');
        } else {
          localStorage.setItem('workoutState', JSON.stringify(backup.data.workout));
          console.log('💾 Replaced workout data completely');
        }
        
        // Verify data was saved
        const savedData = localStorage.getItem('workoutState');
        console.log('✅ Workout data saved to localStorage:', !!savedData);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('📊 Restored workout data contains:');
          console.log('- workoutPlans:', parsedData.workoutPlans?.length || 0);
          console.log('- exercises:', parsedData.exercises?.length || 0);
          console.log('- workoutHistory:', parsedData.workoutHistory?.length || 0);
        }
        
        results.restored.push('Trainingsdaten');
      } catch (error) {
        console.error('❌ Error restoring workout data:', error);
        results.errors.push('Fehler beim Wiederherstellen der Trainingsdaten: ' + error.message);
        results.success = false;
      }
    }

    // Restore nutrition data
    if (restoreNutrition && backup.data.nutrition) {
      try {
        if (mergeData) {
          const currentNutrition = JSON.parse(localStorage.getItem('nutritionState') || '{}');
          const mergedNutrition = mergeNutritionData(currentNutrition, backup.data.nutrition);
          localStorage.setItem('nutritionState', JSON.stringify(mergedNutrition));
        } else {
          localStorage.setItem('nutritionState', JSON.stringify(backup.data.nutrition));
        }
        results.restored.push('Ernährungsdaten');
      } catch (error) {
        results.errors.push('Fehler beim Wiederherstellen der Ernährungsdaten: ' + error.message);
        results.success = false;
      }
    }

    // Restore gamification data
    if (restoreGamification && backup.data.gamification) {
      try {
        if (mergeData) {
          const currentGamification = JSON.parse(localStorage.getItem('gamificationState') || '{}');
          const mergedGamification = mergeGamificationData(currentGamification, backup.data.gamification);
          localStorage.setItem('gamificationState', JSON.stringify(mergedGamification));
        } else {
          localStorage.setItem('gamificationState', JSON.stringify(backup.data.gamification));
        }
        results.restored.push('Gamification-Daten');
      } catch (error) {
        results.errors.push('Fehler beim Wiederherstellen der Gamification-Daten: ' + error.message);
        results.success = false;
      }
    }

    // Update app version to prevent cache clearing on next reload
    if (results.success && results.restored.length > 0) {
      const APP_VERSION = '2025-05-25-v3-auth-fix'; // Should match the version in index.js
      localStorage.setItem('app_version', APP_VERSION);
      console.log('✅ Updated app version after successful backup restore to prevent cache clearing');
    }

    // Final summary
    console.log('🎯 Backup restore complete!');
    console.log('✅ Success:', results.success);
    console.log('📦 Restored components:', results.restored);
    console.log('❌ Errors:', results.errors);
    console.log('🔍 Final localStorage check:');
    console.log('- workoutState:', !!localStorage.getItem('workoutState'));
    console.log('- nutritionState:', !!localStorage.getItem('nutritionState'));
    console.log('- gamificationState:', !!localStorage.getItem('gamificationState'));
    console.log('- app_version:', localStorage.getItem('app_version'));

    return results;
  } catch (error) {
    results.success = false;
    results.errors.push('Allgemeiner Fehler beim Wiederherstellen: ' + error.message);
    return results;
  }
};

/**
 * Merges backup workout data with current data
 * @param {Object} current - Current workout data
 * @param {Object} backup - Backup workout data
 * @returns {Object} Merged workout data
 */
const mergeWorkoutData = (current, backup) => {
  const merged = { ...current };
  
  // Merge arrays by adding unique items
  if (backup.workoutPlans) {
    merged.workoutPlans = mergeArraysById(current.workoutPlans || [], backup.workoutPlans);
  }
  if (backup.exercises) {
    merged.exercises = mergeArraysById(current.exercises || [], backup.exercises);
  }
  if (backup.workoutHistory) {
    merged.workoutHistory = mergeArraysById(current.workoutHistory || [], backup.workoutHistory);
  }
  if (backup.bodyMeasurements) {
    merged.bodyMeasurements = mergeArraysById(current.bodyMeasurements || [], backup.bodyMeasurements);
  }
  if (backup.notesHistory) {
    merged.notesHistory = mergeArraysById(current.notesHistory || [], backup.notesHistory);
  }

  // Merge user profile
  if (backup.userProfile) {
    merged.userProfile = { ...current.userProfile, ...backup.userProfile };
  }

  return merged;
};

/**
 * Merges backup nutrition data with current data
 * @param {Object} current - Current nutrition data
 * @param {Object} backup - Backup nutrition data
 * @returns {Object} Merged nutrition data
 */
const mergeNutritionData = (current, backup) => {
  const merged = { ...current };
  
  if (backup.nutritionPlans) {
    merged.nutritionPlans = mergeArraysById(current.nutritionPlans || [], backup.nutritionPlans);
  }
  if (backup.foodItems) {
    merged.foodItems = mergeArraysById(current.foodItems || [], backup.foodItems);
  }
  if (backup.dailyLogs) {
    merged.dailyLogs = mergeArraysById(current.dailyLogs || [], backup.dailyLogs);
  }

  // Merge nutrition goals
  if (backup.nutritionGoals) {
    merged.nutritionGoals = { ...current.nutritionGoals, ...backup.nutritionGoals };
  }

  return merged;
};

/**
 * Merges backup gamification data with current data
 * @param {Object} current - Current gamification data
 * @param {Object} backup - Backup gamification data
 * @returns {Object} Merged gamification data
 */
const mergeGamificationData = (current, backup) => {
  const merged = { ...current };
  
  // For gamification, we typically want to keep the higher values
  if (backup.userPoints && backup.userPoints > (current.userPoints || 0)) {
    merged.userPoints = backup.userPoints;
  }
  if (backup.userLevel && backup.userLevel > (current.userLevel || 1)) {
    merged.userLevel = backup.userLevel;
  }

  // Merge arrays
  if (backup.badges) {
    merged.badges = mergeArraysById(current.badges || [], backup.badges);
  }
  if (backup.achievements) {
    merged.achievements = mergeArraysById(current.achievements || [], backup.achievements);
  }

  // Merge streaks - keep the higher values
  if (backup.streaks) {
    merged.streaks = {
      ...current.streaks,
      ...backup.streaks,
      longestWorkoutStreak: Math.max(
        current.streaks?.longestWorkoutStreak || 0,
        backup.streaks?.longestWorkoutStreak || 0
      ),
      longestNutritionLogStreak: Math.max(
        current.streaks?.longestNutritionLogStreak || 0,
        backup.streaks?.longestNutritionLogStreak || 0
      )
    };
  }

  return merged;
};

/**
 * Merges two arrays by ID, preferring backup items for conflicts
 * @param {Array} current - Current array
 * @param {Array} backup - Backup array
 * @returns {Array} Merged array
 */
const mergeArraysById = (current, backup) => {
  const merged = [...current];
  const currentIds = new Set(current.map(item => item.id));
  
  backup.forEach(backupItem => {
    if (!currentIds.has(backupItem.id)) {
      merged.push(backupItem);
    } else {
      // Replace existing item with backup version
      const index = merged.findIndex(item => item.id === backupItem.id);
      if (index !== -1) {
        merged[index] = backupItem;
      }
    }
  });
  
  return merged;
};

/**
 * Gets backup statistics
 * @param {Object} backup - The backup object
 * @returns {Object} Statistics about the backup
 */
export const getBackupStats = (backup) => {
  const stats = {
    createdAt: backup.metadata?.createdAt,
    appVersion: backup.metadata?.appVersion,
    totalSize: JSON.stringify(backup).length,
    workout: {
      plans: backup.data?.workout?.workoutPlans?.length || 0,
      exercises: backup.data?.workout?.exercises?.length || 0,
      history: backup.data?.workout?.workoutHistory?.length || 0,
      measurements: backup.data?.workout?.bodyMeasurements?.length || 0
    },
    nutrition: {
      plans: backup.data?.nutrition?.nutritionPlans?.length || 0,
      foodItems: backup.data?.nutrition?.foodItems?.length || 0,
      dailyLogs: backup.data?.nutrition?.dailyLogs?.length || 0
    },
    gamification: {
      points: backup.data?.gamification?.userPoints || 0,
      level: backup.data?.gamification?.userLevel || 1,
      badges: backup.data?.gamification?.badges?.filter(b => b.unlocked)?.length || 0,
      achievements: backup.data?.gamification?.achievements?.length || 0
    }
  };

  return stats;
}; 