import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const SectionCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ExerciseTitle = styled.h3`
  margin: 0;
`;

const SetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr; /* Adjust for smaller screens */
  }
`;

const SetInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};

  label {
    font-size: ${props => props.theme.typography.fontSizes.sm};
    color: ${props => props.theme.colors.textLight};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBg || props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  width: 100%;
  box-sizing: border-box;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const Textarea = styled.textarea`
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: inherit;
  background-color: ${props => props.theme.colors.inputBg || props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 100px;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const EditWorkoutPage = () => {
  const { id: workoutId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useWorkout();
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const workoutToEdit = state.workoutHistory?.find(w => w.id === workoutId);
    if (workoutToEdit) {
      setWorkoutName(workoutToEdit.name || 'Unbenanntes Workout');
      try {
        setWorkoutDate(format(new Date(workoutToEdit.date), 'yyyy-MM-dd'));
      } catch (e) {
        setWorkoutDate(format(new Date(), 'yyyy-MM-dd')); // Fallback to today
      }
      setExercises(JSON.parse(JSON.stringify(workoutToEdit.exercises || []))); // Deep copy
      setIsLoading(false);
    } else {
      setError('Workout nicht gefunden.');
      setIsLoading(false);
    }
  }, [workoutId, state.workoutHistory]);

  const handleExerciseChange = (exerciseIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex][field] = value;
    setExercises(updatedExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    // Ensure performedSets exists and is an array
    if (!updatedExercises[exerciseIndex].performedSets) {
      updatedExercises[exerciseIndex].performedSets = [];
    }
    // Ensure the specific set object exists
    while (updatedExercises[exerciseIndex].performedSets.length <= setIndex) {
        updatedExercises[exerciseIndex].performedSets.push({ 
            setNumber: updatedExercises[exerciseIndex].performedSets.length + 1, 
            plannedReps: '', actualReps: '', plannedWeight: '', actualWeight: '', rir: '', restTime: '', notes: ''
        });
    }
    updatedExercises[exerciseIndex].performedSets[setIndex][field] = value;
    setExercises(updatedExercises);
  };
  
  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    const currentExercise = updatedExercises[exerciseIndex];
    if (!currentExercise.performedSets) {
        currentExercise.performedSets = [];
    }
    const newSetNumber = currentExercise.performedSets.length + 1;
    currentExercise.performedSets.push({
        id: uuidv4(), // Add id for new sets
        setNumber: newSetNumber,
        plannedReps: '', actualReps: '', plannedWeight: '', actualWeight: '', rir: '', restTime: '', notes: ''
    });
    setExercises(updatedExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].performedSets.splice(setIndex, 1);
    // Re-number sets
    updatedExercises[exerciseIndex].performedSets = updatedExercises[exerciseIndex].performedSets.map((s, i) => ({ ...s, setNumber: i + 1 }));
    setExercises(updatedExercises);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedWorkout = {
      id: workoutId,
      name: workoutName,
      date: new Date(workoutDate).toISOString(),
      exercises: exercises.map(ex => ({
        ...ex,
        // Ensure performedSets is an array
        performedSets: Array.isArray(ex.performedSets) ? ex.performedSets.map(set => ({
            ...set,
            setNumber: parseInt(set.setNumber, 10) || 0,
            actualReps: set.actualReps !== '' ? parseInt(set.actualReps, 10) : null,
            actualWeight: set.actualWeight !== '' ? parseFloat(set.actualWeight) : null,
            rir: set.rir !== '' ? parseInt(set.rir, 10) : null,
            restTime: set.restTime !== '' ? parseInt(set.restTime, 10) : null,
        })) : [] // Default to empty array if not an array
      })),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_WORKOUT_HISTORY', payload: updatedWorkout });
    navigate(`/workout/${workoutId}`);
  };

  if (isLoading) {
    return <PageContainer><p>Lade Workout-Daten...</p></PageContainer>;
  }

  if (error) {
    return <PageContainer><p>{error}</p><Button as={Link} to="/">Zurück zum Dashboard</Button></PageContainer>;
  }

  return (
    <PageContainer>
      <Title>Workout bearbeiten</Title>
      <StyledForm onSubmit={handleSubmit}>
        <SectionCard>
          <Card.Header>Trainingstag bearbeiten</Card.Header>
          <Card.Body>
            <FormGroup>
              <Label>Name des Trainingstags</Label>
              <Input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="z.B. Push Tag, Oberkörper, Beine, etc."
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Datum</Label>
              <Input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                required
              />
            </FormGroup>
          </Card.Body>
        </SectionCard>

        {exercises.map((exercise, exerciseIndex) => (
          <SectionCard key={exercise.id || exercise.exerciseId || exerciseIndex}>
            <Card.Header>
              <ExerciseHeader>
                <ExerciseTitle>{exercise.name || 'Unbenannte Übung'}</ExerciseTitle>
              </ExerciseHeader>
            </Card.Header>
            <Card.Body>
              <FormGroup>
                <Label>Übungsname</Label>
                <Input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Notizen zur Übung</Label>
                <Textarea
                  value={exercise.exerciseNotes || ''}
                  onChange={(e) => handleExerciseChange(exerciseIndex, 'exerciseNotes', e.target.value)}
                  rows={2}
                />
              </FormGroup>
              
              <h4>Sätze</h4>
              {exercise.performedSets?.map((set, setIndex) => (
                <SetInputContainer key={set.id || setIndex} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                   <p><strong>Satz {set.setNumber}</strong></p>
                   <SetsGrid>
                    <SetInputContainer>
                      <label htmlFor={`reps-${exerciseIndex}-${setIndex}`}>Wdh.</label>
                      <Input
                        id={`reps-${exerciseIndex}-${setIndex}`}
                        type="number"
                        value={set.actualReps || ''}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'actualReps', e.target.value)}
                        placeholder="Wdh."
                      />
                    </SetInputContainer>
                    <SetInputContainer>
                      <label htmlFor={`weight-${exerciseIndex}-${setIndex}`}>Gewicht (kg)</label>
                      <Input
                        id={`weight-${exerciseIndex}-${setIndex}`}
                        type="number"
                        step="0.01"
                        value={set.actualWeight || ''}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'actualWeight', e.target.value)}
                        placeholder="kg"
                      />
                    </SetInputContainer>
                    <SetInputContainer>
                      <label htmlFor={`rir-${exerciseIndex}-${setIndex}`}>RIR</label>
                      <Input
                        id={`rir-${exerciseIndex}-${setIndex}`}
                        type="number"
                        value={set.rir || ''}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'rir', e.target.value)}
                        placeholder="RIR"
                      />
                    </SetInputContainer>
                    <SetInputContainer>
                      <label htmlFor={`rest-${exerciseIndex}-${setIndex}`}>Pause (s)</label>
                      <Input
                        id={`rest-${exerciseIndex}-${setIndex}`}
                        type="number"
                        value={set.restTime || ''}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'restTime', e.target.value)}
                        placeholder="Sekunden"
                      />
                    </SetInputContainer>
                  </SetsGrid>
                  <FormGroup>
                    <Label>Notizen zum Satz</Label>
                    <Textarea
                      value={set.notes || ''}
                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'notes', e.target.value)}
                      rows={1}
                      placeholder="Satznotizen"
                    />
                  </FormGroup>
                  <Button type="button" onClick={() => handleRemoveSet(exerciseIndex, setIndex)} variant="danger-outlined" size="small" style={{marginTop: '0.5rem'}}>
                    Satz entfernen
                  </Button>
                </SetInputContainer>
              ))}
              <Button type="button" onClick={() => handleAddSet(exerciseIndex)} variant="secondary-outlined" style={{marginTop: '1rem'}}>
                Satz hinzufügen
              </Button>
            </Card.Body>
          </SectionCard>
        ))}
        
        {/* Option to add a new exercise could be added here if needed */}

        <ActionButtons>
          <Button type="button" variant="secondary" onClick={() => navigate(`/workout/${workoutId}`)}>
            Abbrechen
          </Button>
          <Button type="submit" variant="primary">
            Änderungen speichern
          </Button>
        </ActionButtons>
      </StyledForm>
    </PageContainer>
  );
};

export default EditWorkoutPage;
