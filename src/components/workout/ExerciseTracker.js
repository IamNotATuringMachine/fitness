import React, { useState, useEffect, useRef } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { format, parseISO } from 'date-fns';
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
      }
    }
  }, [state.workoutPlans]);

  useEffect(() => {
    setError('');
    if (selectedPlanId && selectedDayId) {
      const selectedPlan = state.workoutPlans.find(plan => plan.id === selectedPlanId);
      if (selectedPlan) {
        const day = selectedPlan.days.find(d => d.id === selectedDayId);
        if (day && day.exercises && day.exercises.length > 0) {
          const newTrackedExercises = day.exercises.map(exerciseInPlan => {
            // Find the last workout for this specific exercise
            let lastPerformedExerciseData = null;
            if (state.workoutHistory && state.workoutHistory.length > 0) {
              const historyForExercise = state.workoutHistory
                .flatMap(wh => wh.exercises || [])
                .filter(exHist => exHist.exerciseId === exerciseInPlan.id || exHist.name === exerciseInPlan.name)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Sort by timestamp desc

              if (historyForExercise.length > 0) {
                 // Find the most recent complete workout entry for this exercise
                for (const histEntry of state.workoutHistory.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())) {
                    const foundEx = histEntry.exercises?.find(ex => ex.exerciseId === exerciseInPlan.id || ex.name === exerciseInPlan.name);
                    if (foundEx && foundEx.performedSets && foundEx.performedSets.length > 0) {
                        lastPerformedExerciseData = foundEx;
                        break;
                    }
                }
              }
            }

            let initialSets = [];
            const numPlanSets = exerciseInPlan.sets ? (typeof exerciseInPlan.sets === 'number' ? exerciseInPlan.sets : exerciseInPlan.sets.length) : 1;

            // Get base planned data from the exercise level, in case set-specific data isn't available for all sets in the plan
            const basePlanReps = exerciseInPlan.reps !== undefined ? exerciseInPlan.reps : '';
            const basePlanWeight = exerciseInPlan.weight !== undefined ? exerciseInPlan.weight : '';
            const basePlanRir = exerciseInPlan.rir !== undefined ? exerciseInPlan.rir : '';
            const basePlanRestTime = exerciseInPlan.pause !== undefined ? exerciseInPlan.pause : (exerciseInPlan.restTime !== undefined ? exerciseInPlan.restTime : '');

            for (let i = 0; i < numPlanSets; i++) {
              const setId = uuidv4();
              let currentPlannedReps = basePlanReps;
              let currentPlannedWeight = basePlanWeight;
              let currentPlannedRir = basePlanRir;
              let currentPlannedRestTime = basePlanRestTime;

              // If plan has an array of sets, use specific values for this set if available
              if (exerciseInPlan.sets && Array.isArray(exerciseInPlan.sets) && exerciseInPlan.sets[i]) {
                const specificSetPlan = exerciseInPlan.sets[i];
                currentPlannedReps = specificSetPlan.reps !== undefined ? specificSetPlan.reps : basePlanReps;
                currentPlannedWeight = specificSetPlan.weight !== undefined ? specificSetPlan.weight : basePlanWeight;
                currentPlannedRir = specificSetPlan.rir !== undefined ? specificSetPlan.rir : basePlanRir;
                currentPlannedRestTime = specificSetPlan.pause !== undefined ? specificSetPlan.pause : (specificSetPlan.restTime !== undefined ? specificSetPlan.restTime : basePlanRestTime);
              }

              let prefillReps = '';
              let prefillWeight = '';
              let prefillRir = '';
              let prefillRestTime = '';

              // If data from the last workout exists for this specific set number, use that.
              if (lastPerformedExerciseData && lastPerformedExerciseData.performedSets && lastPerformedExerciseData.performedSets[i]) {
                const lastSet = lastPerformedExerciseData.performedSets[i];
                prefillReps = lastSet.actualReps !== undefined ? lastSet.actualReps : '';
                prefillWeight = lastSet.actualWeight !== undefined ? lastSet.actualWeight : '';
                prefillRir = lastSet.rir !== undefined ? lastSet.rir : ''; // From last workout
                prefillRestTime = lastSet.restTime !== undefined ? lastSet.restTime : ''; // From last workout
              } else { 
                // No last workout data for this set: Pre-fill from the current training plan.
                // currentPlannedReps, currentPlannedWeight, currentPlannedRir, currentPlannedRestTime
                // have been derived from exerciseInPlan (exercise-level or set-specific level).
                prefillReps = currentPlannedReps;
                prefillWeight = currentPlannedWeight;
                prefillRir = currentPlannedRir; // From plan (exerciseInPlan.rir or exerciseInPlan.sets[i].rir)
                prefillRestTime = currentPlannedRestTime; // From plan (exerciseInPlan.pause/restTime or exerciseInPlan.sets[i].pause/restTime)
              }
              
              initialSets.push({
                id: setId,
                setNumber: i + 1,
                plannedReps: currentPlannedReps,
                plannedWeight: currentPlannedWeight,
                plannedRir: currentPlannedRir, 
                plannedRestTime: currentPlannedRestTime,
                reps: prefillReps,
                weight: prefillWeight,
                rir: prefillRir,
                restTime: prefillRestTime,
                notes: '',
                isCompleted: prefillReps !== '' && prefillWeight !== '' // Auto-complete if prefilled from history
              });
            }
            
            // If plan has no sets defined but exercise has reps/weight, create one set
            if (numPlanSets === 1 && initialSets.length === 0 && (exerciseInPlan.reps !== undefined || exerciseInPlan.weight !== undefined)) {
                 let prefillReps = exerciseInPlan.reps !== undefined ? exerciseInPlan.reps : '';
                 let prefillWeight = exerciseInPlan.weight !== undefined ? exerciseInPlan.weight : '';
                 let prefillRir = exerciseInPlan.rir !== undefined ? exerciseInPlan.rir : '';
                 let prefillRestTime = exerciseInPlan.pause !== undefined ? exerciseInPlan.pause : (exerciseInPlan.restTime !== undefined ? exerciseInPlan.restTime : '');

                if (lastPerformedExerciseData && lastPerformedExerciseData.performedSets && lastPerformedExerciseData.performedSets[0]) {
                    const lastSet = lastPerformedExerciseData.performedSets[0];
                    prefillReps = lastSet.actualReps !== undefined ? lastSet.actualReps : prefillReps;
                    prefillWeight = lastSet.actualWeight !== undefined ? lastSet.actualWeight : prefillWeight;
                    prefillRir = lastSet.rir !== undefined ? lastSet.rir : prefillRir;
                    prefillRestTime = lastSet.restTime !== undefined ? lastSet.restTime : prefillRestTime;
                }

                initialSets.push({
                    id: uuidv4(),
                    setNumber: 1,
                    plannedReps: exerciseInPlan.reps !== undefined ? exerciseInPlan.reps : '',
                    plannedWeight: exerciseInPlan.weight !== undefined ? exerciseInPlan.weight : '',
                    plannedRir: exerciseInPlan.rir !== undefined ? exerciseInPlan.rir : '',
                    plannedRestTime: exerciseInPlan.pause !== undefined ? exerciseInPlan.pause : (exerciseInPlan.restTime !== undefined ? exerciseInPlan.restTime : ''),
                    reps: prefillReps,
                    weight: prefillWeight,
                    rir: prefillRir,
                    restTime: prefillRestTime,
                    notes: '',
                    isCompleted: prefillReps !== '' && prefillWeight !== ''
                });
            }
            
            // Default empty set if nothing else
            if (initialSets.length === 0) {
                 initialSets = [{
                    id: uuidv4(), setNumber: 1, plannedReps: '', plannedWeight: '', plannedRir: '', plannedRestTime: '',
                    reps: '', weight: '', rir: '', restTime: '', notes: '', isCompleted: false
                }];
            }

            return {
              id: exerciseInPlan.id, // Use original exercise ID from plan
              name: exerciseInPlan.name,
              sets: initialSets,
              exerciseNotes: '',
              isCompleted: initialSets.every(s => s.isCompleted)
            };
          });
          setTrackedExercises(newTrackedExercises);
        } else {
          setTrackedExercises([]);
        }
      } else {
        setTrackedExercises([]);
      }
    } else {
      setTrackedExercises([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanId, selectedDayId, state.workoutPlans, state.workoutHistory]); // Added workoutHistory

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handlePlanChange = (e) => {
    const planId = e.target.value;
    setSelectedPlanId(planId);
    
    // Auto-select first day of the new plan
    if (planId && state.workoutPlans) {
      const plan = state.workoutPlans.find(p => p.id === planId);
      if (plan && plan.days && plan.days.length > 0) {
        setSelectedDayId(plan.days[0].id);
      } else {
        setSelectedDayId('');
      }
    } else {
      setSelectedDayId('');
    }
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

    let prefillReps = '';
    let prefillWeight = '';
    let prefillRir = '';
    let prefillRestTime = '';
    
    let plannedRepsForNewSet = currentExercise.sets[0]?.plannedReps || ''; // Default to first set's plan
    let plannedWeightForNewSet = currentExercise.sets[0]?.plannedWeight || '';
    let plannedRirForNewSet = currentExercise.sets[0]?.plannedRir || '';
    let plannedRestTimeForNewSet = currentExercise.sets[0]?.plannedRestTime || '';


    // Try to find this exercise in the selected plan to get planned values for the new set number
    const selectedPlan = state.workoutPlans.find(plan => plan.id === selectedPlanId);
    const dayInPlan = selectedPlan?.days.find(d => d.id === selectedDayId);
    const exerciseInPlan = dayInPlan?.exercises.find(ex => ex.id === currentExercise.id || ex.name === currentExercise.name);

    if (exerciseInPlan && exerciseInPlan.sets && Array.isArray(exerciseInPlan.sets) && exerciseInPlan.sets[newSetNumber -1]) {
        const planSet = exerciseInPlan.sets[newSetNumber - 1];
        plannedRepsForNewSet = planSet.reps !== undefined ? planSet.reps : plannedRepsForNewSet;
        plannedWeightForNewSet = planSet.weight !== undefined ? planSet.weight : plannedWeightForNewSet;
        plannedRirForNewSet = planSet.rir !== undefined ? planSet.rir : plannedRirForNewSet;
        plannedRestTimeForNewSet = planSet.pause !== undefined ? planSet.pause : (planSet.restTime !== undefined ? planSet.restTime : plannedRestTimeForNewSet);
    }


    // Check last workout for this exercise
    let lastPerformedExerciseData = null;
    if (state.workoutHistory && state.workoutHistory.length > 0) {
        for (const histEntry of state.workoutHistory.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())) {
            const foundEx = histEntry.exercises?.find(ex => ex.exerciseId === currentExercise.id || ex.name === currentExercise.name);
            if (foundEx && foundEx.performedSets && foundEx.performedSets.length > 0) {
                lastPerformedExerciseData = foundEx;
                break;
            }
        }
    }

    if (lastPerformedExerciseData && lastPerformedExerciseData.performedSets && lastPerformedExerciseData.performedSets[newSetNumber - 1]) {
      // If data exists for this new set number in the last workout
      const lastSetData = lastPerformedExerciseData.performedSets[newSetNumber - 1];
      prefillReps = lastSetData.actualReps !== undefined ? lastSetData.actualReps : '';
      prefillWeight = lastSetData.actualWeight !== undefined ? lastSetData.actualWeight : '';
      prefillRir = lastSetData.rir !== undefined ? lastSetData.rir : '';
      prefillRestTime = lastSetData.restTime !== undefined ? lastSetData.restTime : '';
    } else if (currentExercise.sets.length > 0) {
      // Fallback: pre-fill with the data from the *previous set in the current form*
      const prevSetInForm = currentExercise.sets[currentExercise.sets.length - 1];
      prefillReps = prevSetInForm.reps !== undefined ? prevSetInForm.reps : ''; 
      prefillWeight = prevSetInForm.weight !== undefined ? prevSetInForm.weight : '';
      prefillRir = prevSetInForm.rir !== undefined ? prevSetInForm.rir : '';
      prefillRestTime = prevSetInForm.restTime !== undefined ? prevSetInForm.restTime : '';
    } else {
      // Absolute fallback: use planned values for the new set (already set in plannedXForNewSet)
      prefillReps = plannedRepsForNewSet !== undefined ? plannedRepsForNewSet : '';
      prefillWeight = plannedWeightForNewSet !== undefined ? plannedWeightForNewSet : '';
      prefillRir = plannedRirForNewSet !== undefined ? plannedRirForNewSet : '';
      prefillRestTime = plannedRestTimeForNewSet !== undefined ? plannedRestTimeForNewSet : '';
    }


    currentExercise.sets.push({
      id: uuidv4(),
      setNumber: newSetNumber,
      plannedReps: plannedRepsForNewSet,
      plannedWeight: plannedWeightForNewSet,
      plannedRir: plannedRirForNewSet,
      plannedRestTime: plannedRestTimeForNewSet,
      reps: prefillReps, 
      weight: prefillWeight,
      rir: prefillRir,
      restTime: prefillRestTime,
      notes: '',
      isCompleted: prefillReps !== '' && prefillWeight !== ''
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

    const selectedPlan = state.workoutPlans.find(p => p.id === selectedPlanId);
    const selectedDay = selectedPlan?.days.find(d => d.id === selectedDayId);

    const workoutRecord = {
      id: uuidv4(),
      date: workoutDate,
      planId: selectedPlanId,
      dayId: selectedDayId,
      name: `${selectedPlan?.name || 'Unbekannter Plan'} - ${selectedDay?.name || 'Unbekannter Tag'}`,
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

    // Save the workout
    dispatch({ type: 'TRACK_WORKOUT', payload: workoutRecord });
    
    // Cancel any existing timeouts
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    
    // Show success message
    setError('');
    setSuccess('Workout erfolgreich gespeichert!');
    
    // Clear success message after 3 seconds
    successTimeoutRef.current = setTimeout(() => {
      setSuccess('');
    }, 3000);

    // Reset the form
    setTrackedExercises(trackedExercises.map(ex => ({
      ...ex,
      sets: ex.sets.map(set => ({
        ...set,
        reps: '',
        weight: '',
        rir: '',
        restTime: '',
        notes: '',
        isCompleted: false
      })),
      exerciseNotes: '',
      isCompleted: false
    })));
  };

  const currentPlan = state.workoutPlans.find(plan => plan.id === selectedPlanId);
  const currentDay = currentPlan?.days.find(day => day.id === selectedDayId);

  return (
    <TrackerContainer>
      <Card>
        <Card.Header>
          <h2>Workout Tracker</h2>
        </Card.Header>
        <Card.Body>
          <p>Dokumentiere dein Training und verfolge deinen Fortschritt. Wähle einen Plan und Tag, um loszulegen.</p>
          
          {error && <ErrorText>{error}</ErrorText>}
          {success && <SuccessText>{success}</SuccessText>}
          
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
          
          {selectedPlanId && currentPlan && (
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
                                placeholder={set.plannedRir || "RIR"}
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
                                placeholder={set.plannedRestTime || "Pause"}
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
                          
                          <InputGroup style={{ marginTop: '0.5rem', width: '100%' }}>
                            <label>Notizen zu diesem Satz</label>
                            <Input
                              type="text"
                              placeholder="Notizen..."
                              value={set.notes}
                              onChange={(e) => handleSetNotesChange(exerciseIndex, setIndex, e.target.value)}
                            />
                          </InputGroup>
                        </SetDetails>
                      </SetRow>
                    ))}
                  </SetsContainer>
                  
                  <AddSetButton onClick={() => handleAddSet(exerciseIndex)}>
                    + Satz hinzufügen
                  </AddSetButton>
                  
                  <FormGroup style={{ marginTop: '1rem' }}>
                    <Label>Notizen zur Übung</Label>
                    <NotesTextarea
                      placeholder="Notizen zur gesamten Übung..."
                      value={exercise.exerciseNotes}
                      onChange={(e) => handleExerciseNotesChange(exerciseIndex, e.target.value)}
                    />
                  </FormGroup>
                </ExerciseItem>
              ))}
              
              <ButtonGroup>
                <Button onClick={handleSaveWorkout} style={{ marginTop: '2rem' }}>
                  Workout speichern
                </Button>
              </ButtonGroup>
            </ExerciseList>
          )}
          
          {selectedDayId && trackedExercises.length === 0 && (
            <p>Keine Übungen für den ausgewählten Tag gefunden.</p>
          )}
        </Card.Body>
      </Card>
    </TrackerContainer>
  );
};

export default ExerciseTracker;
