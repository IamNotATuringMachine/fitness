// Security utilities for input validation and sanitization
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - Raw HTML content
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitize plain text input to prevent script injection
 * @param {string} text - Raw text input
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate numeric input with range checking
 * @param {any} value - Input value
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} - Is valid number within range
 */
export const isValidNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate workout plan structure
 * @param {object} plan - Workout plan object
 * @returns {object} - Validation result
 */
export const validateWorkoutPlan = (plan) => {
  const errors = [];
  
  if (!plan || typeof plan !== 'object') {
    return { isValid: false, errors: ['Plan must be an object'] };
  }
  
  if (!plan.name || typeof plan.name !== 'string' || plan.name.trim().length === 0) {
    errors.push('Plan name is required');
  }
  
  if (plan.name && plan.name.length > 100) {
    errors.push('Plan name must be less than 100 characters');
  }
  
  if (!Array.isArray(plan.days)) {
    errors.push('Plan must have a valid days array');
  } else {
    plan.days.forEach((day, index) => {
      if (!day.id || typeof day.id !== 'string') {
        errors.push(`Day ${index + 1} must have a valid ID`);
      }
      if (!Array.isArray(day.exercises)) {
        errors.push(`Day ${index + 1} must have a valid exercises array`);
      }
      if (!Array.isArray(day.advancedMethods)) {
        errors.push(`Day ${index + 1} must have a valid advancedMethods array`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate exercise data
 * @param {object} exercise - Exercise object
 * @returns {object} - Validation result
 */
export const validateExercise = (exercise) => {
  const errors = [];
  
  if (!exercise || typeof exercise !== 'object') {
    return { isValid: false, errors: ['Exercise must be an object'] };
  }
  
  if (!exercise.name || typeof exercise.name !== 'string' || exercise.name.trim().length === 0) {
    errors.push('Exercise name is required');
  }
  
  if (exercise.sets && !Array.isArray(exercise.sets)) {
    errors.push('Exercise sets must be an array');
  }
  
  if (exercise.sets) {
    exercise.sets.forEach((set, index) => {
      if (set.reps && !isValidNumber(set.reps, 1, 100)) {
        errors.push(`Set ${index + 1} reps must be between 1 and 100`);
      }
      if (set.weight && !isValidNumber(set.weight, 0, 1000)) {
        errors.push(`Set ${index + 1} weight must be between 0 and 1000`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Secure localStorage operations with error handling
 */
export const secureStorage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      // Validate the parsed data structure if it's workout state
      if (key === 'workoutState' && parsed) {
        if (parsed.workoutPlans && !Array.isArray(parsed.workoutPlans)) {
          console.warn('Invalid workoutPlans in localStorage, resetting');
          return null;
        }
      }
      
      return parsed;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      localStorage.removeItem(key); // Remove corrupted data
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      // Validate critical data before storing
      if (key === 'workoutState' && value) {
        if (value.workoutPlans) {
          const validation = validateWorkoutPlans(value.workoutPlans);
          if (!validation.isValid) {
            console.error('Invalid workout plans data:', validation.errors);
            throw new Error('Cannot save invalid workout plans');
          }
        }
      }
      
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  }
};

/**
 * Validate array of workout plans
 * @param {array} plans - Array of workout plans
 * @returns {object} - Validation result
 */
const validateWorkoutPlans = (plans) => {
  if (!Array.isArray(plans)) {
    return { isValid: false, errors: ['Workout plans must be an array'] };
  }
  
  const errors = [];
  plans.forEach((plan, index) => {
    const validation = validateWorkoutPlan(plan);
    if (!validation.isValid) {
      errors.push(`Plan ${index + 1}: ${validation.errors.join(', ')}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Rate limiting for user actions
 */
export class RateLimiter {
  constructor(maxAttempts = 5, timeWindow = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
    this.attempts = new Map();
  }
  
  isAllowed(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = userAttempts.filter(time => now - time < this.timeWindow);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  reset(key) {
    this.attempts.delete(key);
  }
}

export const defaultRateLimiter = new RateLimiter(); 