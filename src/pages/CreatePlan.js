import React, { useState, useEffect } from 'react';import styled from 'styled-components';import { useNavigate, useLocation } from 'react-router-dom';import { v4 as uuidv4 } from 'uuid';import Card from '../components/ui/Card';import Button from '../components/ui/Button';import { useWorkout } from '../context/WorkoutContext';
import AdvancedTrainingMethod from '../components/workout/AdvancedTrainingMethod';
import NotesHistory from '../components/notes/NotesHistory';

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
  const [exerciseParams, setExerciseParams] = useState({
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    rest: '',
    notes: ''
  });
  
  // Use template data if provided via location state
  useEffect(() => {
    if (location.state && location.state.template) {
      const template = location.state.template;
      
      // Set up initial plan based on template data
      let planName = '';
      let planDescription = '';
      
      // Determine plan name and description based on goal
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
      
      // Create suitable days based on preferences
      const targetDays = template.trainingDays === '1-2' ? 2 :
                        template.trainingDays === '3' ? 3 : 5;
      
      if (targetDays <= 2) {
        // Create a suitable 2-day split (e.g., upper/lower body)
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
        // Create a suitable 3-day split
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
        // Create a suitable 5-day split
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
  
  // Handle plan basic info changes
  const handlePlanChange = (e) => {
    setPlan({
      ...plan,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle day name change
  const handleDayChange = (e) => {
    setCurrentDay({
      ...currentDay,
      name: e.target.value
    });
  };
  
  // Handle add day
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
  
  // Handle delete day
  const handleDeleteDay = (dayId) => {
    setPlan({
      ...plan,
      days: plan.days.filter(day => day.id !== dayId)
    });
  };
  
  // Handle exercise parameter changes
  const handleExerciseParamChange = (e) => {
    setExerciseParams({
      ...exerciseParams,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle add exercise to day
  const handleAddExercise = (dayId) => {
    if (!selectedExerciseId) {
      alert('Bitte wähle eine Übung aus.');
      return;
    }
    
    // Find the exercise from the global state
    const selectedExercise = contextState.exercises.find(ex => ex.id === selectedExerciseId);
    
    if (!selectedExercise) return;
    
    // Create a new exercise instance
    const newExercise = {
      id: uuidv4(),
      exerciseId: selectedExerciseId,
      name: selectedExercise.name,
      sets: exerciseParams.sets ? parseInt(exerciseParams.sets, 10) : null,
      reps: exerciseParams.reps ? parseInt(exerciseParams.reps, 10) : null,
      weight: exerciseParams.weight ? parseFloat(exerciseParams.weight) : null,
      duration: exerciseParams.duration || null,
      rest: exerciseParams.rest || null,
      notes: exerciseParams.notes || null
    };
    
    // Add exercise to the specified day
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
    
    // Reset form
    setSelectedExerciseId('');
    setExerciseParams({
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      rest: '',
      notes: ''
    });
    
    setShowExerciseForm(false);
  };
  
  // Handle remove exercise from day
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
  
  // New handler for adding advanced training method
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
  
  // New handler for updating advanced training method
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
  
  // New handler for removing advanced training method
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
  
  // Handle save plan
  const handleSavePlan = () => {
    if (!plan.name.trim()) {
      alert('Bitte gib einen Namen für den Trainingsplan ein.');
      return;
    }
    
    if (plan.days.length === 0) {
      alert('Bitte füge mindestens einen Trainingstag hinzu.');
      return;
    }
    
    const newPlan = {
      id: uuidv4(),
      name: plan.name.trim(),
      description: plan.description.trim(),
      days: plan.days,
      createdAt: new Date().toISOString()
    };
    
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
                          {exercise.duration && <> | <strong>Dauer:</strong> {exercise.duration} s</>}
                          {exercise.rest && <> | <strong>Pause:</strong> {exercise.rest} s</>}
                        </div>
                        {exercise.notes && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <strong>Notizen:</strong> {exercise.notes}
                          </div>
                        )}
                      </ExerciseItem>
                    ))}
                    
                    {/* Display advanced training methods */}
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
                        setExerciseParams({
                          sets: '',
                          reps: '',
                          weight: '',
                          duration: '',
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
                          <Label htmlFor="exercise">Übung auswählen</Label>
                          <Select 
                            id="exercise" 
                            value={selectedExerciseId}
                            onChange={(e) => setSelectedExerciseId(e.target.value)}
                            required
                          >
                            <option value="">Übung auswählen...</option>
                            {contextState.exercises.map(exercise => (
                              <option key={exercise.id} value={exercise.id}>
                                {exercise.name} ({exercise.muscleGroups.join(', ')})
                              </option>
                            ))}
                          </Select>
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
                            <label htmlFor="duration">Dauer</label>
                            <input 
                              type="text" 
                              id="duration" 
                              name="duration" 
                              value={exerciseParams.duration}
                              onChange={handleExerciseParamChange}
                              placeholder="z.B. 30 sec"
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