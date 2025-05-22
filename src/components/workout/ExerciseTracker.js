import React, { useState, useEffect, useRef } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  TrackerContainer,
  FormGroup,
  Label,
  Input,
  Select,
  ExerciseList,
  ExerciseItem,
  ExerciseHeader,
  ExerciseName,
  CompleteBadge,
  SetsContainer,
  SetRow,
  SetLabel,
  SetDetails,
  PlannedSetDetails,
  ActualSetInputs,
  InputGroup,
  RemoveButton,
  AddSetButton,
  ButtonGroup,
  ErrorText,
  SuccessText,
  NotesTextarea
} from './ExerciseTracker.styles';

const ExerciseTracker = () => {
  const { state, dispatch } = useWorkout();
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedDayId, setSelectedDayId] = useState('');
  const [workoutDate, setWorkoutDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [trackedExercises, setTrackedExercises] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const successTimeoutRef = useRef(null);

  useEffect(() => {
    // Pre-select first plan and day if available
    if (state.workoutPlans && state.workoutPlans.length > 0) {
      const firstPlan = state.workoutPlans[0];
      setSelectedPlanId(firstPlan.id);
      if (firstPlan.days && firstPlan.days.length > 0) {
        setSelectedDayId(firstPlan.days[0].id);
        // No need to load exercises here if the next useEffect handles it
      }
    }
  }, [state.workoutPlans]); // Only re-run if workoutPlans themselves change

  useEffect(() => {
    setError('');
    setSuccess('');
    if (selectedPlanId && selectedDayId) {
      const plan = state.workoutPlans.find(p => p.id === selectedPlanId);
      if (plan) {
        const day = plan.days.find(d => d.id === selectedDayId);
        if (day && day.exercises) {
          console.log("Loading exercises for day:", day.name, day.exercises);
          // Add detailed logging to see exercise structure
          day.exercises.forEach((exercise, i) => {
            console.log(`Exercise ${i+1} "${exercise.name}":`, exercise);
            if (exercise.sets && Array.isArray(exercise.sets)) {
              console.log(`- Sets for "${exercise.name}":`, exercise.sets);
            } else {
              console.log(`- No sets array found for "${exercise.name}", structure:`, exercise);
            }
          });
          const newTrackedExercises = day.exercises.map(exercise => {
            // Handle different data structures for exercises
            let initialSets = [];
            
            // Case 1: Exercise has a sets array with reps and weight per set
            if (exercise.sets && Array.isArray(exercise.sets) && exercise.sets.length > 0) {
              initialSets = exercise.sets.map(plannedSet => ({
                id: uuidv4(),
                setNumber: plannedSet.setNumber || initialSets.length + 1,
                plannedReps: plannedSet.reps !== undefined ? plannedSet.reps : '',
                plannedWeight: plannedSet.weight !== undefined ? plannedSet.weight : '',
                reps: plannedSet.reps !== undefined ? plannedSet.reps : '', // Prefill with planned
                weight: plannedSet.weight !== undefined ? plannedSet.weight : '', // Prefill with planned
                rir: '',
                restTime: '',
                notes: '',
                isCompleted: false
              }));
            } 
            // Case 2: Exercise has direct reps and weight properties
            else if (exercise.reps !== undefined || exercise.weight !== undefined) {
              const numberOfSets = typeof exercise.sets === 'number' ? exercise.sets : 1;
              
              for (let i = 0; i < numberOfSets; i++) {
                initialSets.push({
                  id: uuidv4(),
                  setNumber: i + 1,
                  plannedReps: exercise.reps !== undefined ? exercise.reps : '',
                  plannedWeight: exercise.weight !== undefined ? exercise.weight : '',
                  reps: exercise.reps !== undefined ? exercise.reps : '', // Prefill with planned
                  weight: exercise.weight !== undefined ? exercise.weight : '', // Prefill with planned
                  rir: '',
                  restTime: '',
                  notes: '',
                  isCompleted: false
                });
              }
            } 
            // Case 3: No reps/weight info, create a default empty set
            else {
              initialSets = [{
                id: uuidv4(),
                setNumber: 1,
                plannedReps: '',
                plannedWeight: '',
                reps: '',
                weight: '',
                rir: '',
                restTime: '',
                notes: '',
                isCompleted: false
              }];
            }
            
            return {
              id: exercise.id,
              name: exercise.name,
              sets: initialSets,
              exerciseNotes: '',
              isCompleted: false
            };
          });
          setTrackedExercises(newTrackedExercises);
        } else {
          setTrackedExercises([]);
          console.log("No exercises found for selected day or day/exercises structure is invalid.");
        }
      } else {
        setTrackedExercises([]);
        console.log("Selected plan not found.");
      }
    } else {
      setTrackedExercises([]);
      // console.log("Plan or Day not selected.");
    }
  }, [selectedPlanId, selectedDayId, state.workoutPlans]); // Rerun when selection changes

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handlePlanChange = (e) => {
    setSelectedPlanId(e.target.value);
    // selectedDayId will be updated by the useEffect above
  };

  const handleDayChange = (e) => {
    setSelectedDayId(e.target.value);
  };

  const handleDateChange = (e) => {
    setWorkoutDate(e.target.value);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...trackedExercises];
    const targetSet = updatedExercises[exerciseIndex].sets[setIndex];
    targetSet[field] = value;

    if (field === 'reps' || field === 'weight') {
      targetSet.isCompleted = targetSet.reps !== '' && targetSet.weight !== '';
    }

    const allSetsCompleted = updatedExercises[exerciseIndex].sets.every(set => set.isCompleted);
    updatedExercises[exerciseIndex].isCompleted = allSetsCompleted;
    setTrackedExercises(updatedExercises);
  };

  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...trackedExercises];
    const currentExercise = updatedExercises[exerciseIndex];
    const newSetNumber = currentExercise.sets.length + 1;

    // For new sets, use the planned values from the first set as a template
    // This makes adding multiple sets of the same exercise easier
    const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
    const plannedReps = lastSet?.plannedReps || '';
    const plannedWeight = lastSet?.plannedWeight || '';

    currentExercise.sets.push({
      id: uuidv4(),
      setNumber: newSetNumber,
      plannedReps: plannedReps,
      plannedWeight: plannedWeight,
      reps: '', // Start with empty actual values for the new set
      weight: '',
      rir: '',
      restTime: '',
      notes: '',
      isCompleted: false
    });
    currentExercise.isCompleted = false; // Exercise is no longer fully completed
    setTrackedExercises(updatedExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...trackedExercises];
    const currentExerciseSets = updatedExercises[exerciseIndex].sets;
    if (currentExerciseSets.length <= 1) return; // Keep at least one set

    currentExerciseSets.splice(setIndex, 1);
    currentExerciseSets.forEach((set, idx) => { set.setNumber = idx + 1; });

    const allSetsCompleted = currentExerciseSets.every(set => set.isCompleted);
    updatedExercises[exerciseIndex].isCompleted = allSetsCompleted;
    setTrackedExercises(updatedExercises);
  };

  const handleExerciseNotesChange = (exerciseIndex, notes) => {
    const updatedExercises = [...trackedExercises];
    updatedExercises[exerciseIndex].exerciseNotes = notes;
    setTrackedExercises(updatedExercises);
  };

  const handleSetNotesChange = (exerciseIndex, setIndex, notes) => {
    const updatedExercises = [...trackedExercises];
    updatedExercises[exerciseIndex].sets[setIndex].notes = notes;
    setTrackedExercises(updatedExercises);
  };

  const handleSaveWorkout = () => {
    if (!selectedPlanId || !selectedDayId) {
      setError('Bitte wähle einen Trainingsplan und einen Trainingstag aus.');
      return;
    }
    const performedExercises = trackedExercises.filter(ex => ex.sets.some(set => set.reps || set.weight));
    if (performedExercises.length === 0) {
      setError('Bitte trage Daten für mindestens einen Satz ein, bevor du speicherst.');
      return;
    }

    const workoutRecord = {
      id: uuidv4(),
      date: workoutDate,
      planId: selectedPlanId,
      dayId: selectedDayId,
      name: state.workoutPlans.find(p => p.id === selectedPlanId)?.name + " - " + state.workoutPlans.find(p => p.id === selectedPlanId)?.days.find(d => d.id === selectedDayId)?.name,
      exercises: performedExercises.map(ex => ({
        exerciseId: ex.id, // Original exercise ID from plan
        name: ex.name,
        performedSets: ex.sets.map(set => ({
          setNumber: set.setNumber,
          plannedReps: set.plannedReps,
          plannedWeight: set.plannedWeight,
          actualReps: set.reps,
          actualWeight: set.weight,
          rir: set.rir,
          restTime: set.restTime,
          completed: set.isCompleted,
          notes: set.notes
        })),
        exerciseNotes: ex.exerciseNotes,
        isCompleted: ex.isCompleted
      })),
      timestamp: new Date().getTime()
    };

    // First, save the workout
    dispatch({ type: 'TRACK_WORKOUT', payload: workoutRecord });
    
    // Cancel any existing timeouts
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    
    // Then show success message
    setError('');
    setSuccess('Workout gespeichert');
    
    // Make success message disappear after 3 seconds
    successTimeoutRef.current = setTimeout(() => {
      setSuccess('');
      
      // Only after the message has disappeared, reset the form
      const currentPlanId = selectedPlanId;
      const currentDayId = selectedDayId;
      
      setSelectedPlanId('');
      setSelectedDayId('');
      
      setTimeout(() => {
        setSelectedPlanId(currentPlanId);
        setSelectedDayId(currentDayId);
      }, 100);
      
    }, 3000);
  };
  
  const currentPlan = state.workoutPlans.find(p => p.id === selectedPlanId);
  const currentDay = currentPlan?.days.find(d => d.id === selectedDayId);

  return (
    <TrackerContainer>
      <Card.Header>
        <h2>Workout Tracker</h2>
      </Card.Header>
      <Card.Body>
        <p>Dokumentiere dein Training und verfolge deinen Fortschritt. Wähle einen Plan und Tag, um loszulegen.</p>
        
        {/* Debug information */}
        <div style={{ background: '#f5f5f5', padding: '10px', marginBottom: '10px', border: '1px solid #ddd' }}>
          <h4>Debug Info</h4>
          <p>Plans available: {state.workoutPlans?.length || 0}</p>
          <p>Selected plan: {selectedPlanId || 'None'}</p>
          <p>Selected day: {selectedDayId || 'None'}</p>
          <p>Tracked exercises: {trackedExercises?.length || 0}</p>
          {currentPlan && (
            <div>
              <p>Current plan name: {currentPlan.name}</p>
              <p>Days in plan: {currentPlan.days?.length || 0}</p>
              {currentDay && (
                <p>Current day exercises: {currentDay.exercises?.length || 0}</p>
              )}
            </div>
          )}
        </div>
        
        {error && <ErrorText>{error}</ErrorText>}
        
        <FormGroup>
          <Label htmlFor="workoutDate">Trainingsdatum</Label>
          <Input type="date" id="workoutDate" value={workoutDate} onChange={handleDateChange} />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="workoutPlan">Trainingsplan</Label>
          <Select id="workoutPlan" value={selectedPlanId} onChange={handlePlanChange}>
            <option value="">Trainingsplan auswählen</option>
            {state.workoutPlans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name}</option>
            ))}
          </Select>
        </FormGroup>
        
        {currentPlan && (
          <FormGroup>
            <Label htmlFor="workoutDay">Trainingstag</Label>
            <Select id="workoutDay" value={selectedDayId} onChange={handleDayChange} disabled={!currentPlan.days || currentPlan.days.length === 0}>
              <option value="">Trainingstag auswählen</option>
              {currentPlan.days?.map(day => (
                <option key={day.id} value={day.id}>{day.name}</option>
              ))}
            </Select>
          </FormGroup>
        )}
        
        {selectedDayId && trackedExercises.length > 0 && (
          <ExerciseList>
            <h3>Übungen für: {currentDay?.name || 'ausgewählten Tag'}</h3>
            {trackedExercises.map((exercise, exerciseIndex) => (
              <ExerciseItem key={exercise.id}>
                <ExerciseHeader>
                  <ExerciseName>
                    {exercise.name}
                    {exercise.isCompleted && <CompleteBadge>Abgeschlossen</CompleteBadge>}
                  </ExerciseName>
                </ExerciseHeader>
                <SetsContainer>
                  {exercise.sets.map((set, setIndex) => (
                    <SetRow key={set.id}>
                      <SetLabel>Satz {set.setNumber}</SetLabel>
                      <SetDetails>
                        <PlannedSetDetails>
                          Geplant: {set.plannedReps || '-'} Wdh × {set.plannedWeight || '-'}kg
                        </PlannedSetDetails>
                        <ActualSetInputs>
                          <InputGroup>
                            <label>Wdh</label>
                            <Input
                              type="number"
                              placeholder={set.plannedReps || "Wdh"}
                              aria-label={`Actual reps for ${exercise.name} set ${set.setNumber}`}
                              value={set.reps}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                            />
                          </InputGroup>
                          <span>×</span>
                          <InputGroup>
                            <label>Gewicht</label>
                            <Input
                              type="number"
                              placeholder={set.plannedWeight || "kg"}
                              aria-label={`Actual weight for ${exercise.name} set ${set.setNumber}`}
                              step="0.25"
                              value={set.weight}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                            />
                          </InputGroup>
                          <InputGroup>
                            <label>RIR</label>
                            <Input
                              type="number"
                              placeholder="RIR"
                              aria-label={`RIR for ${exercise.name} set ${set.setNumber}`}
                              value={set.rir}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'rir', e.target.value)}
                              min="0"
                              max="10"
                            />
                          </InputGroup>
                          <InputGroup>
                            <label>Pause (s)</label>
                            <Input
                              type="number"
                              placeholder="Pause"
                              aria-label={`Rest time for ${exercise.name} set ${set.setNumber}`}
                              value={set.restTime}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'restTime', e.target.value)}
                              min="0"
                            />
                          </InputGroup>
                          <RemoveButton 
                            onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                            title="Diesen Satz entfernen"
                            disabled={exercise.sets.length <= 1}
                            aria-label={`Remove set ${set.setNumber} from ${exercise.name}`}
                          >
                            🗑️
                          </RemoveButton>
                        </ActualSetInputs>
                        <NotesTextarea
                          placeholder="Notizen für diesen Satz..."
                          aria-label={`Notes for ${exercise.name} set ${set.setNumber}`}
                          value={set.notes}
                          onChange={(e) => handleSetNotesChange(exerciseIndex, setIndex, e.target.value)}
                          rows={2}
                        />
                      </SetDetails>
                    </SetRow>
                  ))}
                  <AddSetButton 
                    size="small" 
                    variant="secondaryOutline"
                    onClick={() => handleAddSet(exerciseIndex)}
                  >
                    + Satz zu "{exercise.name}" hinzufügen
                  </AddSetButton>
                </SetsContainer>
                <FormGroup style={{marginTop: '1rem'}}>
                  <Label htmlFor={`exerciseNotes-${exercise.id}`}>Allgemeine Notizen zur Übung "{exercise.name}":</Label>
                  <NotesTextarea
                    id={`exerciseNotes-${exercise.id}`}
                    placeholder="z.B. Gefühl, Fokus, nächste Steigerung..."
                    value={exercise.exerciseNotes}
                    onChange={(e) => handleExerciseNotesChange(exerciseIndex, e.target.value)}
                    rows={3}
                  />
                </FormGroup>
              </ExerciseItem>
            ))}
          </ExerciseList>
        )}
        {selectedDayId && trackedExercises.length === 0 && <p>Keine Übungen für diesen Tag im Plan gefunden oder Plan/Tag wird geladen.</p>}

        {trackedExercises.length > 0 && (
            <ButtonGroup>
                <Button onClick={handleSaveWorkout} variant="primary" size="large">
                  Workout Speichern
                </Button>
            </ButtonGroup>
        )}
      </Card.Body>
      
      {/* Single success message popup */}
      {success && <SuccessText>{success}</SuccessText>}
    </TrackerContainer>
  );
};

export default ExerciseTracker;
