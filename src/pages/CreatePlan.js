import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';
import AdvancedTrainingMethod from '../components/workout/AdvancedTrainingMethod';

// Note: Fallback exercises are no longer needed as we have comprehensive exercise database

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors?.border || '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${props => props.theme.colors?.cardBackground || 'white'};
  color: ${props => props.theme.colors?.text || '#000'};
  
  &::placeholder {
    color: ${props => props.theme.colors?.textSecondary || '#999'};
  }
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors?.border || '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  background-color: ${props => props.theme.colors?.cardBackground || 'white'};
  color: ${props => props.theme.colors?.text || '#000'};
  
  &::placeholder {
    color: ${props => props.theme.colors?.textSecondary || '#999'};
  }
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const DaysContainer = styled.div`
  margin-top: 2rem;
`;

const AddDayButton = styled(Button)`
  margin-bottom: 1.5rem;
`;

const DayCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

const ExerciseList = styled.div`
  margin-top: 1rem;
`;

const ExerciseItem = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors?.cardBackground || '#f8f9fa'};
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
  border: 1px solid ${props => props.theme.colors?.border || 'transparent'};
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ExerciseName = styled.div`
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: #bd2130;
  }
`;

const ExerciseForm = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors?.background || '#f0f0f0'};
  border-radius: 4px;
`;

const ExerciseSelector = styled.div`
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors?.border || '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${props => props.theme.colors?.cardBackground || 'white'};
  color: ${props => props.theme.colors?.text || '#000'};
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  option {
    background-color: ${props => props.theme.colors?.cardBackground || 'white'};
    color: ${props => props.theme.colors?.text || '#000'};
  }
