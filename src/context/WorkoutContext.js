import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
  workoutPlans: [],
  exercises: [
    { 
      id: uuidv4(), 
      name: 'Bankdrücken', 
      muscleGroups: ['Brust', 'Trizeps'],
      equipment: ['Hantelbank', 'Langhantel'],
      difficulty: 'Mittel'
    },
    { 
      id: uuidv4(), 
      name: 'Kniebeugen', 
      muscleGroups: ['Beine', 'Gesäß'],
      equipment: ['Langhantel', 'Rack'],
      difficulty: 'Schwer'
    },
    { 
      id: uuidv4(), 
      name: 'Kreuzheben', 
      muscleGroups: ['Rücken', 'Beine'],
      equipment: ['Langhantel'],
      difficulty: 'Schwer'
    },
    { 
      id: uuidv4(), 
      name: 'Klimmzüge', 
      muscleGroups: ['Rücken', 'Bizeps'],
      equipment: ['Klimmzugstange'],
      difficulty: 'Schwer'
    },
    { 
      id: uuidv4(), 
      name: 'Schulterdrücken', 
      muscleGroups: ['Schultern'],
      equipment: ['Langhantel', 'Kurzhanteln'],
      difficulty: 'Mittel'
    },
    { 
      id: uuidv4(), 
      name: 'Bizepscurls', 
      muscleGroups: ['Bizeps'],
      equipment: ['Kurzhanteln', 'SZ-Stange'],
      difficulty: 'Leicht'
    },
    { 
      id: uuidv4(), 
      name: 'Trizepsdrücken', 
      muscleGroups: ['Trizeps'],
      equipment: ['Kabelzug', 'Kurzhanteln'],
      difficulty: 'Leicht'
    },
    { 
      id: uuidv4(), 
      name: 'Wadenheben', 
      muscleGroups: ['Waden'],
      equipment: ['Wadenmaschine', 'Stufe'],
      difficulty: 'Leicht'
    },
    { 
      id: uuidv4(), 
      name: 'Beinstrecken', 
      muscleGroups: ['Oberschenkel'],
      equipment: ['Beinstreckmaschine'],
      difficulty: 'Leicht'
    },
    { 
      id: uuidv4(), 
      name: 'Beinbeugen', 
      muscleGroups: ['Beinbizeps'],
      equipment: ['Beinbeugermaschine'],
      difficulty: 'Leicht'
    },
    { 
      id: uuidv4(), 
      name: 'Liegestütze', 
      muscleGroups: ['Brust', 'Trizeps', 'Schultern'],
      equipment: ['Körpergewicht'],
      difficulty: 'Mittel'
    },
    { 
      id: uuidv4(), 
      name: 'Situps', 
      muscleGroups: ['Bauchmuskeln'],
      equipment: ['Körpergewicht'],
      difficulty: 'Leicht'
    },
    { 
      id: uuidv4(), 
      name: 'Ausfallschritte', 
      muscleGroups: ['Beine', 'Gesäß'],
      equipment: ['Körpergewicht', 'Kurzhanteln'],
      difficulty: 'Mittel'
    },
    { 
      id: uuidv4(), 
      name: 'Rudern', 
      muscleGroups: ['Rücken', 'Bizeps'],
      equipment: ['Langhantel', 'Kurzhantel', 'Kabelzug'],
      difficulty: 'Mittel'
    },
    { 
      id: uuidv4(), 
      name: 'Fliegende', 
      muscleGroups: ['Brust'],
      equipment: ['Kurzhanteln', 'Kabelzug'],
      difficulty: 'Mittel'
    }
  ],
  calendarEvents: [],
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
  userProfile: {
    fitnessLevel: 'beginner',
    goal: '',
    trainingDays: '',
    equipment: '',
    limitations: '',
    preferredExercises: '',
  },
  periodizationPlans: []
};

// Reducer function
const workoutReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_WORKOUT_PLAN':
      return {
        ...state,
        workoutPlans: Array.isArray(state.workoutPlans) 
          ? [...state.workoutPlans, action.payload]
          : [action.payload],
      };
    case 'UPDATE_WORKOUT_PLAN':
      return {
        ...state,
        workoutPlans: Array.isArray(state.workoutPlans) 
          ? state.workoutPlans.map(plan => 
            plan.id === action.payload.id ? action.payload : plan
          )
          : [action.payload],
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
      return {
        ...state,
        workoutHistory: Array.isArray(state.workoutHistory) 
          ? [...state.workoutHistory, action.payload]
          : [action.payload],
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
      const savedState = localStorage.getItem('workoutState');
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(workoutReducer, loadState());

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('workoutState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
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