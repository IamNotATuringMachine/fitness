import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { secureStorage } from '../utils/security';

// Smart initial state - only use default exercises if no data exists
const getSmartInitialState = () => {
  try {
    const existingState = secureStorage.get('workoutState');
    if (existingState && existingState.exercises) {
      console.log('🔍 Found existing exercises in localStorage, using minimal initial state');
      return {
        workoutPlans: [],
        exercises: [], // Empty - will be loaded from localStorage
        workoutHistory: [],
        bodyMeasurements: [],
        trainingMethods: [],
        notesHistory: [],
        calendarEvents: [],
        periodizationPlans: [],
        userProfile: {
          name: '',
          age: '',
          weight: '',
          height: '',
          fitnessLevel: '',
          goals: []
        }
      };
    }
  } catch (error) {
    console.error('Error loading existing state:', error);
  }
  
  // If no existing data or error, provide default initial state
  console.log('🆕 No existing data found, using full initial state with default exercises');
  return {
    workoutPlans: [],
    exercises: [
      // Brustmuskulatur Exercises
      { 
        id: uuidv4(), 
        name: 'Bankdrücken mit der Langhantel', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Hantelbank', 'Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Schrägbankdrücken mit der Langhantel', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Hantelbank', 'Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Negativbankdrücken mit der Langhantel', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Hantelbank', 'Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Kurzhantel-Bankdrücken', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Hantelbank', 'Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Kurzhantel-Schrägbankdrücken', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Hantelbank', 'Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Kurzhantel-Negativbankdrücken', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Hantelbank', 'Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Fliegende Bewegung auf der Flachbank', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Hantelbank', 'Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Fliegende Bewegung auf der Schrägbank', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Hantelbank', 'Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Cable Crossovers / Fliegende am Kabelzug', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Kabelzug']
      },
      { 
        id: uuidv4(), 
        name: 'Dips', 
        muscleGroups: ['Brustmuskulatur', 'Trizeps', 'Schultermuskulatur'],
        equipment: ['Barren']
      },
      { 
        id: uuidv4(), 
        name: 'Liegestütze', 
        muscleGroups: ['Brustmuskulatur', 'Trizeps', 'Schultermuskulatur'],
        equipment: ['Körpergewicht']
      },
      { 
        id: uuidv4(), 
        name: 'Brustpresse an der Maschine', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Maschine']
      },
      { 
        id: uuidv4(), 
        name: 'Butterfly / Peck Deck Maschine', 
        muscleGroups: ['Brustmuskulatur'],
        equipment: ['Maschine']
      },
      
      // Rückenmuskulatur Exercises
      { 
        id: uuidv4(), 
        name: 'Klimmzüge', 
        muscleGroups: ['Rückenmuskulatur', 'Bizeps'],
        equipment: ['Klimmzugstange']
      },
      { 
        id: uuidv4(), 
        name: 'Latzug zur Brust', 
        muscleGroups: ['Rückenmuskulatur'],
        equipment: ['Maschine']
      },
      { 
        id: uuidv4(), 
        name: 'Langhantelrudern vorgebeugt', 
        muscleGroups: ['Rückenmuskulatur'],
        equipment: ['Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Kurzhantelrudern einarmig', 
        muscleGroups: ['Rückenmuskulatur'],
        equipment: ['Kurzhantel']
      },
      { 
        id: uuidv4(), 
        name: 'T-Bar Rudern', 
        muscleGroups: ['Rückenmuskulatur'],
        equipment: ['T-Bar']
      },
      { 
        id: uuidv4(), 
        name: 'Rudern am Kabelzug sitzend', 
        muscleGroups: ['Rückenmuskulatur'],
        equipment: ['Kabelzug']
      },
      { 
        id: uuidv4(), 
        name: 'Rudern an der Maschine', 
        muscleGroups: ['Rückenmuskulatur'],
        equipment: ['Maschine']
      },
      { 
        id: uuidv4(), 
        name: 'Überzüge mit Kurzhantel oder am Kabel', 
        muscleGroups: ['Rückenmuskulatur'],
        equipment: ['Kurzhantel', 'Kabelzug']
      },
      { 
        id: uuidv4(), 
        name: 'Kreuzheben', 
        muscleGroups: ['Rückenmuskulatur', 'Beinmuskulatur'],
        equipment: ['Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Hyperextensions / Rückenstrecker', 
        muscleGroups: ['Rückenmuskulatur'],
        equipment: ['Gerät']
      },
      { 
        id: uuidv4(), 
        name: 'Good Mornings', 
        muscleGroups: ['Rückenmuskulatur', 'Beinmuskulatur'],
        equipment: ['Langhantel']
      },
      
      // Beinmuskulatur Exercises
      { 
        id: uuidv4(), 
        name: 'Kniebeugen mit der Langhantel', 
        muscleGroups: ['Beinmuskulatur', 'Gesäß'],
        equipment: ['Langhantel', 'Rack']
      },
      { 
        id: uuidv4(), 
        name: 'Frontkniebeugen mit der Langhantel', 
        muscleGroups: ['Beinmuskulatur'],
        equipment: ['Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Beinpresse', 
        muscleGroups: ['Beinmuskulatur'],
        equipment: ['Maschine']
      },
      { 
        id: uuidv4(), 
        name: 'Ausfallschritte', 
        muscleGroups: ['Beinmuskulatur', 'Gesäß'],
        equipment: ['Körpergewicht', 'Kurzhanteln', 'Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Bulgarian Split Squats', 
        muscleGroups: ['Beinmuskulatur', 'Gesäß'],
        equipment: ['Bank', 'Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Rumänisches Kreuzheben', 
        muscleGroups: ['Beinmuskulatur', 'Rückenmuskulatur'],
        equipment: ['Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Gestrecktes Kreuzheben', 
        muscleGroups: ['Beinmuskulatur', 'Rückenmuskulatur'],
        equipment: ['Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Beinbeuger liegend', 
        muscleGroups: ['Beinmuskulatur'],
        equipment: ['Maschine']
      },
      { 
        id: uuidv4(), 
        name: 'Beinbeuger sitzend', 
        muscleGroups: ['Beinmuskulatur'],
        equipment: ['Maschine']
      },
      { 
        id: uuidv4(), 
        name: 'Beinstrecker', 
        muscleGroups: ['Beinmuskulatur'],
        equipment: ['Maschine']
      },
      { 
        id: uuidv4(), 
        name: 'Hüftheben / Glute Bridges', 
        muscleGroups: ['Beinmuskulatur', 'Gesäß'],
        equipment: ['Körpergewicht', 'Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Hip Thrusts', 
        muscleGroups: ['Beinmuskulatur', 'Gesäß'],
        equipment: ['Langhantel', 'Bank']
      },
      { 
        id: uuidv4(), 
        name: 'Wadenheben stehend', 
        muscleGroups: ['Beinmuskulatur'],
        equipment: ['Maschine', 'Stufe']
      },
      { 
        id: uuidv4(), 
        name: 'Wadenheben sitzend', 
        muscleGroups: ['Beinmuskulatur'],
        equipment: ['Maschine']
      },
      
      // Schultermuskulatur Exercises
      { 
        id: uuidv4(), 
        name: 'Schulterdrücken mit der Langhantel', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Schulterdrücken mit Kurzhanteln', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Arnold Press', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Seitheben mit Kurzhanteln', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Seitheben am Kabelzug', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Kabelzug']
      },
      { 
        id: uuidv4(), 
        name: 'Vorgebeugtes Seitheben mit Kurzhanteln', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Reverse Butterfly / Reverse Peck Deck', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Maschine']
      },
      { 
        id: uuidv4(), 
        name: 'Frontheben mit Kurzhanteln oder Hantelscheibe', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Kurzhanteln', 'Hantelscheibe']
      },
      { 
        id: uuidv4(), 
        name: 'Aufrechtes Rudern', 
        muscleGroups: ['Schultermuskulatur'],
        equipment: ['Langhantel', 'Kurzhanteln']
      },
      
      // Bizeps Exercises
      { 
        id: uuidv4(), 
        name: 'Langhantel-Curls', 
        muscleGroups: ['Bizeps'],
        equipment: ['Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Kurzhantel-Curls', 
        muscleGroups: ['Bizeps'],
        equipment: ['Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Hammercurls', 
        muscleGroups: ['Bizeps'],
        equipment: ['Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Konzentrationscurls', 
        muscleGroups: ['Bizeps'],
        equipment: ['Kurzhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Scottcurls / Preacher Curls', 
        muscleGroups: ['Bizeps'],
        equipment: ['Scottbank', 'Langhantel', 'SZ-Stange', 'Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Bizepscurls am Kabelzug', 
        muscleGroups: ['Bizeps'],
        equipment: ['Kabelzug']
      },
      { 
        id: uuidv4(), 
        name: 'Reverse Curls', 
        muscleGroups: ['Bizeps'], 
        equipment: ['Langhantel', 'SZ-Stange']
      }, 
      { 
        id: uuidv4(), 
        name: 'Schrägbank-Kurzhantel-Curls', 
        muscleGroups: ['Bizeps'], 
        equipment: ['Hantelbank', 'Kurzhanteln']
      },        
      
      // Trizeps Exercises
      { 
        id: uuidv4(), 
        name: 'Enges Bankdrücken', 
        muscleGroups: ['Trizeps', 'Brustmuskulatur'],
        equipment: ['Hantelbank', 'Langhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Stirndrücken / French Press', 
        muscleGroups: ['Trizeps'],
        equipment: ['Hantelbank', 'Langhantel', 'SZ-Stange', 'Kurzhanteln']
      },
      { 
        id: uuidv4(), 
        name: 'Überkopf-Trizepsdrücken mit Kurzhantel', 
        muscleGroups: ['Trizeps'],
        equipment: ['Kurzhantel']
      },
      { 
        id: uuidv4(), 
        name: 'Trizepsdrücken am Kabelzug', 
        muscleGroups: ['Trizeps'],
        equipment: ['Kabelzug']
      },
      { 
        id: uuidv4(), 
        name: 'Kickbacks mit Kurzhanteln', 
        muscleGroups: ['Trizeps'],
        equipment: ['Kurzhanteln']
      },
      
      // Bauchmuskulatur Exercises
      { 
        id: uuidv4(), 
        name: 'Crunches', 
        muscleGroups: ['Bauchmuskulatur'],
        equipment: ['Körpergewicht']
      },
      { 
        id: uuidv4(), 
        name: 'Beinheben', 
        muscleGroups: ['Bauchmuskulatur'],
        equipment: ['Körpergewicht', 'Klimmzugstange']
      },
      { 
        id: uuidv4(), 
        name: 'Plank / Unterarmstütz', 
        muscleGroups: ['Bauchmuskulatur'],
        equipment: ['Körpergewicht']
      },
      { 
        id: uuidv4(), 
        name: 'Russian Twists', 
        muscleGroups: ['Bauchmuskulatur'],
        equipment: ['Körpergewicht', 'Medizinball', 'Hantelscheibe']
      },
      { 
        id: uuidv4(), 
        name: 'Kabel-Crunches', 
        muscleGroups: ['Bauchmuskulatur'],
        equipment: ['Kabelzug']
      },
      { 
        id: uuidv4(), 
        name: 'Wood Chops / Holzfäller am Kabelzug', 
        muscleGroups: ['Bauchmuskulatur'],
        equipment: ['Kabelzug']
      },
      { 
        id: uuidv4(), 
        name: 'Sit-ups', 
        muscleGroups: ['Bauchmuskulatur'],
        equipment: ['Körpergewicht']
      }
    ],
    workoutHistory: [],
    bodyMeasurements: [],
    trainingMethods: [
      { id: uuidv4(), name: 'Standard', description: 'Normales Training mit Sätzen und Wiederholungen' },
      { id: uuidv4(), name: 'Supersatz', description: 'Zwei verschiedene Übungen werden direkt nacheinander ohne Pause ausgeführt' },
      { id: uuidv4(), name: 'Triset', description: 'Drei verschiedene Übungen werden direkt nacheinander ohne Pause ausgeführt' },
      { id: uuidv4(), name: 'Riesensatz', description: 'Vier oder mehr verschiedene Übungen werden direkt nacheinander ohne Pause ausgeführt' },
      { id: uuidv4(), name: 'Dropset', description: 'Nach Erreichen des Muskelversagens wird das Gewicht reduziert und sofort weitertrainiert' },
      { id: uuidv4(), name: 'Pyramiden-Training', description: 'Schrittweise Erhöhung des Gewichts bei gleichzeitiger Verringerung der Wiederholungen' },
      { id: uuidv4(), name: 'Rest-Pause', description: 'Kurze Pausen (10-15 Sekunden) zwischen Wiederholungen innerhalb eines Satzes' },
      { id: uuidv4(), name: 'Zirkeltraining', description: 'Mehrere Übungen werden in einem Zirkel ohne längere Pausen ausgeführt' }
    ],
    notesHistory: [],
    calendarEvents: [],
    periodizationPlans: [],
    userProfile: {
      name: '',
      age: '',
      weight: '',
      height: '',
      fitnessLevel: '',
      goals: []
    }
  };
};

// Use smart initial state
export const initialState = getSmartInitialState();

// Utility to ensure deep copy of complex objects
export const deepCloneWithSafeChecks = (obj) => {
  if (!obj) return obj;
  
  try {
    // First try to use JSON for a deep clone
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.warn('JSON deep clone failed, using manual copy:', error);
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => deepCloneWithSafeChecks(item));
    }
    
    // Handle objects
    if (typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = deepCloneWithSafeChecks(obj[key]);
        }
      }
      return newObj;
    }
    
    // Return primitive values as is
    return obj;
  }
};

// Reducer function
const workoutReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_WORKOUT_PLAN':
      console.log('ADD_WORKOUT_PLAN payload:', action.payload);
      const newPlan = {
        ...action.payload,
        days: Array.isArray(action.payload.days) ? deepCloneWithSafeChecks(action.payload.days) : [] // Ensure days are safely and deeply copied
      };
      console.log('Processed newPlan:', newPlan);
      return {
        ...state,
        workoutPlans: Array.isArray(state.workoutPlans) 
          ? [...state.workoutPlans, newPlan]
          : [newPlan],
      };
    case 'UPDATE_WORKOUT_PLAN':
      console.log('UPDATE_WORKOUT_PLAN payload:', action.payload);
      const updatedPlan = {
        ...action.payload,
        days: Array.isArray(action.payload.days) ? deepCloneWithSafeChecks(action.payload.days) : [] // Ensure days are safely and deeply copied
      };
      console.log('Processed updatedPlan:', updatedPlan);
      return {
        ...state,
        workoutPlans: Array.isArray(state.workoutPlans) 
          ? state.workoutPlans.map(plan => 
            plan.id === updatedPlan.id ? updatedPlan : plan
          )
          : [updatedPlan],
      };
    case 'DELETE_WORKOUT_PLAN':
      return {
        ...state,
        workoutPlans: Array.isArray(state.workoutPlans) 
          ? state.workoutPlans.filter(plan => plan.id !== action.payload)
          : [],
      };
    case 'ADD_EXERCISE':
      return {
        ...state,
        exercises: Array.isArray(state.exercises) 
          ? [...state.exercises, action.payload]
          : [action.payload],
      };
    case 'ADD_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: Array.isArray(state.calendarEvents) 
          ? [...state.calendarEvents, action.payload]
          : [action.payload],
      };
    case 'UPDATE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: Array.isArray(state.calendarEvents) 
          ? state.calendarEvents.map(event => 
            event.id === action.payload.id ? action.payload : event
          )
          : [action.payload],
      };
    case 'DELETE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: Array.isArray(state.calendarEvents) 
          ? state.calendarEvents.filter(event => event.id !== action.payload)
          : [],
      };
    case 'TRACK_WORKOUT':
      // Ensure the workout has a valid ID and date
      const workout = {
        ...action.payload,
        id: action.payload.id || uuidv4(),
        date: action.payload.date || new Date().toISOString(),
        timestamp: new Date().getTime()
      };
      
      return {
        ...state,
        workoutHistory: Array.isArray(state.workoutHistory) 
          ? [...state.workoutHistory, workout]
          : [workout],
      };
    case 'DELETE_WORKOUT':
      const updatedWorkoutHistory = Array.isArray(state.workoutHistory)
        ? state.workoutHistory.filter(workout => workout.id !== action.payload)
        : [];
      
      return {
        ...state,
        workoutHistory: updatedWorkoutHistory,
      };
    case 'TRACK_BODY_MEASUREMENT':
      return {
        ...state,
        bodyMeasurements: Array.isArray(state.bodyMeasurements) 
          ? [...state.bodyMeasurements, action.payload]
          : [action.payload],
      };
    case 'ADD_TRAINING_METHOD':
      return {
        ...state,
        trainingMethods: Array.isArray(state.trainingMethods) 
          ? [...state.trainingMethods, action.payload]
          : [action.payload],
      };
    case 'ADD_NOTE':
      return {
        ...state,
        notesHistory: Array.isArray(state.notesHistory) 
          ? [...state.notesHistory, action.payload]
          : [action.payload],
      };
    case 'UPDATE_PLAN_NOTES':
      return {
        ...state,
        workoutPlans: state.workoutPlans.map(plan => 
          plan.id === action.payload.planId 
            ? { ...plan, notes: action.payload.notes }
            : plan
        ),
      };
    case 'UPDATE_DAY_NOTES':
      return {
        ...state,
        workoutPlans: state.workoutPlans.map(plan => {
          if (plan.id === action.payload.planId) {
            return {
              ...plan,
              days: plan.days.map(day => 
                day.id === action.payload.dayId 
                  ? { ...day, notes: action.payload.notes }
                  : day
              )
            };
          }
          return plan;
        }),
      };
    case 'UPDATE_EXERCISE_NOTES':
      return {
        ...state,
        workoutPlans: state.workoutPlans.map(plan => {
          if (plan.id === action.payload.planId) {
            return {
              ...plan,
              days: plan.days.map(day => {
                if (day.id === action.payload.dayId) {
                  return {
                    ...day,
                    exercises: day.exercises.map(exercise =>
                      exercise.id === action.payload.exerciseId
                        ? { ...exercise, notes: action.payload.notes }
                        : exercise
                    )
                  };
                }
                return day;
              })
            };
          }
          return plan;
        }),
      };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...action.payload
        },
      };
    case 'ADD_PERIODIZATION_PLAN':
      return {
        ...state,
        periodizationPlans: [...state.periodizationPlans, action.payload],
      };
    case 'UPDATE_PERIODIZATION_PLAN':
      return {
        ...state,
        periodizationPlans: state.periodizationPlans.map(plan => 
          plan.id === action.payload.id ? action.payload : plan
        ),
      };
    case 'DELETE_PERIODIZATION_PLAN':
      return {
        ...state,
        periodizationPlans: state.periodizationPlans.filter(plan => plan.id !== action.payload),
      };
    case 'APPLY_PERIODIZATION_TO_PLAN':
      return {
        ...state,
        workoutPlans: state.workoutPlans.map(plan => {
          if (plan.id === action.payload.planId) {
            return {
              ...plan,
              periodization: action.payload.periodizationId,
              periodizationData: action.payload.periodizationData
            };
          }
          return plan;
        }),
      };
    case 'REPAIR_WORKOUT_PLANS':
      return {
        ...state,
        workoutPlans: action.payload,
      };
    case 'UPDATE_WORKOUT_HISTORY':
      return {
        ...state,
        workoutHistory: state.workoutHistory.map(workout =>
          workout.id === action.payload.id ? { ...workout, ...action.payload, updatedAt: new Date().toISOString() } : workout
        )
      };
    default:
      return state;
  }
};

// Create context
const WorkoutContext = createContext();

// Context provider component
export const WorkoutProvider = ({ children }) => {
  // Load state from localStorage if available
  const loadState = () => {
    try {
      console.log('🔄 Loading state from localStorage with security validation');
      const parsedState = secureStorage.get('workoutState');
      const defaultInitialState = getSmartInitialState(); // Get a fresh copy of initial state for fallback

      if (!parsedState) {
        console.log('❌ No saved state found in localStorage, using initial state');
        return { ...defaultInitialState, isInitialized: true };
      }
      
      console.log('✅ Found saved state in localStorage');
      // Ensure exercises are populated if they are missing or empty in the stored state
      if (!parsedState.exercises || !Array.isArray(parsedState.exercises) || parsedState.exercises.length === 0) {
        console.warn('⚠️ Exercises in stored state are missing, not an array, or empty. Falling back to default exercises.');
        parsedState.exercises = defaultInitialState.exercises;
      }
      
      console.log('📊 Parsed workoutPlans count:', 
        parsedState.workoutPlans ? parsedState.workoutPlans.length : 0);
      console.log('🆔 Parsed workoutPlans IDs:', 
        parsedState.workoutPlans ? parsedState.workoutPlans.map(p => p.id).join(', ') : 'none');
      console.log('📝 Workout history count:', 
        parsedState.workoutHistory ? parsedState.workoutHistory.length : 0);
      
      // Validate workoutPlans structure
      if (parsedState.workoutPlans && Array.isArray(parsedState.workoutPlans)) {
        console.log('✅ WorkoutPlans array is valid');
        // Ensure each plan has a valid days array
        parsedState.workoutPlans = parsedState.workoutPlans.map(plan => {
          let updatedPlan = { ...plan };
          
          if (!updatedPlan.days) {
            console.warn(`⚠️ Plan ${updatedPlan.id} has no days property, fixing...`);
            updatedPlan.days = [];
          } else if (!Array.isArray(updatedPlan.days)) {
            console.warn(`⚠️ Plan ${updatedPlan.id} has days but it's not an array, fixing...`);
            updatedPlan.days = [];
          } else {
            console.log(`✅ Plan ${updatedPlan.id} has ${updatedPlan.days.length} days`);
          }
          
          // Ensure each day within the plan has valid exercises and advancedMethods arrays
          if (Array.isArray(updatedPlan.days)) {
            updatedPlan.days = updatedPlan.days.map(day => {
              let updatedDay = { ...day };
              if (!updatedDay.exercises || !Array.isArray(updatedDay.exercises)) {
                console.warn(`⚠️ Day ${updatedDay.id} in plan ${updatedPlan.id} has invalid exercises array, fixing...`);
                updatedDay.exercises = [];
              }
              if (!updatedDay.advancedMethods || !Array.isArray(updatedDay.advancedMethods)) {
                console.warn(`⚠️ Day ${updatedDay.id} in plan ${updatedPlan.id} has invalid advancedMethods array, fixing...`);
                updatedDay.advancedMethods = [];
              }
              return updatedDay;
            });
          }
          
          return updatedPlan;
        });
      } else {
        console.warn('⚠️ workoutPlans property is missing or not an array, initializing to empty array');
        parsedState.workoutPlans = [];
      }
      
      // Validate workout history
      if (!parsedState.workoutHistory || !Array.isArray(parsedState.workoutHistory)) {
        console.warn('⚠️ workoutHistory is missing or not an array, initializing to empty array');
        parsedState.workoutHistory = [];
      }
      
      // Ensure trainingMethods are populated if they are missing or empty
      if (!parsedState.trainingMethods || !Array.isArray(parsedState.trainingMethods) || parsedState.trainingMethods.length === 0) {
        console.warn('⚠️ Training methods in stored state are missing, not an array, or empty. Falling back to default training methods.');
        parsedState.trainingMethods = defaultInitialState.trainingMethods;
      }
      
      // Mark state as loaded from storage
      parsedState.isInitialized = true;
      parsedState.loadedFromStorage = true;
      
      return parsedState;
    } catch (error) {
      console.error('❌ Error loading state from localStorage:', error);
      // If there's an error, clear localStorage and reset to initial state
      localStorage.removeItem('workoutState'); // Consider secureStorage.remove here if it exists
      const defaultInitialStateOnError = getSmartInitialState(); // Get a fresh copy
      return { ...defaultInitialStateOnError, isInitialized: true };
    }
  };

  const [state, dispatch] = useReducer(workoutReducer, loadState());

  // Save state to localStorage when it changes (but only after initial load)
  useEffect(() => {
    // Don't save during the initial load
    if (!state.isInitialized) {
      return;
    }
    
    try {
      console.log('💾 Saving state to localStorage, workoutPlans count:',
        state.workoutPlans ? state.workoutPlans.length : 0);
      console.log('💾 Saving state to localStorage, workoutHistory count:',
        state.workoutHistory ? state.workoutHistory.length : 0);
      
      // Validate workoutPlans before saving
      const stateToSave = { ...state };
      if (stateToSave.workoutPlans && Array.isArray(stateToSave.workoutPlans)) {
        stateToSave.workoutPlans = stateToSave.workoutPlans.map(plan => {
          let updatedPlan = { ...plan };
          // Ensure days is a valid array
          if (!updatedPlan.days || !Array.isArray(updatedPlan.days)) {
            console.warn(`⚠️ Plan ${updatedPlan.id} has invalid days array, fixing before save...`);
            updatedPlan.days = [];
          }
          // Ensure each day within the plan has valid exercises and advancedMethods arrays before save
          updatedPlan.days = updatedPlan.days.map(day => {
            let updatedDay = { ...day };
            if (!updatedDay.exercises || !Array.isArray(updatedDay.exercises)) {
              console.warn(`⚠️ Day ${updatedDay.id} in plan ${updatedPlan.id} has invalid exercises array, fixing before save...`);
              updatedDay.exercises = [];
            }
            if (!updatedDay.advancedMethods || !Array.isArray(updatedDay.advancedMethods)) {
              console.warn(`⚠️ Day ${updatedDay.id} in plan ${updatedPlan.id} has invalid advancedMethods array, fixing before save...`);
              updatedDay.advancedMethods = [];
            }
            return updatedDay;
          });
          return updatedPlan;
        });
      }
      
      // Remove internal flags before saving
      delete stateToSave.isInitialized;
      delete stateToSave.loadedFromStorage;
      
      // Use secure storage instead of direct localStorage
      const saveSuccess = secureStorage.set('workoutState', stateToSave);
      if (!saveSuccess) {
        console.error('❌ Failed to save state securely');
      } else {
        console.log('✅ State saved successfully to localStorage');
      }
    } catch (error) {
      console.error('❌ Error saving state to localStorage:', error);
    }
  }, [state]);

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use the context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export default WorkoutContext; 