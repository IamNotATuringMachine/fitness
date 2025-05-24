import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GamificationContext = createContext();

// Initial set of achievements, badges, challenges
const initialState = {
  userPoints: 0,
  userLevel: 1,
  badges: [
    {
      id: 'badge_first_workout',
      name: 'Erster Schritt',
      description: 'Absolviere dein erstes Training',
      icon: '▶',
      unlocked: false,
      points: 10
    },
    {
      id: 'badge_three_workouts',
      name: 'Auf dem Weg',
      description: 'Absolviere 3 Trainingseinheiten',
      icon: '↻',
      unlocked: false,
      points: 20
    },
    {
      id: 'badge_week_streak',
      name: 'Wochenstreak',
      description: 'Trainiere 7 Tage in Folge',
      icon: '⬆',
      unlocked: false,
      points: 50
    },
    {
      id: 'badge_first_plan',
      name: 'Planmacher',
      description: 'Erstelle deinen ersten Trainingsplan',
      icon: '□',
      unlocked: false,
      points: 15
    },
    {
      id: 'badge_nutrition_plan',
      name: 'Ernährungsprofi',
      description: 'Erstelle deinen ersten Ernährungsplan',
      icon: '◈',
      unlocked: false,
      points: 15 
    },
    {
      id: 'badge_strength_5',
      name: 'Kraftpaket',
      description: 'Steigere dein Gewicht bei einer Übung 5 Mal in Folge',
      icon: '◆',
      unlocked: false,
      points: 25
    },
    {
      id: 'badge_body_progress',
      name: 'Körpertransformation',
      description: 'Erfasse deine Körpermaße für 4 Wochen in Folge',
      icon: '▢',
      unlocked: false,
      points: 30
    },
    {
      id: 'badge_log_food',
      name: 'Ernährungsbewusst',
      description: 'Erfasse deine Ernährung für 5 Tage in Folge',
      icon: '○',
      unlocked: false,
      points: 25
    },
    {
      id: 'badge_total_points_100',
      name: 'Punktesammler',
      description: 'Sammle insgesamt 100 Punkte',
      icon: '★',
      unlocked: false,
      points: 30
    },
  ],
  challenges: [
    {
      id: 'challenge_consistency',
      name: '30-Tage Konsistenz',
      description: 'Trainiere 30 Tage in Folge',
      progress: 0,
      target: 30,
      reward: 100,
      active: false,
      completed: false,
      icon: '▧'
    },
    {
      id: 'challenge_strength',
      name: 'Kraftsteigerung',
      description: 'Steigere dein Gewicht bei 3 verschiedenen Übungen',
      progress: 0,
      target: 3,
      reward: 50,
      active: false,
      completed: false,
      icon: '▲'
    },
    {
      id: 'challenge_nutrition',
      name: 'Ernährungsexperte',
      description: 'Erfasse deine Ernährung für 2 Wochen durchgehend',
      progress: 0,
      target: 14,
      reward: 75,
      active: false,
      completed: false,
      icon: '◇'
    }
  ],
  achievements: [],
  streaks: {
    currentWorkoutStreak: 0,
    longestWorkoutStreak: 0,
    currentNutritionLogStreak: 0,
    longestNutritionLogStreak: 0
  },
  levelThresholds: [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000, 5000]
};

// Reducer function to handle state changes
function gamificationReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
      
    case 'ADD_POINTS':
      const newPoints = state.userPoints + action.payload;
      const newLevel = calculateLevel(newPoints, state.levelThresholds);
      
      return {
        ...state,
        userPoints: newPoints,
        userLevel: newLevel
      };
      
    case 'UNLOCK_BADGE':
      return {
        ...state,
        badges: state.badges.map(badge => 
          badge.id === action.payload.badgeId 
            ? { ...badge, unlocked: true } 
            : badge
        )
      };
      
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          ...action.payload
        }]
      };
      
    case 'UPDATE_CHALLENGE_PROGRESS':
      return {
        ...state,
        challenges: state.challenges.map(challenge => 
          challenge.id === action.payload.challengeId
            ? { 
                ...challenge, 
                progress: action.payload.progress,
                completed: action.payload.progress >= challenge.target,
                active: action.payload.progress < challenge.target && challenge.active
              }
            : challenge
        )
      };
      
    case 'ACTIVATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge => 
          challenge.id === action.payload
            ? { ...challenge, active: true }
            : challenge
        )
      };
      
    case 'UPDATE_STREAK':
      return {
        ...state,
        streaks: {
          ...state.streaks,
          [action.payload.streakType]: action.payload.value,
          [`longest${action.payload.streakType.slice(7)}`]: Math.max(
            state.streaks[`longest${action.payload.streakType.slice(7)}`],
            action.payload.value
          )
        }
      };
      
    default:
      return state;
  }
}

// Helper function to calculate level based on points
function calculateLevel(points, thresholds) {
  for (let i = 1; i < thresholds.length; i++) {
    if (points < thresholds[i]) {
      return i;
    }
  }
  return thresholds.length;
}

