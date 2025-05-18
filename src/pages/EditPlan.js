import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';
import AdvancedTrainingMethod from '../components/workout/AdvancedTrainingMethod';
import NotesHistory from '../components/notes/NotesHistory';
import PeriodizationApplicator from '../components/workout/PeriodizationApplicator';

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

const NotFoundMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

const EditPlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch } = useWorkout();
  
  // Find the workout plan by ID
  const existingPlan = state.workoutPlans.find(plan => plan.id === id);
  
  const [plan, setPlan] = useState({
    name: '',
    description: '',
    days: []
  });
  
  const [currentDay, setCurrentDay] = useState({
    name: '',
    exercises: []
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
  
  // Load existing plan data
  useEffect(() => {
    if (existingPlan) {
      setPlan({
        id: existingPlan.id,
        name: existingPlan.name || '',
        description: existingPlan.description || '',
        days: existingPlan.days || [],
        createdAt: existingPlan.createdAt
      });
    }
  }, [existingPlan]);
  
  // Make sure days have advancedMethods field
  useEffect(() => {
    if (plan && plan.days) {
      const updatedDays = plan.days.map(day => {
        if (!day.advancedMethods) {
          return { ...day, advancedMethods: [] };
        }
        return day;
      });
      
      setPlan({ ...plan, days: updatedDays });
    }
  }, []);
  
  if (!existingPlan) {
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
    
    setPlan({
      ...plan,
      days: [
        ...plan.days,
        {
          id: uuidv4(),
          name: currentDay.name.trim(),
          exercises: []
        }
      ]
    });
    
    setCurrentDay({
      name: '',
      exercises: []
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
    const selectedExercise = state.exercises.find(ex => ex.id === selectedExerciseId);
    
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
    
    const updatedPlan = {
      ...plan,
      name: plan.name.trim(),
      description: plan.description.trim(),
      updatedAt: new Date().toISOString()
    };
    
    dispatch({
      type: 'UPDATE_WORKOUT_PLAN',
      payload: updatedPlan
    });
    
    navigate('/plans');
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
  
  // New handler for updating advanced training method
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
  
  // New handler for removing advanced training method
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
            
            {/* Add plan-level notes */}
            <FormGroup>
              <NotesHistory 
                entityType="plan"
                planId={plan.id}
                currentNote={plan.notes}
                onNoteSave={(newNote) => setPlan({...plan, notes: newNote})}
              />
            </FormGroup>
          </Card.Body>
        </Card>
        
        {/* Add PeriodizationApplicator after the main form card */}
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
                  {/* Add day-level notes */}
                  <NotesHistory 
                    entityType="day"
                    planId={plan.id}
                    dayId={day.id}
                    currentNote={day.notes}
                    onNoteSave={(newNote) => {
                      setPlan({
                        ...plan,
                        days: plan.days.map(d => d.id === day.id ? {...d, notes: newNote} : d)
                      });
                    }}
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
                          <strong>Sätze:</strong> {exercise.sets}
                          {exercise.reps && <> | <strong>Wiederholungen:</strong> {exercise.reps}</>}
                          {exercise.weight && <> | <strong>Gewicht:</strong> {exercise.weight} kg</>}
                          {exercise.duration && <> | <strong>Dauer:</strong> {exercise.duration} s</>}
                          {exercise.rest && <> | <strong>Pause:</strong> {exercise.rest} s</>}
                        </div>
                        
                        {/* Add exercise-level notes */}
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
                            exercises={state.exercises} 
                          />
                        </Card.Body>
                      </Card>
                    ))}
                  </ExerciseList>
                  
                  {!showExerciseForm || showExerciseForm !== day.id ? (
                    <Button onClick={() => {
                      setShowExerciseForm(day.id);
                      setSelectedExerciseId('');
                      setExerciseParams({
                        sets: '',
                        reps: '',
                        weight: '',
                        duration: '',
                        rest: '',
                        notes: ''
                      });
                    }}>
                      + Übung hinzufügen
                    </Button>
                  ) : (
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
                          {state.exercises.map(exercise => (
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
                          onClick={() => setShowExerciseForm(false)}
                        >
                          Abbrechen
                        </Button>
                      </ButtonGroup>
                    </ExerciseForm>
                  )}
                  
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
            Änderungen speichern
          </Button>
        </ActionButtons>
      </FormContainer>
    </div>
  );
};

export default EditPlan; 