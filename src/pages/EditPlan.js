import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';
import { deepCloneWithSafeChecks } from '../context/WorkoutContext';
import AdvancedTrainingMethod from '../components/workout/AdvancedTrainingMethod';
import NotesHistory from '../components/notes/NotesHistory';
import PeriodizationApplicator from '../components/workout/PeriodizationApplicator';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.cardBackground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  min-height: 100px;
  background-color: ${props => props.theme.colors.cardBackground};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
`;

const DaysContainer = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`;

const AddDayButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DayCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DayCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ReorderButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const ReorderButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textLight};
  cursor: pointer;
  font-size: 1.2rem;
  padding: ${props => props.theme.spacing.xs};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ExerciseList = styled.div`
  margin-top: ${props => props.theme.spacing.md};
`;

const ExerciseItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: ${props => props.theme.spacing.md};
  position: relative;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ExerciseName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.accent};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.md};
  padding: ${props => props.theme.spacing.xs};
  line-height: 1;
  
  &:hover {
    color: ${props => props.theme.colors.accentDark};
  }
`;

const ExerciseForm = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.grayLight};
  border-radius: ${props => props.theme.borderRadius.small};
`;

const ExerciseSelector = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SearchableSelect = styled.div`
  position: relative;
  width: 100%;
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.cardBackground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-top: none;
  border-radius: 0 0 4px 4px;
  font-size: 0.9rem;
  background-color: ${props => props.theme.colors.cardBackground};
`;

const CustomSelect = styled.div`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.cardBackground};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:focus, &:hover {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
  
  &:after {
    content: "▼";
    font-size: 0.8rem;
    color: ${props => props.theme.colors.textLight};
  }
`;

const SelectOptions = styled.div`
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.border};
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: ${props => props.theme.colors.cardBackground};
  z-index: 10;
`;

const OptionItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &.selected {
    background-color: #e3f2fd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ExerciseParametersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ParameterInput = styled.div`
  label {
    display: block;
    font-size: ${props => props.theme.typography.fontSizes.sm};
    margin-bottom: ${props => props.theme.spacing.xs};
    color: ${props => props.theme.colors.textLight};
  }
  
  input {
    width: 100%;
    padding: ${props => props.theme.spacing.sm};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.small};
    background-color: ${props => props.theme.colors.cardBackground};
    font-size: ${props => props.theme.typography.fontSizes.sm};
  }
`;

const NotesInput = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  
  label {
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
    color: ${props => props.theme.colors.textLight};
  }
  
  textarea {
    width: 100%;
    padding: ${props => props.theme.spacing.sm};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.small};
    min-height: 60px;
    background-color: ${props => props.theme.colors.cardBackground};
    font-size: ${props => props.theme.typography.fontSizes.sm};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
`;

const NotFoundMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin: ${props => props.theme.spacing.xl} auto;
  max-width: 600px;
