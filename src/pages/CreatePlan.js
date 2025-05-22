import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';
import AdvancedTrainingMethod from '../components/workout/AdvancedTrainingMethod';

// Fallback exercise options in case the context is empty
const initialExerciseOptions = [
  { value: 'ex1', label: 'Kniebeugen' },
  { value: 'ex2', label: 'Bankdrücken' },
  { value: 'ex3', label: 'Kreuzheben' },
  { value: 'ex4', label: 'Klimmzüge' },
  { value: 'ex5', label: 'Schulterdrücken' }
];

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
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  
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
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
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
  background-color: #f0f0f0;
  border-radius: 4px;
`;

const ExerciseSelector = styled.div`
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SearchableSelect = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelect = styled.div`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
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
    color: #555;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  font-size: 0.9rem;
`;

const SelectOptions = styled.div`
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: white;
  z-index: 10;
`;

const OptionItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &.selected {
    background-color: #e3f2fd;
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
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const NotesInput = styled.div`
  margin-top: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.25rem;
  }
  
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-height: 60px;
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
      name: currentDay.name,
      exercises: [],
      advancedMethods: []
    };
    
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
  
  const handleDeleteDay = (dayId) => {
    setPlan({
      ...plan,
      days: plan.days.filter(day => day.id !== dayId)
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
    
    const selectedExercise = contextState.exercises.find(ex => ex.id === selectedExerciseId);
    
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
      
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button 
          variant="secondary"
          onClick={() => {
            console.log('Exercises:', contextState.exercises);
            console.log('Exercise count:', contextState.exercises ? contextState.exercises.length : 0);
            if (contextState.exercises && contextState.exercises.length > 0) {
              alert(`${contextState.exercises.length} Übungen gefunden!`);
            } else {
              alert('Keine Übungen gefunden! Datenbank zurücksetzen...');
              localStorage.removeItem('workoutState');
              window.location.reload();
            }
          }}
          style={{ fontSize: '0.9rem' }}
        >
          Debug-Übungen
        </Button>
        <Button 
          variant="secondary"
          onClick={() => {
            if (window.confirm('Diese Aktion setzt die Übungsdatenbank zurück. Fortfahren?')) {
              localStorage.removeItem('workoutState');
              window.location.reload();
            }
          }}
          style={{ fontSize: '0.9rem' }}
        >
          Übungsdatenbank zurücksetzen
        </Button>
      </div>
      
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
            plan.days.map(day => (
              <DayCard key={day.id}>
                <Card.Header>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{day.name}</span>
                    <RemoveButton onClick={() => handleDeleteDay(day.id)}>
                      ✕
                    </RemoveButton>
                  </div>
                </Card.Header>
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
                          <ExerciseName>{exercise.name}</ExerciseName>
                          <RemoveButton onClick={() => handleRemoveExercise(day.id, exercise.id)}>
                            &times;
                          </RemoveButton>
                        </ExerciseHeader>
                        <div>
                          <strong>Sätze:</strong> {exercise.sets}
                          {exercise.reps && <> | <strong>Wiederholungen:</strong> {exercise.reps}</>}
                          {exercise.weight && <> | <strong>Gewicht:</strong> {exercise.weight} kg</>}
                          {exercise.repsInReserve && <> | <strong>RIR:</strong> {exercise.repsInReserve}</>}
                          {exercise.rest && <> | <strong>Pause:</strong> {exercise.rest} s</>}
                        </div>
                        {exercise.notes && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <strong>Notizen:</strong> {exercise.notes}
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
                          <SearchableSelect id="exerciseDropdown">
                            <CustomSelect
                              onClick={() => {
                                const options = document.getElementById('exerciseOptions');
                                if (options) {
                                  options.style.display = options.style.display === 'block' ? 'none' : 'block';
                                }
                              }}
                            >
                              {selectedExerciseId 
                                ? contextState.exercises.find(ex => ex.id === selectedExerciseId)?.name || 'Übung auswählen...'
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
                              <div style={{ padding: '5px', color: '#666', fontSize: '0.8rem' }}>
                                Gefundene Übungen: {contextState.exercises ? contextState.exercises.length : 0}
                              </div>
                              {contextState.exercises && contextState.exercises.length > 0 ? (
                                contextState.exercises
                                  .filter(exercise => {
                                    // Check if muscle group is selected and exercise has that muscle group
                                    const matchesMuscleGroup = !selectedMuscleGroup || 
                                      (exercise.muscleGroups && 
                                       Array.isArray(exercise.muscleGroups) && 
                                       exercise.muscleGroups.includes(selectedMuscleGroup));
                                    
                                    // Check if search term matches exercise name
                                    const matchesSearchTerm = !exerciseSearchTerm || 
                                      (exercise.name && 
                                       exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()));
                                    
                                    return matchesMuscleGroup && matchesSearchTerm;
                                  })
                                  .map(exercise => (
                                    <OptionItem 
                                      key={exercise.id}
                                      className={selectedExerciseId === exercise.id ? 'selected' : ''}
                                      onClick={() => {
                                        setSelectedExerciseId(exercise.id);
                                        document.getElementById('exerciseOptions').style.display = 'none';
                                      }}
                                    >
                                      {exercise.name} ({exercise.muscleGroups && Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.join(', ') : 'Keine Muskelgruppe'})
                                    </OptionItem>
                                  ))
                              ) : (
                                <OptionItem>Keine Übungen gefunden</OptionItem>
                              )}
                            </SelectOptions>
                          </SearchableSelect>

                          {/* Fallback standard select as a backup */}
                          {(!contextState.exercises || contextState.exercises.length === 0) && (
                            <div style={{ marginTop: '10px' }}>
                              <p style={{ color: 'red', fontSize: '0.9rem' }}>Keine Übungen gefunden! Bitte Datenbank zurücksetzen.</p>
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