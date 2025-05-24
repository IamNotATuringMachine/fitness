import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import { format } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Container = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  margin: 0;
`;

const SelectionBar = styled.div`  background-color: #f8fff9;  border: 2px solid #28a745;  border-radius: ${props => props.theme.borderRadius.medium};  padding: ${props => props.theme.spacing.md};  margin-bottom: ${props => props.theme.spacing.lg};  display: flex;  justify-content: space-between;  align-items: center;  transition: all 0.3s ease;    ${props => props.sticky && `    position: fixed;    bottom: 20px;    left: 50%;    transform: translateX(-50%);    z-index: 1000;    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);    max-width: 800px;    width: 90%;    margin-bottom: 0;  `}`;

const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CheckboxInput = styled.input`
  margin-right: ${props => props.theme.spacing.sm};
  transform: scale(1.2);
`;

const WorkoutCard = styled(Card)`  margin-bottom: ${props => props.theme.spacing.sm};  transition: transform 0.2s ease;  border: ${props => props.selected ? `2px solid #28a745` : '1px solid transparent'};  background-color: ${props => props.selected ? '#f8fff9' : 'white'};    &:hover {    transform: translateY(-1px);    box-shadow: ${props => props.theme.shadows.small};  }`;

const WorkoutCardContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: 4px;
`;

const WorkoutContent = styled.div`
  flex: 1;
`;

const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const WorkoutTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.primary};
`;

const WorkoutDate = styled.span`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const WorkoutStats = styled.div`  display: grid;  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));  gap: ${props => props.theme.spacing.sm};  margin: ${props => props.theme.spacing.sm} 0;`;

const StatBox = styled.div`  text-align: center;  padding: ${props => props.theme.spacing.sm};  background-color: #6c757d;  border-radius: ${props => props.theme.borderRadius.small};`;

const StatValue = styled.div`  font-size: ${props => props.theme.typography.fontSizes.lg};  font-weight: ${props => props.theme.typography.fontWeights.bold};  color: white;`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
`;

const ExerciseList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.sm};
`;

