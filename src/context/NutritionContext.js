import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NutritionContext = createContext();

const initialState = {
  nutritionPlans: [],
  meals: [],
  foodItems: [
    { id: uuidv4(), name: 'Huhn', calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: '100g' },
    { id: uuidv4(), name: 'Reis', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, portion: '100g' },
    { id: uuidv4(), name: 'Brokkoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, portion: '100g' },
    { id: uuidv4(), name: 'Eier', calories: 155, protein: 12.6, carbs: 0.7, fat: 11.5, portion: '100g' },
    { id: uuidv4(), name: 'Haferflocken', calories: 389, protein: 13.5, carbs: 66, fat: 6.9, portion: '100g' },
    { id: uuidv4(), name: 'Lachs', calories: 206, protein: 22, carbs: 0, fat: 13, portion: '100g' },
    { id: uuidv4(), name: 'Quark', calories: 71, protein: 12.4, carbs: 3.5, fat: 0.2, portion: '100g' },
    { id: uuidv4(), name: 'Mandeln', calories: 576, protein: 21, carbs: 22, fat: 49, portion: '100g' },
  ],
  dailyLogs: [],
  nutritionGoals: {
    calories: 2500,
    protein: 150,
    carbs: 250,
    fat: 80
  }
};

function nutritionReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    
    case 'ADD_NUTRITION_PLAN':
      return {
        ...state,
        nutritionPlans: [...state.nutritionPlans, action.payload]
      };
    
    case 'UPDATE_NUTRITION_PLAN':
      return {
        ...state,
        nutritionPlans: state.nutritionPlans.map(plan => 
          plan.id === action.payload.id ? action.payload : plan
        )
      };
    
    case 'DELETE_NUTRITION_PLAN':
      return {
        ...state,
        nutritionPlans: state.nutritionPlans.filter(plan => plan.id !== action.payload)
      };
    
    case 'ADD_FOOD_ITEM':
      return {
        ...state,
        foodItems: [...state.foodItems, action.payload]
      };
    
    case 'UPDATE_FOOD_ITEM':
      return {
        ...state,
        foodItems: state.foodItems.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case 'DELETE_FOOD_ITEM':
      return {
        ...state,
        foodItems: state.foodItems.filter(item => item.id !== action.payload)
      };
    
    case 'ADD_DAILY_LOG':
      return {
        ...state,
        dailyLogs: [...state.dailyLogs, action.payload]
      };
    
    case 'UPDATE_DAILY_LOG':
      return {
        ...state,
        dailyLogs: state.dailyLogs.map(log => 
          log.id === action.payload.id ? action.payload : log
        )
      };
    
    case 'DELETE_DAILY_LOG':
      return {
        ...state,
        dailyLogs: state.dailyLogs.filter(log => log.id !== action.payload)
      };
    
    case 'UPDATE_NUTRITION_GOALS':
      return {
        ...state,
        nutritionGoals: action.payload
      };
    
    default:
      return state;
  }
}

export function NutritionProvider({ children }) {
  const [state, dispatch] = useReducer(nutritionReducer, initialState);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('nutritionState');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nutritionState', JSON.stringify(state));
  }, [state]);

  return (
    <NutritionContext.Provider value={{ state, dispatch }}>
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
} 