export function GamificationProvider({ children }) {
  const [state, dispatch] = useReducer(gamificationReducer, initialState);
  
  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('gamificationState');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
    }
  }, []);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gamificationState', JSON.stringify(state));
  }, [state]);
  
  // Functions to interact with the gamification system
  const unlockBadge = (badgeId) => {
    const badge = state.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      dispatch({ type: 'UNLOCK_BADGE', payload: { badgeId } });
      dispatch({ type: 'ADD_POINTS', payload: badge.points });
      
      // Record the achievement
      dispatch({ 
        type: 'ADD_ACHIEVEMENT', 
        payload: {
          type: 'badge',
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          points: badge.points
        }
      });
      
      return true;
    }
    return false;
  };
  
  const addPoints = (points, reason) => {
    dispatch({ type: 'ADD_POINTS', payload: points });
    
    // Record the achievement if reason is provided
    if (reason) {
      dispatch({
        type: 'ADD_ACHIEVEMENT',
        payload: {
          type: 'points',
          name: 'Punkte erhalten',
          description: reason,
          icon: '●',
          points: points
        }
      });
    }
    
    // Check if any point-based badges should be unlocked
    checkPointBasedBadges(state.userPoints + points);
  };
  
  const checkPointBasedBadges = (points) => {
    if (points >= 100) {
      unlockBadge('badge_total_points_100');
    }
    // Additional point-based badges can be checked here
  };
  
  const updateChallengeProgress = (challengeId, progress) => {
    const challenge = state.challenges.find(c => c.id === challengeId);
    
    if (challenge && challenge.active) {
      dispatch({ 
        type: 'UPDATE_CHALLENGE_PROGRESS', 
        payload: { challengeId, progress }
      });
      
      // Check if challenge is now completed
      if (progress >= challenge.target && !challenge.completed) {
        // Award points for completing the challenge
        addPoints(challenge.reward, `Herausforderung "${challenge.name}" abgeschlossen`);
        
        // Record the achievement
        dispatch({
          type: 'ADD_ACHIEVEMENT',
          payload: {
            type: 'challenge',
            name: `Herausforderung: ${challenge.name}`,
            description: `${challenge.description} abgeschlossen`,
            icon: challenge.icon,
            points: challenge.reward
          }
        });
      }
    }
  };
  
  const activateChallenge = (challengeId) => {
    dispatch({ type: 'ACTIVATE_CHALLENGE', payload: challengeId });
  };
  
  const updateStreak = (streakType, value) => {
    dispatch({ 
      type: 'UPDATE_STREAK', 
      payload: { streakType, value }
    });
    
    // Check streak-based badges
    if (streakType === 'currentWorkoutStreak' && value >= 7) {
      unlockBadge('badge_week_streak');
    }
  };
  
  // Function to check for workout-related achievements
  const recordWorkout = () => {
    // Increase workout streak
    const newStreak = state.streaks.currentWorkoutStreak + 1;
    updateStreak('currentWorkoutStreak', newStreak);
    
    // Check badges
    if (newStreak === 1) {
      unlockBadge('badge_first_workout');
    } else if (newStreak === 3) {
      unlockBadge('badge_three_workouts');
    }
    
    // Add points for the workout
    addPoints(5, 'Training absolviert');
    
    // Update consistency challenge if active
    const consistencyChallenge = state.challenges.find(c => c.id === 'challenge_consistency');
    if (consistencyChallenge && consistencyChallenge.active) {
      updateChallengeProgress('challenge_consistency', consistencyChallenge.progress + 1);
    }
  };
  
  // Function to check for nutrition-related achievements
  const recordNutritionLog = () => {
    // Increase nutrition log streak
    const newStreak = state.streaks.currentNutritionLogStreak + 1;
    updateStreak('currentNutritionLogStreak', newStreak);
    
    // Check badges
    if (newStreak === 5) {
      unlockBadge('badge_log_food');
    }
    
    // Add points for logging nutrition
    addPoints(3, 'Ernährung protokolliert');
    
    // Update nutrition challenge if active
    const nutritionChallenge = state.challenges.find(c => c.id === 'challenge_nutrition');
    if (nutritionChallenge && nutritionChallenge.active) {
      updateChallengeProgress('challenge_nutrition', nutritionChallenge.progress + 1);
    }
  };
  
  // Function to record plan creation
  const recordPlanCreation = (isNutrition = false) => {
    if (isNutrition) {
      unlockBadge('badge_nutrition_plan');
      addPoints(5, 'Ernährungsplan erstellt');
    } else {
      unlockBadge('badge_first_plan');
      addPoints(5, 'Trainingsplan erstellt');
    }
  };
  
  // Function to record strength progress
  const recordStrengthProgress = (exercise, consecutive = 1) => {
    // Add points for strength progress
    addPoints(2, `Gewichtssteigerung bei ${exercise}`);
    
    // Check badges
    if (consecutive >= 5) {
      unlockBadge('badge_strength_5');
    }
    
    // Update strength challenge if active
    const strengthChallenge = state.challenges.find(c => c.id === 'challenge_strength');
    if (strengthChallenge && strengthChallenge.active) {
      // We'd need to track individual exercises that improved, but this is a simplified version
      updateChallengeProgress('challenge_strength', strengthChallenge.progress + 1);
    }
  };
  
  // Function to record body measurements
  const recordBodyMeasurement = (consecutive = 1) => {
    addPoints(2, 'Körpermaße erfasst');
    
    // Check badges
    if (consecutive >= 4) {
      unlockBadge('badge_body_progress');
    }
  };
  
  return (
    <GamificationContext.Provider value={{ 
      state, 
      unlockBadge,
      addPoints,
      activateChallenge,
      updateChallengeProgress,
      recordWorkout,
      recordNutritionLog,
      recordPlanCreation,
      recordStrengthProgress,
      recordBodyMeasurement
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
} 