`;

const SearchableSelect = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelect = styled.div`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors?.border || '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${props => props.theme.colors?.cardBackground || 'white'};
  color: ${props => props.theme.colors?.text || '#000'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:focus, &:hover {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  &:after {
    content: "▼";
    font-size: 0.8rem;
    color: ${props => props.theme.colors?.textSecondary || '#555'};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors?.border || '#ddd'};
  border-top: none;
  border-radius: 0 0 4px 4px;
  font-size: 0.9rem;
  background-color: ${props => props.theme.colors?.cardBackground || 'white'};
  color: ${props => props.theme.colors?.text || '#000'};
  
  &::placeholder {
    color: ${props => props.theme.colors?.textSecondary || '#999'};
  }
`;

const SelectOptions = styled.div`
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors?.border || '#ddd'};
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: ${props => props.theme.colors?.cardBackground || 'white'};
  color: ${props => props.theme.colors?.text || '#000'};
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const OptionItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.name === 'dark' 
      ? props.theme.colors.grayLight 
      : props.theme.colors.grayLight};
    color: ${props => props.theme.colors.text};
  }
  
  &.selected {
    background-color: ${props => props.theme.colors.primaryLight || '#e3f2fd'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ExerciseParametersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ParameterInput = styled.div`
  label {
    display: block;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    color: ${props => props.theme.colors?.text || '#000'};
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors?.border || '#ddd'};
    border-radius: 4px;
    background-color: ${props => props.theme.colors?.cardBackground || 'white'};
    color: ${props => props.theme.colors?.text || '#000'};
    
    &::placeholder {
      color: ${props => props.theme.colors?.textSecondary || '#999'};
    }
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
`;

const NotesInput = styled.div`
  margin-top: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.25rem;
    color: ${props => props.theme.colors?.text || '#000'};
  }
  
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors?.border || '#ddd'};
    border-radius: 4px;
    min-height: 60px;
    background-color: ${props => props.theme.colors?.cardBackground || 'white'};
    color: ${props => props.theme.colors?.text || '#000'};
    
    &::placeholder {
      color: ${props => props.theme.colors?.textSecondary || '#999'};
    }
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CreatePlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: contextState, dispatch } = useWorkout();
  
  // Ensure exercises are loaded
  useEffect(() => {
    if (!contextState.exercises || contextState.exercises.length === 0) {
      // If there are no exercises, fetch default ones or reload
      console.log("No exercises found! Resetting to default state...");
      localStorage.removeItem('workoutState');
      window.location.reload();
    }
  }, [contextState.exercises]);
  
  const [plan, setPlan] = useState({
    name: '',
    description: '',
    days: []
  });
  
  const [currentDay, setCurrentDay] = useState({
    name: '',
    exercises: [],
    advancedMethods: []
  });
  
  const [showDayForm, setShowDayForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  const [exerciseParams, setExerciseParams] = useState({
    sets: '',
    reps: '',
    weight: '',
    repsInReserve: '',
    rest: '',
    notes: ''
  });
  
  // Effect to handle clicking outside the exercise dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('exerciseDropdown');
      const options = document.getElementById('exerciseOptions');
      
      if (dropdown && options && !dropdown.contains(event.target)) {
        options.style.display = 'none';
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (location.state && location.state.template) {
      const template = location.state.template;
      
      let planName = '';
      let planDescription = '';
      
      if (template.goal === 'strength') {
        planName = 'Kraftaufbau-Plan';
        planDescription = 'Trainingsplan für Kraftaufbau basierend auf meinem Fitnesslevel und meinen Präferenzen.';
      } else if (template.goal === 'muscle') {
        planName = 'Muskelaufbau-Plan';
        planDescription = 'Trainingsplan für optimalen Muskelaufbau basierend auf meinem Fitnesslevel und meinen Präferenzen.';
      } else if (template.goal === 'weightloss') {
        planName = 'Fettabbau-Plan';
        planDescription = 'Trainingsplan für Gewichtsreduktion und Fettabbau basierend auf meinem Fitnesslevel und meinen Präferenzen.';
      } else if (template.goal === 'endurance') {
        planName = 'Ausdauer-Plan';
        planDescription = 'Trainingsplan für Ausdauerverbesserung basierend auf meinem Fitnesslevel und meinen Präferenzen.';
      } else {
        planName = 'Allgemeiner Fitnessplan';
        planDescription = 'Allgemeiner Trainingsplan basierend auf meinem Fitnesslevel und meinen Präferenzen.';
      }
      
      setPlan({
        name: planName,
        description: planDescription,
        difficulty: template.fitnessLevel === 'beginner' ? 'Anfänger' :
                   template.fitnessLevel === 'intermediate' ? 'Mittel' : 'Fortgeschritten',
        type: template.goal === 'strength' ? 'Kraftaufbau' :
              template.goal === 'muscle' ? 'Muskelaufbau' :
              template.goal === 'weightloss' ? 'Gewichtsreduktion' :
              template.goal === 'endurance' ? 'Ausdauer' : 'Allgemeine Fitness',
        days: []
      });
      
      const targetDays = template.trainingDays === '1-2' ? 2 :
                        template.trainingDays === '3' ? 3 : 5;
      
      if (targetDays <= 2) {
        const days = [
          {
            id: uuidv4(),
            name: 'Oberkörper',
            exercises: [],
            advancedMethods: [],
            notes: ''
          },
          {
            id: uuidv4(),
            name: 'Unterkörper',
            exercises: [],
            advancedMethods: [],
            notes: ''
          }
        ];
        setPlan(prev => ({ ...prev, days }));
      } else if (targetDays === 3) {
        const days = [
          {
            id: uuidv4(),
            name: 'Brust & Trizeps',
            exercises: [],
            advancedMethods: [],
            notes: ''
          },
          {
            id: uuidv4(),
            name: 'Rücken & Bizeps',
            exercises: [],
            advancedMethods: [],
            notes: ''
          },
          {
            id: uuidv4(),
            name: 'Beine & Schultern',
            exercises: [],
            advancedMethods: [],
            notes: ''
          }
        ];
        setPlan(prev => ({ ...prev, days }));
      } else {
        const days = [
          {
            id: uuidv4(),
            name: 'Brust',
            exercises: [],
            advancedMethods: [],
            notes: ''
          },
          {
            id: uuidv4(),
            name: 'Rücken',
            exercises: [],
            advancedMethods: [],
            notes: ''
          },
          {
            id: uuidv4(),
            name: 'Beine',
            exercises: [],
            advancedMethods: [],
            notes: ''
          },
          {
            id: uuidv4(),
            name: 'Schultern',
            exercises: [],
            advancedMethods: [],
            notes: ''
          },
          {
            id: uuidv4(),
            name: 'Arme & Core',
            exercises: [],
            advancedMethods: [],
            notes: ''
          }
        ];
        setPlan(prev => ({ ...prev, days }));
      }
    }
  }, [location.state]);
  
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
      advancedMethods: [],
      notes: ''
    };
    
    // Add the new day at the end of the array (bottom)
    setPlan({
      ...plan,
      days: [...plan.days, newDay]
    });
    
    setCurrentDay({
      name: '',
      exercises: [],
      advancedMethods: []
    });
    
    setShowDayForm(false);
  };
  
  const handleDeleteDay = (dayId) => {    setPlan({      ...plan,      days: plan.days.filter(day => day.id !== dayId)    });  };  const moveDayUp = (dayIndex) => {    if (dayIndex > 0) {      const newDays = [...plan.days];      [newDays[dayIndex - 1], newDays[dayIndex]] = [newDays[dayIndex], newDays[dayIndex - 1]];      setPlan({        ...plan,        days: newDays      });    }  };  const moveDayDown = (dayIndex) => {    if (dayIndex < plan.days.length - 1) {      const newDays = [...plan.days];      [newDays[dayIndex], newDays[dayIndex + 1]] = [newDays[dayIndex + 1], newDays[dayIndex]];      setPlan({        ...plan,        days: newDays      });    }  };
  
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
    
    const selectedExercise = contextState.exercises.find(ex => ex.id === selectedExerciseId);
    
    if (!selectedExercise) return;
    
    const newExercise = {
      id: uuidv4(),
      exerciseId: selectedExerciseId,
      name: selectedExercise.name,
      muscleGroups: selectedExercise.muscleGroups || [],
      übungstyp: selectedExercise.übungstyp || '',
      equipment: selectedExercise.equipment || [],
      beschreibung: selectedExercise.beschreibung || '',
      gewichtete_muskelbeteiligung_pro_satz: selectedExercise.gewichtete_muskelbeteiligung_pro_satz || {},
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
  
  const handleAddAdvancedMethod = (dayId) => {
    setPlan({
      ...plan,
      days: plan.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            advancedMethods: [
              ...day.advancedMethods,
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
            advancedMethods: day.advancedMethods.map(method => {
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
            advancedMethods: day.advancedMethods.filter(method => method.id !== methodId)
          };
        }
        return day;
      })
    });
  };
  
  const handleSavePlan = () => {
    if (!plan.name.trim()) {
      alert('Bitte gib einen Namen für den Trainingsplan ein.');
      return;
    }
    
    if (plan.days.length === 0) {
      alert('Bitte füge mindestens einen Trainingstag hinzu.');
      return;
    }
    
    // Ensure days array is valid
    if (!Array.isArray(plan.days)) {
      console.error('Days is not an array before saving:', plan.days);
      alert('Fehler: Trainingstage sind ungültig. Bitte versuche es erneut oder lade die Seite neu.');
      return;
    }
    
    // Log the plan structure before creating newPlan
    console.log('Plan state before creating newPlan for save:', JSON.parse(JSON.stringify(plan)));
    console.log('Days count:', plan.days.length);
    console.log('Days are array:', Array.isArray(plan.days));

    const newPlan = {
      id: uuidv4(),
      name: plan.name.trim(),
      description: plan.description.trim(),
      days: [...plan.days], // Ensure we create a new array
      createdAt: new Date().toISOString()
    };
    
    console.log('New plan to be dispatched:', JSON.parse(JSON.stringify(newPlan)));
    
    dispatch({
      type: 'ADD_WORKOUT_PLAN',
      payload: newPlan
    });
    
    navigate('/plans');
  };
  
  return (
    <div>
      <h1>Neuen Trainingsplan erstellen</h1>
      

      
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
                placeholder="z.B. Anfänger Ganzkörperplan"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={plan.description}
                onChange={handlePlanChange}
                placeholder="Beschreibe hier deinen Trainingsplan..."
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="planNotes">Notizen zum Plan</Label>
              <Textarea 
                id="planNotes" 
                name="notes" 
                value={plan.notes || ''}
                onChange={handlePlanChange}
                placeholder="Füge hier Notizen zu deinem Trainingsplan hinzu..."
              />
            </FormGroup>
          </Card.Body>
        </Card>
        
        <DaysContainer>
          <h2>Trainingstage</h2>
          
          {!showDayForm ? (
            <></>
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
          
                    {plan.days.length > 0 ? (            plan.days.map((day, dayIndex) => (              <DayCard key={day.id} data-day-card>                <Card.Header>                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>                    <span>{day.name}</span>                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>                      <button                        type="button"                        onClick={() => moveDayUp(dayIndex)}                        disabled={dayIndex === 0}                        style={{                          background: 'none',                          border: 'none',                          color: dayIndex === 0 ? '#dee2e6' : '#6c757d',                          cursor: dayIndex === 0 ? 'not-allowed' : 'pointer',                          fontSize: '1.2rem',                          padding: '0.25rem',                          borderRadius: '4px',                          display: 'flex',                          alignItems: 'center',                          justifyContent: 'center'                        }}                        title="Nach oben verschieben"                      >                        ↑                      </button>                      <button                        type="button"                        onClick={() => moveDayDown(dayIndex)}                        disabled={dayIndex === plan.days.length - 1}                        style={{                          background: 'none',                          border: 'none',                          color: dayIndex === plan.days.length - 1 ? '#dee2e6' : '#6c757d',                          cursor: dayIndex === plan.days.length - 1 ? 'not-allowed' : 'pointer',                          fontSize: '1.2rem',                          padding: '0.25rem',                          borderRadius: '4px',                          display: 'flex',                          alignItems: 'center',                          justifyContent: 'center'                        }}                        title="Nach unten verschieben"                      >                        ↓                      </button>                      <RemoveButton onClick={() => handleDeleteDay(day.id)}>                        ✕                      </RemoveButton>                    </div>                  </div>                </Card.Header>
                <Card.Body>
                  <FormGroup>
                    <Label htmlFor={`dayNotes-${day.id}`}>Notizen zum Trainingstag</Label>
                    <Textarea 
                      id={`dayNotes-${day.id}`}
                      value={day.notes || ''}
                      onChange={(e) => {
                        setPlan({
                          ...plan,
                          days: plan.days.map(d => 
                            d.id === day.id ? { ...d, notes: e.target.value } : d
                          )
                        });
                      }}
                      placeholder="Füge hier Notizen zu diesem Trainingstag hinzu..."
                    />
                  </FormGroup>
                  
                  <h3>Übungen</h3>
                  
                  {day.exercises.length === 0 && day.advancedMethods.length === 0 && (
                    <p>Noch keine Übungen hinzugefügt</p>
                  )}
                  
                  <ExerciseList>
                    {day.exercises.map(exercise => (
                      <ExerciseItem key={exercise.id}>
                        <ExerciseHeader>
                          <div>
                            <ExerciseName>{exercise.name}</ExerciseName>
                            {exercise.übungstyp && (
                              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>
                                {exercise.übungstyp} 
                                {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                                  <> • {exercise.muscleGroups.join(', ')}</>
                                )}
                              </div>
                            )}
                          </div>
                          <RemoveButton onClick={() => handleRemoveExercise(day.id, exercise.id)}>
                            &times;
                          </RemoveButton>
                        </ExerciseHeader>
                        <div>
                          <strong>Sätze:</strong> {exercise.sets}
                          {exercise.reps && <> | <strong>Wiederholungen:</strong> {exercise.reps}</>}
                          {exercise.weight && <> | <strong>Gewicht:</strong> {exercise.weight} kg</>}
                          {exercise.repsInReserve !== null && exercise.repsInReserve !== undefined && <> | <strong>RIR:</strong> {exercise.repsInReserve}</>}
                          {exercise.rest && <> | <strong>Pause:</strong> {exercise.rest} s</>}
                        </div>
                        {exercise.equipment && exercise.equipment.length > 0 && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                            <strong>Equipment:</strong> {exercise.equipment.join(', ')}
                          </div>
                        )}
                        {exercise.notes && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <strong>Notizen:</strong> {exercise.notes}
                          </div>
                        )}
                        {exercise.beschreibung && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                            <strong>Beschreibung:</strong> {exercise.beschreibung}
                          </div>
                        )}
                      </ExerciseItem>
                    ))}
                    
                    {day.advancedMethods && day.advancedMethods.map(method => (
                      <Card key={method.id} style={{ marginBottom: '1rem', border: '1px solid #007bff' }}>
                        <Card.Header style={{ backgroundColor: '#f0f7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0 }}>Erweiterte Trainingsmethode: {method.method}</h4>
                          <RemoveButton onClick={() => handleRemoveAdvancedMethod(day.id, method.id)}>
                            &times;
                          </RemoveButton>
                        </Card.Header>
                        <Card.Body>
                          <AdvancedTrainingMethod 
                            value={method} 
                            onChange={(data) => handleUpdateAdvancedMethod(day.id, method.id, data)}
                            exercises={contextState.exercises} 
                          />
                        </Card.Body>
                      </Card>
                    ))}
                    
                    <Button 
                      onClick={() => {
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
                        setShowExerciseForm(day.id);
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
                            <option value="Brust">Brust</option>
                            <option value="Rücken">Rücken</option>
                            <option value="Schultern">Schultern</option>
                            <option value="Bizeps">Bizeps</option>
                            <option value="Trizeps">Trizeps</option>
                            <option value="Beine">Beine</option>
                            <option value="Bauch_Rumpf">Bauch & Rumpf</option>
                          </Select>
                        </ExerciseSelector>

                        <ExerciseSelector>
                          <Label htmlFor="exercise">Übung auswählen</Label>
                          <SearchableSelect id="exerciseDropdown">
                            <CustomSelect
                              onClick={() => {
                                const options = document.getElementById('exerciseOptions');
                                if (options) {
                                  options.style.display = options.style.display === 'block' ? 'none' : 'block';
                                  // Focus the search input when opening
                                  if (options.style.display === 'block') {
                                    setTimeout(() => {
                                      const searchInput = options.querySelector('input');
                                      if (searchInput) searchInput.focus();
                                    }, 100);
                                  }
                                }
                              }}
                            >
                              {selectedExerciseId 
                                ? contextState.exercises.find(ex => ex.id === selectedExerciseId)?.name || 'Übung wählen... (Mit Suchfunktion)'
                                : 'Übung wählen... (Mit Suchfunktion)'
                              }
                            </CustomSelect>
                            <SelectOptions id="exerciseOptions" style={{display: 'none'}}>
                              <SearchInput 
                                placeholder="Nach Name, Equipment oder Beschreibung suchen..." 
                                value={exerciseSearchTerm}
                                onChange={(e) => setExerciseSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                              <div style={{ padding: '5px', color: '#666', fontSize: '0.8rem' }}>
                                {contextState.exercises ? (
                                  (() => {
                                    const filteredCount = contextState.exercises.filter(exercise => {
                                      const matchesMuscleGroup = !selectedMuscleGroup || 
                                        (exercise.muscleGroups && 
                                         Array.isArray(exercise.muscleGroups) && 
                                         exercise.muscleGroups.includes(selectedMuscleGroup));
                                      
                                      const matchesSearchTerm = !exerciseSearchTerm || 
                                        (exercise.name && 
                                         exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())) ||
                                        (exercise.beschreibung && 
                                         exercise.beschreibung.toLowerCase().includes(exerciseSearchTerm.toLowerCase())) ||
                                        (exercise.equipment && Array.isArray(exercise.equipment) &&
                                         exercise.equipment.some(eq => eq.toLowerCase().includes(exerciseSearchTerm.toLowerCase())));
                                      
                                      return matchesMuscleGroup && matchesSearchTerm;
                                    }).length;
                                    
                                    return (
                                      <>
                                        Gefundene Übungen: {filteredCount} / {contextState.exercises.length}
                                        {selectedMuscleGroup && (
                                          <span style={{ marginLeft: '10px', fontSize: '0.75rem' }}>
                                            (Filter: {selectedMuscleGroup})
                                          </span>
                                        )}
                                      </>
                                    );
                                  })()
                                ) : '0'}
                              </div>
                              {contextState.exercises && contextState.exercises.length > 0 ? (
                                (() => {
                                  const filteredExercises = contextState.exercises.filter(exercise => {
                                    // Check if muscle group is selected and exercise has that muscle group
                                    const matchesMuscleGroup = !selectedMuscleGroup || 
                                      (exercise.muscleGroups && 
                                       Array.isArray(exercise.muscleGroups) && 
                                       exercise.muscleGroups.includes(selectedMuscleGroup));
                                    
                                    // Check if search term matches exercise name, description, or equipment
                                    const matchesSearchTerm = !exerciseSearchTerm || 
                                      (exercise.name && 
                                       exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())) ||
                                      (exercise.beschreibung && 
                                       exercise.beschreibung.toLowerCase().includes(exerciseSearchTerm.toLowerCase())) ||
                                      (exercise.equipment && Array.isArray(exercise.equipment) &&
                                       exercise.equipment.some(eq => eq.toLowerCase().includes(exerciseSearchTerm.toLowerCase())));
                                    
                                    // Enhanced debugging
                                    if (selectedMuscleGroup && exerciseSearchTerm === '' && !matchesMuscleGroup) {
                                      console.log(`❌ Exercise "${exercise.name}" - muscleGroups: [${exercise.muscleGroups?.join(', ')}], looking for: "${selectedMuscleGroup}"`);
                                    }
                                    
                                    return matchesMuscleGroup && matchesSearchTerm;
                                  });
                                  
                                  // Additional debug for first few results
                                  if (selectedMuscleGroup && exerciseSearchTerm === '') {
                                    console.log(`🔍 Filter results for "${selectedMuscleGroup}": ${filteredExercises.length} exercises found`);
                                    if (filteredExercises.length > 0) {
                                      console.log('✅ First 3 matching exercises:', filteredExercises.slice(0, 3).map(ex => ex.name));
                                    }
                                  }
                                  
                                  return filteredExercises;
                                })()
                                  .map(exercise => (
                                    <OptionItem 
                                      key={exercise.id}
                                      className={selectedExerciseId === exercise.id ? 'selected' : ''}
                                      onClick={() => {
                                        setSelectedExerciseId(exercise.id);
                                        document.getElementById('exerciseOptions').style.display = 'none';
                                      }}
                                    >
                                      <div>
                                        <div style={{ fontWeight: '500' }}>{exercise.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                                          {exercise.übungstyp && <span>{exercise.übungstyp}</span>}
                                          {exercise.übungstyp && exercise.muscleGroups && Array.isArray(exercise.muscleGroups) && exercise.muscleGroups.length > 0 && <span> • </span>}
                                          {exercise.muscleGroups && Array.isArray(exercise.muscleGroups) && exercise.muscleGroups.length > 0 && (
                                            <span>{exercise.muscleGroups.join(', ')}</span>
                                          )}
                                          {exercise.equipment && exercise.equipment.length > 0 && (
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                              Equipment: {exercise.equipment.join(', ')}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </OptionItem>
                                  ))
                              ) : (
                                <OptionItem>Keine Übungen gefunden</OptionItem>
                              )}
                            </SelectOptions>
                          </SearchableSelect>

                          {/* Show error message if no exercises are loaded */}
                          {(!contextState.exercises || contextState.exercises.length === 0) && (
                            <div style={{ marginTop: '10px' }}>
                              <p style={{ color: 'red', fontSize: '0.9rem' }}>
                                Keine Übungen gefunden! Bitte verwende den "Übungsdatenbank zurücksetzen" Button oben rechts.
                              </p>
                            </div>
                          )}
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
                          <label htmlFor="notes">Notizen</label>
                          <textarea
                            id="notes"
                            name="notes"
                            value={exerciseParams.notes}
                            onChange={handleExerciseParamChange}
                            placeholder="Notizen zu dieser Übung..."
                          />
                        </NotesInput>
                        
                        <ButtonGroup>
                          <Button onClick={() => handleAddExercise(day.id)}>
                            Hinzufügen
                          </Button>
                          <Button 
                            variant="secondary" 
                            onClick={() => setShowExerciseForm(false)}
                          >
                            Abbrechen
                          </Button>
                        </ButtonGroup>
                      </ExerciseForm>
                    )}
                  </ExerciseList>
                </Card.Body>
              </DayCard>
            ))
          ) : (
            <p>Noch keine Trainingstage hinzugefügt.</p>
          )}
        </DaysContainer>
        
        <ActionButtons>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/plans')}
          >
            Abbrechen
          </Button>
          <Button 
            variant="secondary"
            onClick={() => setShowDayForm(true)}
          >
            + Neuer Trainingstag hinzufügen
          </Button>
          <Button 
            onClick={handleSavePlan}
          >
            Trainingsplan speichern
          </Button>
        </ActionButtons>
      </FormContainer>
    </div>
  );
};

export default CreatePlan; 