`;

// Fallback exercise options in case the context is empty
const initialExerciseOptions = [
  { value: 'ex1', label: 'Kniebeugen' },
  { value: 'ex2', label: 'Bankdrücken' },
  { value: 'ex3', label: 'Kreuzheben' },
  { value: 'ex4', label: 'Klimmzüge' },
  { value: 'ex5', label: 'Schulterdrücken' }
];

// Utility function to debug plan structure
const debugPlanStructure = (plan) => {
  try {
    console.log('Plan ID:', plan.id);
    console.log('Plan name:', plan.name);
    console.log('Days count:', plan.days ? plan.days.length : 0);
    
    if (Array.isArray(plan.days)) {
      plan.days.forEach((day, index) => {
        console.log(`Day ${index}:`, day.id, day.name);
        console.log(`Day ${index} exercises:`, day.exercises ? day.exercises.length : 0);
      });
    } else {
      console.error('Days is not an array:', typeof plan.days, plan.days);
    }
    
    // Test if plan can be stringified
    const jsonString = JSON.stringify(plan);
    console.log('Plan can be stringified, length:', jsonString.length);
  } catch (error) {
    console.error('Error in debugPlanStructure:', error);
  }
};

const EditPlan = () => {
  const { id } = useParams();
  const { state, dispatch } = useWorkout();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State for the plan being edited
  const [plan, setPlan] = useState({
    id: '',
    name: '',
    description: '',
    days: []
  });
  
  const [currentDay, setCurrentDay] = useState({
    name: '',
    exercises: []
  });
  
  const [showDayForm, setShowDayForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [exerciseParams, setExerciseParams] = useState({
    sets: '',
    reps: '',
    weight: '',
    repsInReserve: '',
    rest: '',
    notes: ''
  });
  
  const exerciseDropdownRef = useRef(null);
  
  const availableExercises = useMemo(() => {
    return (state.exercises && state.exercises.length > 0) ? state.exercises : initialExerciseOptions.map(ex => ({...ex, id: ex.value, name: ex.label, muscleGroups: []}));
  }, [state.exercises]);
  
  const filteredExercises = useMemo(() => {
    if (!availableExercises) return [];
    return availableExercises.filter(exercise => {
      const matchesMuscleGroup = !selectedMuscleGroup ||
        (exercise.muscleGroups &&
         Array.isArray(exercise.muscleGroups) &&
         exercise.muscleGroups.includes(selectedMuscleGroup));
      const matchesSearchTerm = !exerciseSearchTerm ||
        (exercise.name &&
         exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()));
      return matchesMuscleGroup && matchesSearchTerm;
    });
  }, [availableExercises, selectedMuscleGroup, exerciseSearchTerm]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exerciseDropdownRef.current && !exerciseDropdownRef.current.contains(event.target)) {
        const activeDropdown = document.getElementById('exerciseOptions');
        if (activeDropdown && activeDropdown.style.display === 'block') {
          activeDropdown.style.display = 'none';
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (!state.exercises || state.exercises.length === 0) {
      console.log("No exercises found! Resetting to default state...");
      localStorage.removeItem('workoutState');
      window.location.reload();
    }
  }, [state.exercises]);
  
  useEffect(() => {
    console.log('EditPlan - Searching for plan with ID:', id);
    console.log('Available plans:', state.workoutPlans ? state.workoutPlans.length : 0);
    
    // Find plan in state
    const foundPlan = state.workoutPlans.find(p => p.id === id);
    
    if (foundPlan) {
      console.log('Plan found:', foundPlan);
      console.log('Days array:', foundPlan.days);
      
      // Clone the plan to avoid state pollution
      const clonedPlan = deepCloneWithSafeChecks(foundPlan);
      console.log('Cloned plan:', clonedPlan);
      
      // Set the plan state for rendering/editing
      setPlan(clonedPlan);
    } else {
      console.error('Plan not found with ID:', id);
      alert('Der angeforderte Trainingsplan konnte nicht gefunden werden.');
      navigate('/plans');
    }
  }, [id, state.workoutPlans, navigate]);
  
  useEffect(() => {
    if (plan && plan.days) {
      const updatedDays = plan.days.map(day => {
        if (!day.advancedMethods) {
          return { ...day, advancedMethods: [] };
        }
        return day;
      });
      
      // Only update if there's a change needed to avoid infinite loops
      if (updatedDays.some(day => !day.advancedMethods)) {
        console.log('Updating days with advancedMethods');
        setPlan(prevPlan => ({...prevPlan, days: updatedDays}));
      }
      console.log('Plan state updated with advancedMethods:', updatedDays);
    }
  }, [plan]); // Include plan in dependency array
  
  // New debug effect to help track when rendering should occur
  useEffect(() => {
    console.log('Current plan state for rendering:', JSON.stringify(plan).substring(0, 100) + '...');
    if (plan.id) {
      console.log('Plan has ID, should render content');
    }
  }, [plan]); // Include full plan since JSON.stringify uses the entire object
  
  // If no plan is found in the state or URL, redirect to plans overview
  if (!plan && !id) {
    console.log('No ID provided, redirecting to plans overview');
    navigate('/plans');
    return null;
  }
  
  // Handle not found case
  if (!plan) {
    console.log('No existing plan found, returning NotFoundMessage');
    return (
      <NotFoundMessage>
        <h2>Trainingsplan nicht gefunden</h2>
        <p>Der gesuchte Trainingsplan konnte nicht gefunden werden.</p>
        <Button onClick={() => navigate('/plans')}>
          Zurück zur Übersicht
        </Button>
      </NotFoundMessage>
    );
  }
  
  // Force rendering with basic plan data even if validation fails
  if (!plan || !plan.id) {
    console.log('Plan object is incomplete:', plan);
    // If plan is incomplete but existingPlan exists, use existingPlan data directly
    if (state.workoutPlans && state.workoutPlans.length > 0) {
      console.log('Using existingPlan as fallback for rendering');
      // Create a safe fallback plan in case setPlan didn't work
      const fallbackPlan = {
        id: state.workoutPlans[0].id,
        name: state.workoutPlans[0].name || '',
        description: state.workoutPlans[0].description || '',
        days: Array.isArray(state.workoutPlans[0].days) ? state.workoutPlans[0].days.map(day => ({
          ...day,
          exercises: Array.isArray(day.exercises) ? day.exercises : [],
          advancedMethods: Array.isArray(day.advancedMethods) ? day.advancedMethods : []
        })) : [],
        createdAt: state.workoutPlans[0].createdAt
      };
      
      // Use the fallback plan and continue rendering
      console.log('Rendering with fallback plan:', fallbackPlan.name);
      
      // Return a basic version of the form to avoid blank page
      return (
        <div>
          <h1>Trainingsplan bearbeiten</h1>
          <FormContainer>
            <Card>
              <Card.Body>
                <p>Trainingsplan wird geladen: {fallbackPlan.name}</p>
                <Button onClick={() => setPlan(fallbackPlan)}>
                  Plan laden
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/plans')}
                  style={{ marginLeft: '10px' }}
                >
                  Zurück zur Übersicht
                </Button>
              </Card.Body>
            </Card>
          </FormContainer>
        </div>
      );
    }
  } else {
    console.log('Rendering plan with ID:', plan.id);
  }
  
  // Perform a deep validation of the plan structure
  try {
    // Basic validation on plan object
    if (!plan) {
      throw new Error('Plan object is undefined');
    }
    
    // Validate days array
    if (!Array.isArray(plan.days)) {
      console.error('Plan days is not an array:', plan.days);
      setPlan({...plan, days: []});
    }

    // Validate each day's structure
    plan.days.forEach(day => {
      if (!day.exercises || !Array.isArray(day.exercises)) {
        console.warn(`Day ${day.id} has invalid exercises - fixing`);
        day.exercises = [];
      }
      
      if (!day.advancedMethods || !Array.isArray(day.advancedMethods)) {
        console.warn(`Day ${day.id} has invalid advancedMethods - fixing`);
        day.advancedMethods = [];
      }
    });
  } catch (error) {
    console.error('Error in plan validation:', error);
    return (
      <NotFoundMessage>
        <h2>Fehler beim Laden des Trainingsplans</h2>
        <p>Es gab einen Fehler beim Laden des Plans: {error.message}</p>
        <Button onClick={() => navigate('/plans')}>
          Zurück zur Übersicht
        </Button>
      </NotFoundMessage>
    );
  }
  
  const handlePlanChange = (e) => {
    setPlan({
      ...plan,
      [e.target.name]: e.target.value
    });
  };
  
  const handleDayChange = (e) => {
    setCurrentDay({
      ...currentDay,
      name: e.target.value
    });
  };
  
  const handleAddDay = () => {
    if (!currentDay.name.trim()) {
      alert('Bitte gib einen Namen für den Trainingstag ein.');
      return;
    }
    
    const newDay = {
      id: uuidv4(),
      name: currentDay.name.trim(),
      exercises: [],
      advancedMethods: []
    };
    
    console.log('Adding new day:', newDay);
    
    const updatedDays = Array.isArray(plan.days) ? [...plan.days, newDay] : [newDay];
    
    setPlan({
      ...plan,
      days: updatedDays
    });
    
    console.log('Updated plan days:', updatedDays);
    
    setCurrentDay({
      name: '',
      exercises: []
    });
    
    setShowDayForm(false);
  };
  
  const handleDeleteDay = (dayId) => {
    setPlan({
      ...plan,
      days: plan.days.filter(day => day.id !== dayId)
    });
  };
  
  const handleDayNameChange = (dayId, newName) => {
    setPlan({
      ...plan,
      days: plan.days.map(day => 
        day.id === dayId 
          ? { ...day, name: newName }
          : day
      )
    });
  };
  
  const handleExerciseParamChange = (e) => {
    setExerciseParams({
      ...exerciseParams,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAddExercise = (dayId) => {
    if (!selectedExerciseId) {
      alert('Bitte wähle eine Übung aus.');
      return;
    }
    
    const selectedExercise = state.exercises.find(ex => ex.id === selectedExerciseId);
    
    if (!selectedExercise) return;
    
    const newExercise = {
      id: uuidv4(),
      exerciseId: selectedExerciseId,
      name: selectedExercise.name,
      muscleGroups: selectedExercise.muscleGroups || [],
      sets: exerciseParams.sets ? parseInt(exerciseParams.sets, 10) : null,
      reps: exerciseParams.reps ? parseInt(exerciseParams.reps, 10) : null,
      weight: exerciseParams.weight ? parseFloat(exerciseParams.weight) : null,
      repsInReserve: exerciseParams.repsInReserve ? parseInt(exerciseParams.repsInReserve, 10) : null,
      rest: exerciseParams.rest || null,
      notes: exerciseParams.notes || null
    };
    
    setPlan({
      ...plan,
      days: plan.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            exercises: [...day.exercises, newExercise]
          };
        }
        return day;
      })
    });
    
    setSelectedExerciseId('');
    setExerciseSearchTerm('');
    setSelectedMuscleGroup('');
    setExerciseParams({
      sets: '',
      reps: '',
      weight: '',
      repsInReserve: '',
      rest: '',
      notes: ''
    });
    
    setShowExerciseForm(false);
  };
  
  const handleRemoveExercise = (dayId, exerciseId) => {
    setPlan({
      ...plan,
      days: plan.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            exercises: day.exercises.filter(ex => ex.id !== exerciseId)
          };
        }
        return day;
      })
    });
  };
  
  const handleSavePlan = () => {    
    if (!plan.name || !plan.name.trim()) {      
      alert('Bitte gib einen Namen für den Trainingsplan ein.');      
      return;    
    }        
    
    if (!plan.days || plan.days.length === 0) {      
      alert('Bitte füge mindestens einen Trainingstag hinzu.');      
      return;    
    }        
    
    console.log('Saving plan with days:', plan.days);    
    debugPlanStructure(plan);        
    
    const updatedPlan = {      
      ...plan,      
      name: plan.name.trim(),      
      description: plan.description ? plan.description.trim() : '',      
      days: [...plan.days],      
      updatedAt: new Date().toISOString()    
    };        
    
    console.log('Final updated plan:');    
    debugPlanStructure(updatedPlan);        
    
    dispatch({      
      type: 'UPDATE_WORKOUT_PLAN',      
      payload: updatedPlan    
    });        
    
    try {      
      const currentState = JSON.parse(localStorage.getItem('workoutState')) || {};      
      const updatedWorkoutPlans = Array.isArray(currentState.workoutPlans)         
        ? currentState.workoutPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p)        
        : [updatedPlan];            
      
      localStorage.setItem('workoutState', JSON.stringify({        
        ...currentState,        
        workoutPlans: updatedWorkoutPlans      
      }));            
      
      console.log('Plan saved successfully to localStorage');    
    } catch (error) {      
      console.error('Error saving plan to localStorage:', error);      
      alert('Warnung: Es gab ein Problem beim Speichern. Bitte versuche es erneut.');      
      return;    
    }        
    
    navigate('/plans');  
  };    
  
  // Add handler function for deleting plan  
  const handleDeletePlan = () => {    
    if (window.confirm(`Möchtest du den Trainingsplan "${plan.name}" wirklich löschen?`)) {      
      console.log('Deleting plan with ID:', plan.id);            
      
      // Dispatch delete action      
      dispatch({        
        type: 'DELETE_WORKOUT_PLAN',        
        payload: plan.id      
      });            
      
      // Navigate back to plans overview      
      navigate('/plans');    
    }  
  };
  
  const handleAddAdvancedMethod = (dayId) => {
    setPlan({
      ...plan,
      days: plan.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            advancedMethods: [
              ...(day.advancedMethods || []),
              {
                id: uuidv4(),
                method: 'Standard',
                groups: []
              }
            ]
          };
        }
        return day;
      })
    });
  };
  
  const handleUpdateAdvancedMethod = (dayId, methodId, methodData) => {
    setPlan({
      ...plan,
      days: plan.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            advancedMethods: (day.advancedMethods || []).map(method => {
              if (method.id === methodId) {
                return {
                  ...method,
                  ...methodData
                };
              }
              return method;
            })
          };
        }
        return day;
      })
    });
  };
  
  const handleRemoveAdvancedMethod = (dayId, methodId) => {
    setPlan({
      ...plan,
      days: plan.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            advancedMethods: (day.advancedMethods || []).filter(method => method.id !== methodId)
          };
        }
        return day;
      })
    });
  };
  
  const handleMoveDayUp = (dayIndex) => {
    if (dayIndex === 0) return;
    
    const updatedDays = [...plan.days];
    const temp = updatedDays[dayIndex];
    updatedDays[dayIndex] = updatedDays[dayIndex - 1];
    updatedDays[dayIndex - 1] = temp;
    
    setPlan({
      ...plan,
      days: updatedDays
    });
  };
  
  const handleMoveDayDown = (dayIndex) => {
    if (dayIndex === plan.days.length - 1) return;
    
    const updatedDays = [...plan.days];
    const temp = updatedDays[dayIndex];
    updatedDays[dayIndex] = updatedDays[dayIndex + 1];
    updatedDays[dayIndex + 1] = temp;
    
    setPlan({
      ...plan,
      days: updatedDays
    });
  };
  
  return (
    <div>
      <h1>Trainingsplan bearbeiten</h1>
      
      <FormContainer>
        <Card>
          <Card.Body>
            <FormGroup>
              <Label htmlFor="name">Name des Trainingsplans</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                value={plan.name}
                onChange={handlePlanChange}
                placeholder="z.B. 'Push Pull Legs' oder 'Ganzkörperplan'"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={plan.description || ''}
                onChange={handlePlanChange}
                placeholder="Beschreibe, worum es bei diesem Trainingsplan geht..."
              />
            </FormGroup>
            
            <NotesHistory 
              entityType="plan"
              entityId={plan.id}
              notes={plan.notes}
            />
          </Card.Body>
        </Card>
        
        <Card style={{ marginTop: '1.5rem' }}>
          <Card.Body>
            <h2>Periodisierung</h2>
            <PeriodizationApplicator planId={plan.id} />
          </Card.Body>
        </Card>
        
        <DaysContainer>
          <h2>Trainingstage</h2>
          
          {!showDayForm ? (
            <AddDayButton onClick={() => setShowDayForm(true)}>
              + Trainingstag hinzufügen
            </AddDayButton>
          ) : (
            <Card>
              <Card.Body>
                <FormGroup>
                  <Label htmlFor="dayName">Name des Trainingstags</Label>
                  <Input 
                    type="text" 
                    id="dayName" 
                    name="dayName" 
                    value={currentDay.name}
                    onChange={handleDayChange}
                    placeholder="z.B. Oberkörper, Beine, Push, Pull..."
                    required
                  />
                </FormGroup>
                
                <ButtonGroup>
                  <Button onClick={handleAddDay}>
                    Hinzufügen
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowDayForm(false)}
                  >
                    Abbrechen
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          )}
          
          {plan.days.length > 0 ? (
            plan.days.map((day, dayIndex) => (
              <DayCard key={day.id}>
                <Card.Body>
                  <DayCardHeader>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      <div style={{ flex: 1 }}>
                        <Label htmlFor={`day-name-${day.id}`}>Name des Trainingstags</Label>
                        <Input
                          type="text"
                          id={`day-name-${day.id}`}
                          value={day.name}
                          onChange={(e) => handleDayNameChange(day.id, e.target.value)}
                          placeholder="z.B. Push Tag, Oberkörper, Beine..."
                          style={{ marginBottom: 0 }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <ReorderButtons>
                        <ReorderButton 
                          onClick={() => handleMoveDayUp(dayIndex)}
                          disabled={dayIndex === 0}
                          title="Nach oben verschieben"
                        >
                          ↑
                        </ReorderButton>
                        <ReorderButton 
                          onClick={() => handleMoveDayDown(dayIndex)}
                          disabled={dayIndex === plan.days.length - 1}
                          title="Nach unten verschieben"
                        >
                          ↓
                        </ReorderButton>
                      </ReorderButtons>
                      <Button 
                        variant="danger" 
                        onClick={() => handleDeleteDay(day.id)}
                        size="small"
                      >
                        Tag entfernen
                      </Button>
                    </div>
                  </DayCardHeader>
                  <NotesHistory 
                    entityType="day"
                    planId={plan.id}
                    dayId={day.id}
                    entityId={day.id}
                    notes={day.notes}
                  />
                  
                  <h3>Übungen</h3>
                  
                  {day.exercises.length === 0 && (!day.advancedMethods || day.advancedMethods.length === 0) && (
                    <p>Noch keine Übungen hinzugefügt</p>
                  )}
                  
                  <ExerciseList>
                    {day.exercises.map(exercise => (
                      <ExerciseItem key={exercise.id}>
                        <ExerciseHeader>
                          <ExerciseName>{exercise.name}</ExerciseName>
                          <RemoveButton onClick={() => handleRemoveExercise(day.id, exercise.id)}>
                            &times;
                          </RemoveButton>
                        </ExerciseHeader>
                        <div>
                          {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                            <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: theme.colors.textLight }}>
                              <strong>Muskelgruppen:</strong> {exercise.muscleGroups.join(', ')}
                            </div>
                          )}
                          <strong>Sätze:</strong> {exercise.sets}
                          {exercise.reps && <> | <strong>Wiederholungen:</strong> {exercise.reps}</>}
                          {exercise.weight && <> | <strong>Gewicht:</strong> {exercise.weight} kg</>}
                          {exercise.repsInReserve && <> | <strong>Wiederholungen im Reserve:</strong> {exercise.repsInReserve}</>}
                          {exercise.rest && <> | <strong>Pause:</strong> {exercise.rest} s</>}
                        </div>
                        
                        <NotesHistory 
                          entityType="exercise"
                          planId={plan.id}
                          dayId={day.id}
                          exerciseId={exercise.id}
                          currentNote={exercise.notes}
                          onNoteSave={(newNote) => {
                            setPlan({
                              ...plan,
                              days: plan.days.map(d => {
                                if (d.id === day.id) {
                                  return {
                                    ...d,
                                    exercises: d.exercises.map(ex => 
                                      ex.id === exercise.id ? {...ex, notes: newNote} : ex
                                    )
                                  };
                                }
                                return d;
                              })
                            });
                          }}
                        />
                      </ExerciseItem>
                    ))}
                    
                    {day.advancedMethods && day.advancedMethods.map(method => (
                      <Card key={method.id} style={{ marginBottom: '1rem', border: `1px solid ${theme.colors.primary}` }}>
                        <Card.Header style={{ backgroundColor: theme.colors.background, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0 }}>Erweiterte Trainingsmethode: {method.method}</h4>
                          <RemoveButton onClick={() => handleRemoveAdvancedMethod(day.id, method.id)}>
                            &times;
                          </RemoveButton>
                        </Card.Header>
                        <Card.Body>
                          <AdvancedTrainingMethod 
                            value={method} 
                            onChange={(data) => handleUpdateAdvancedMethod(day.id, method.id, data)}
                            exercises={availableExercises} 
                          />
                        </Card.Body>
                      </Card>
                    ))}
                  </ExerciseList>
                  
                  <Button 
                    onClick={() => {
                      setShowExerciseForm(day.id);
                      setSelectedExerciseId('');
                      setSelectedMuscleGroup('');
                      setExerciseSearchTerm('');
                      setExerciseParams({
                        sets: '',
                        reps: '',
                        weight: '',
                        repsInReserve: '',
                        rest: '',
                        notes: ''
                      });
                    }}
                    style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                  >
                    Übung hinzufügen
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    onClick={() => handleAddAdvancedMethod(day.id)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    Erweiterte Trainingsmethode hinzufügen
                  </Button>
                  
                  {showExerciseForm === day.id && (
                    <ExerciseForm>
                      <ExerciseSelector>
                        <Label htmlFor="muscleGroup">Muskelgruppe auswählen</Label>
                        <Select 
                          id="muscleGroup" 
                          value={selectedMuscleGroup}
                          onChange={(e) => {
                            setSelectedMuscleGroup(e.target.value);
                            setSelectedExerciseId('');
                          }}
                        >
                          <option value="">Alle Muskelgruppen</option>
                          <option value="Brustmuskulatur">Brustmuskulatur (Pectoralis)</option>
                          <option value="Rückenmuskulatur">Rückenmuskulatur (Latissimus, Trapezius)</option>
                          <option value="Beinmuskulatur">Beinmuskulatur (Quadrizeps, Beinbeuger)</option>
                          <option value="Schultermuskulatur">Schultermuskulatur (Deltoideus)</option>
                          <option value="Bizeps">Bizeps</option>
                          <option value="Trizeps">Trizeps</option>
                          <option value="Bauchmuskulatur">Bauchmuskulatur</option>
                        </Select>
                      </ExerciseSelector>

                      <ExerciseSelector>
                        <Label htmlFor="exercise">Übung auswählen</Label>
                        <SearchableSelect id="exerciseDropdown" ref={exerciseDropdownRef}>
                          <CustomSelect
                            onClick={() => {
                              const options = document.getElementById('exerciseOptions');
                              if (options) {
                                options.style.display = options.style.display === 'block' ? 'none' : 'block';
                              }
                            }}
                          >
                            {selectedExerciseId 
                              ? availableExercises.find(ex => ex.id === selectedExerciseId)?.name || 'Übung auswählen...'
                              : 'Übung auswählen...'
                            }
                          </CustomSelect>
                          <SelectOptions id="exerciseOptions" style={{display: 'none'}}>
                            <SearchInput 
                              placeholder="Übung suchen..." 
                              value={exerciseSearchTerm}
                              onChange={(e) => setExerciseSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                            <div style={{ padding: '5px', color: theme.colors.textLight, fontSize: '0.8rem' }}>
                              Gefundene Übungen: {filteredExercises.length} / {availableExercises ? availableExercises.length : 0}
                            </div>
                            {filteredExercises.length > 0 ? (
                              filteredExercises
                                .map(exercise => (
                                  <OptionItem 
                                    key={exercise.id}
                                    className={selectedExerciseId === exercise.id ? 'selected' : ''}
                                    onClick={() => {
                                      setSelectedExerciseId(exercise.id);
                                      const options = document.getElementById('exerciseOptions');
                                      if (options) {
                                        options.style.display = 'none';
                                      }
                                    }}
                                  >
                                    {exercise.name} ({exercise.muscleGroups && Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.join(', ') : 'Keine Muskelgruppe'})
                                  </OptionItem>
                                ))
                            ) : (
                              <OptionItem disabled>Keine passenden Übungen gefunden</OptionItem>
                            )}
                          </SelectOptions>
                          
                          {(!availableExercises || availableExercises.length === 0 || (availableExercises.length === initialExerciseOptions.length && availableExercises[0].id === 'ex1')) && state.exercises && state.exercises.length === 0 && (
                            <div style={{ marginTop: '10px' }}>
                              <p style={{ color: theme.colors.accent, fontSize: '0.9rem' }}>Keine Übungen in der Datenbank! Bitte ggf. Datenbank zurücksetzen oder Übungen manuell anlegen.</p>
                              <Select 
                                id="exercise-fallback" 
                                value={selectedExerciseId}
                                onChange={(e) => setSelectedExerciseId(e.target.value)}
                              >
                                <option value="">Übung auswählen...</option>
                                {initialExerciseOptions.map(option => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </Select>
                            </div>
                          )}
                        </SearchableSelect>
                      </ExerciseSelector>
                      
                      <Label>Parameter (optional)</Label>
                      <ExerciseParametersGrid>
                        <ParameterInput>
                          <label htmlFor="sets">Sätze</label>
                          <input 
                            type="number" 
                            id="sets" 
                            name="sets" 
                            value={exerciseParams.sets}
                            onChange={handleExerciseParamChange}
                            min="1"
                          />
                        </ParameterInput>
                        <ParameterInput>
                          <label htmlFor="reps">Wiederholungen</label>
                          <input 
                            type="number" 
                            id="reps" 
                            name="reps" 
                            value={exerciseParams.reps}
                            onChange={handleExerciseParamChange}
                            min="1"
                          />
                        </ParameterInput>
                        <ParameterInput>
                          <label htmlFor="weight">Gewicht (kg)</label>
                          <input 
                            type="number" 
                            id="weight" 
                            name="weight" 
                            value={exerciseParams.weight}
                            onChange={handleExerciseParamChange}
                            step="0.5"
                            min="0"
                          />
                        </ParameterInput>
                        <ParameterInput>
                          <label htmlFor="repsInReserve">RIR</label>
                          <input 
                            type="number" 
                            id="repsInReserve" 
                            name="repsInReserve" 
                            value={exerciseParams.repsInReserve}
                            onChange={handleExerciseParamChange}
                            min="0"
                            max="10"
                            placeholder="0-10"
                          />
                        </ParameterInput>
                        <ParameterInput>
                          <label htmlFor="rest">Pausenzeit</label>
                          <input 
                            type="text" 
                            id="rest" 
                            name="rest" 
                            value={exerciseParams.rest}
                            onChange={handleExerciseParamChange}
                            placeholder="z.B. 60 sec"
                          />
                        </ParameterInput>
                      </ExerciseParametersGrid>
                      
                      <NotesInput>
                        <label htmlFor="notes">Notizen zur Übung</label>
                        <textarea 
                          id="notes" 
                          name="notes" 
                          value={exerciseParams.notes}
                          onChange={handleExerciseParamChange}
                          placeholder="z.B. Ausführung, Tipps..."
                        />
                      </NotesInput>
                      
                      <ButtonGroup>
                        <Button onClick={() => handleAddExercise(day.id)}>
                          Hinzufügen
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={() => setShowExerciseForm(null)}
                        >
                          Abbrechen
                        </Button>
                      </ButtonGroup>
                    </ExerciseForm>
                  )}
                </Card.Body>
              </DayCard>
            ))
          ) : (
            <p>Noch keine Trainingstage hinzugefügt.</p>
          )}
        </DaysContainer>
        
        <ActionButtons>
          <Button 
            variant="danger" 
            onClick={handleDeletePlan}
          >
            Trainingsplan löschen
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/plans')}
          >
            Abbrechen
          </Button>
          <Button 
            onClick={handleSavePlan}
          >
            Änderungen speichern
          </Button>
        </ActionButtons>
      </FormContainer>
    </div>
  );
};

export default EditPlan; 