const ExerciseTag = styled.span`
  background-color: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const Message = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  font-style: italic;
  margin: ${props => props.theme.spacing.xl} 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const BulkActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  max-width: 500px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  color: ${props => props.theme.colors.danger};
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const WorkoutHistory = () => {  const { state, dispatch } = useWorkout();  const workoutHistory = state.workoutHistory || [];  const [selectedWorkouts, setSelectedWorkouts] = useState(new Set());  const [showDeleteModal, setShowDeleteModal] = useState(false);  const [isScrolling, setIsScrolling] = useState(false);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const calculateWorkoutStats = (workout) => {
    if (!workout.exercises || !Array.isArray(workout.exercises)) {
      return { totalSets: 0, totalReps: 0, totalWeight: 0 };
    }

    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;

    workout.exercises.forEach(exercise => {
      if (exercise.performedSets && Array.isArray(exercise.performedSets)) {
        totalSets += exercise.performedSets.length;
        
        exercise.performedSets.forEach(set => {
          const reps = parseInt(set.actualReps) || 0;
          const weight = parseFloat(set.actualWeight) || 0;
          
          totalReps += reps;
          totalWeight += reps * weight;
        });
      }
    });

    return { totalSets, totalReps, totalWeight };
  };

  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workoutHistory].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const handleWorkoutSelect = (workoutId) => {
    const newSelected = new Set(selectedWorkouts);
    if (newSelected.has(workoutId)) {
      newSelected.delete(workoutId);
    } else {
      newSelected.add(workoutId);
    }
    setSelectedWorkouts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedWorkouts.size === sortedWorkouts.length) {
      setSelectedWorkouts(new Set());
    } else {
      setSelectedWorkouts(new Set(sortedWorkouts.map(w => w.id)));
    }
  };

  const handleBulkDelete = () => {
    selectedWorkouts.forEach(workoutId => {
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
    });
    setSelectedWorkouts(new Set());
    setShowDeleteModal(false);
  };

    const clearSelection = () => {    setSelectedWorkouts(new Set());  };  // Handle scroll event for sticky buttons  useEffect(() => {    const handleScroll = () => {      const scrollY = window.scrollY;      setIsScrolling(scrollY > 200);    };    window.addEventListener('scroll', handleScroll);    return () => window.removeEventListener('scroll', handleScroll);  }, []);

  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Workout Historie</Title>
          <Button as={Link} to="/workout-tracker" variant="primary">
            Neues Workout starten
          </Button>
        </Header>
        <Message>
          Du hast noch keine Workouts aufgezeichnet. Starte dein erstes Workout!
        </Message>
      </Container>
    );
  }

  const isAllSelected = selectedWorkouts.size === sortedWorkouts.length;
  const isPartiallySelected = selectedWorkouts.size > 0 && selectedWorkouts.size < sortedWorkouts.length;

  return (
    <Container>
      <Header>
        <Title>Workout Historie</Title>
        <Button as={Link} to="/workout-tracker" variant="primary">
          Neues Workout starten
        </Button>
      </Header>

      <SelectAllContainer>
        <CheckboxInput
          type="checkbox"
          checked={isAllSelected}
          ref={input => {
            if (input) input.indeterminate = isPartiallySelected;
          }}
          onChange={handleSelectAll}
        />
        <label>
          {isAllSelected ? 'Alle abwählen' : 'Alle auswählen'} ({sortedWorkouts.length} Workouts)
        </label>
      </SelectAllContainer>

            {selectedWorkouts.size > 0 && (        <SelectionBar sticky={isScrolling}>          <SelectionInfo>            <strong>{selectedWorkouts.size} Workout{selectedWorkouts.size !== 1 ? 's' : ''} ausgewählt</strong>          </SelectionInfo>          <BulkActions>            <Button variant="outline" size="small" onClick={clearSelection}>              Auswahl aufheben            </Button>            <Button variant="danger" size="small" onClick={() => setShowDeleteModal(true)}>              Ausgewählte löschen            </Button>          </BulkActions>        </SelectionBar>      )}

      {sortedWorkouts.map(workout => {
        const stats = calculateWorkoutStats(workout);
        const isSelected = selectedWorkouts.has(workout.id);
        
        return (
          <WorkoutCard key={workout.id} selected={isSelected}>
            <Card.Body>
              <WorkoutCardContent>
                <CheckboxContainer>
                  <CheckboxInput
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleWorkoutSelect(workout.id)}
                  />
                </CheckboxContainer>
                
                <WorkoutContent>
                  <WorkoutHeader>
                    <WorkoutTitle>{workout.name || 'Unbenanntes Workout'}</WorkoutTitle>
                    <WorkoutDate>{formatDate(workout.date)}</WorkoutDate>
                  </WorkoutHeader>

                                    <WorkoutStats>                    <StatBox>                      <StatValue>{workout.exercises?.length || 0}</StatValue>                      <StatLabel>{(workout.exercises?.length || 0) === 1 ? 'Übung' : 'Übungen'}</StatLabel>                    </StatBox>                    <StatBox>                      <StatValue>{stats.totalSets}</StatValue>                      <StatLabel>{stats.totalSets === 1 ? 'Satz' : 'Sätze'}</StatLabel>                    </StatBox>                    <StatBox>                      <StatValue>{stats.totalReps}</StatValue>                      <StatLabel>Wiederholungen</StatLabel>                    </StatBox>                    <StatBox>                      <StatValue>{Math.round(stats.totalWeight)}</StatValue>                      <StatLabel>Gesamtgewicht (kg)</StatLabel>                    </StatBox>                  </WorkoutStats>

                  {workout.exercises && workout.exercises.length > 0 && (
                    <ExerciseList>
                      {workout.exercises.slice(0, 5).map(exercise => (
                        <ExerciseTag key={exercise.exerciseId || exercise.name}>
                          {exercise.name}
                        </ExerciseTag>
                      ))}
                      {workout.exercises.length > 5 && (
                        <ExerciseTag>+{workout.exercises.length - 5} weitere</ExerciseTag>
                      )}
                    </ExerciseList>
                  )}

                  <ActionButtons>
                    <Button 
                      as={Link} 
                      to={`/workout/${workout.id}`} 
                      variant="secondary"
                      size="small"
                    >
                      Details anzeigen
                    </Button>
                    <Button 
                      as={Link} 
                      to={`/edit-workout/${workout.id}`} 
                      variant="outline"
                      size="small"
                    >
                      Bearbeiten
                    </Button>
                  </ActionButtons>
                </WorkoutContent>
              </WorkoutCardContent>
            </Card.Body>
          </WorkoutCard>
        );
      })}

      {showDeleteModal && (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>Workouts löschen?</ModalTitle>
            <p>
              Möchtest du wirklich {selectedWorkouts.size} Workout{selectedWorkouts.size !== 1 ? 's' : ''} löschen? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <ModalButtons>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Abbrechen
              </Button>
              <Button variant="danger" onClick={handleBulkDelete}>
                Löschen
              </Button>
            </ModalButtons>
          </ModalContent>
        </ConfirmationModal>
      )}
    </Container>
  );
};

export default WorkoutHistory; 