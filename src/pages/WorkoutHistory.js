import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import { format } from 'date-fns';
import Button from '../components/ui/Button';

// Subtle animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Main container with clean background
const Container = styled.div`
  padding: ${props => props.theme.spacing.xl};
  background: #fafbfc;
  min-height: 100vh;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

// Clean header with minimal styling
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
  padding-bottom: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid #e1e4e8;
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
    text-align: center;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #24292e;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

// Stats cards with clean design
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const StatCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e4e8;
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.color || '#24292e'};
  margin-bottom: ${props => props.theme.spacing.xs};
  letter-spacing: -0.02em;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #586069;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Search and filter section
const ControlsSection = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #959da5;
  pointer-events: none;
  
  &::before {
    content: '🔍';
    font-size: 16px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0366d6;
    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
  }
  
  &::placeholder {
    color: #959da5;
  }
`;

const FilterDropdown = styled.select`
  padding: 12px 16px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  font-weight: 500;
  color: #24292e;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #0366d6;
    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
  }
`;

// Selection controls (removed unused styled components)

// Workout cards with clean design
const WorkoutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const WorkoutCard = styled.div`
  background: white;
  border: 1px solid ${props => props.selected ? '#0366d6' : '#e1e4e8'};
  border-radius: 12px;
  box-shadow: ${props => props.selected 
    ? '0 0 0 3px rgba(3, 102, 214, 0.1)' 
    : '0 1px 3px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${props => props.index * 0.05}s;
  animation-fill-mode: both;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const WorkoutHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid #e1e4e8;
  gap: ${props => props.theme.spacing.md};
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
`;

const WorkoutInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const WorkoutName = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #24292e;
`;

const WorkoutDate = styled.span`
  font-size: 0.875rem;
  color: #586069;
  font-weight: 500;
`;

const WorkoutBody = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #24292e;
  margin-bottom: 4px;
`;

const StatText = styled.div`
  font-size: 0.75rem;
  color: #586069;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ExerciseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ExerciseTag = styled.span`
  padding: 6px 12px;
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #24292e;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e1e4e8;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid #f6f8fa;
`;



// Empty state
const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl} 0;
  animation: ${fadeIn} 0.5s ease-out;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  opacity: 0.3;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #24292e;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const EmptyText = styled.p`
  color: #586069;
  font-size: 1rem;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

// Modal for delete confirmation
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: ${props => props.theme.spacing.xl};
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #24292e;
`;

const ModalText = styled.p`
  color: #586069;
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
`;

// Floating action bar
const FloatingBar = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  z-index: 100;
  animation: ${slideIn} 0.3s ease-out;
`;

const SelectionInfo = styled.span`
  font-weight: 600;
  color: #24292e;
`;

// Additional styled components
const Message = styled.div`
  text-align: center;
  background: white;
  border: 1px solid #e1e4e8;
  padding: ${props => props.theme.spacing.xxl};
  border-radius: 12px;
  margin: ${props => props.theme.spacing.xl} 0;
  animation: ${fadeIn} 0.5s ease-out;
  
  p {
    color: #586069;
    font-size: 1rem;
    margin: 0;
  }
`;

const StatsOverview = styled(StatsGrid)``;
const OverviewCard = styled(StatCard)``;
const OverviewValue = styled(StatValue)``;
const OverviewLabel = styled(StatLabel)``;

const SearchAndFilterContainer = styled(ControlsSection)``;
const SortSelect = styled(FilterDropdown)``;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  background: white;
  border: 1px solid #e1e4e8;
  padding: ${props => props.theme.spacing.lg};
  border-radius: 8px;
  animation: ${fadeIn} 0.7s ease-out;
  
  label {
    color: #24292e;
    font-weight: 500;
  }
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0366d6;
`;

const BulkActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const WorkoutStats = styled(StatsRow)``;
const StatBox = styled(StatItem)`
  background: #f6f8fa;
  padding: ${props => props.theme.spacing.md};
  border-radius: 8px;
  border: 1px solid #e1e4e8;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e1e4e8;
  }
`;

const ExerciseList = styled(ExerciseTags)``;

const ActionButtons = styled(ActionRow)`
  border-top: none;
  padding-top: 0;
`;

const ConfirmationModal = styled(Modal)``;
const ModalButtons = styled(ModalActions)``;

const WorkoutHistory = () => {
  const { state, dispatch } = useWorkout();
  const workoutHistory = state.workoutHistory || [];
  const [selectedWorkouts, setSelectedWorkouts] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

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

  const calculateOverallStats = () => {
    if (!workoutHistory || workoutHistory.length === 0) {
      return { totalWorkouts: 0, totalVolume: 0, totalSets: 0, totalExercises: 0 };
    }

    let totalVolume = 0;
    let totalSets = 0;
    let totalExercises = 0;

    workoutHistory.forEach(workout => {
      const stats = calculateWorkoutStats(workout);
      totalVolume += stats.totalWeight;
      totalSets += stats.totalSets;
      totalExercises += workout.exercises?.length || 0;
    });

    return {
      totalWorkouts: workoutHistory.length,
      totalVolume: Math.round(totalVolume),
      totalSets,
      totalExercises
    };
  };

  // Filter and sort workouts
  const filteredAndSortedWorkouts = [...workoutHistory]
    .filter(workout => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (workout.name || '').toLowerCase().includes(searchLower) ||
        workout.exercises?.some(exercise => 
          exercise.name.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'exercises':
          return (b.exercises?.length || 0) - (a.exercises?.length || 0);
        case 'volume':
          const aStats = calculateWorkoutStats(a);
          const bStats = calculateWorkoutStats(b);
          return bStats.totalWeight - aStats.totalWeight;
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

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
    if (selectedWorkouts.size === filteredAndSortedWorkouts.length) {
      setSelectedWorkouts(new Set());
    } else {
      setSelectedWorkouts(new Set(filteredAndSortedWorkouts.map(w => w.id)));
    }
  };

  const handleBulkDelete = () => {
    selectedWorkouts.forEach(workoutId => {
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
    });
    setSelectedWorkouts(new Set());
    setShowDeleteModal(false);
  };

  const clearSelection = () => {
    setSelectedWorkouts(new Set());
  };

  // Handle scroll event for sticky buttons removed (not needed)

  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Workout Historie</Title>
          <Button as={Link} to="/workout-tracker" variant="primary">
            Neues Workout starten
          </Button>
        </Header>
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <EmptyTitle>Keine Workouts vorhanden</EmptyTitle>
          <EmptyText>
            Starte dein erstes Workout, um deine Fortschritte zu verfolgen.
          </EmptyText>
          <Button as={Link} to="/workout-tracker" variant="primary" size="large">
            Erstes Workout starten
          </Button>
        </EmptyState>
      </Container>
    );
  }

  const overallStats = calculateOverallStats();

  const isAllSelected = selectedWorkouts.size === filteredAndSortedWorkouts.length;
  const isPartiallySelected = selectedWorkouts.size > 0 && selectedWorkouts.size < filteredAndSortedWorkouts.length;

  return (
    <Container>
      <Header>
        <Title>Workout Historie</Title>
        <Button as={Link} to="/workout-tracker" variant="primary">
          Neues Workout starten
        </Button>
      </Header>

      <StatsOverview>
        <OverviewCard delay="0.1s">
          <OverviewValue color="#0366d6">{overallStats.totalWorkouts}</OverviewValue>
          <OverviewLabel>Workouts absolviert</OverviewLabel>
        </OverviewCard>
        <OverviewCard delay="0.2s">
          <OverviewValue color="#28a745">{overallStats.totalVolume.toLocaleString()}</OverviewValue>
          <OverviewLabel>kg Gesamtvolumen</OverviewLabel>
        </OverviewCard>
        <OverviewCard delay="0.3s">
          <OverviewValue color="#6f42c1">{overallStats.totalSets}</OverviewValue>
          <OverviewLabel>Sätze trainiert</OverviewLabel>
        </OverviewCard>
        <OverviewCard delay="0.4s">
          <OverviewValue color="#fd7e14">{overallStats.totalExercises}</OverviewValue>
          <OverviewLabel>Übungen durchgeführt</OverviewLabel>
        </OverviewCard>
      </StatsOverview>

      <SearchAndFilterContainer>
        <SearchBar>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Suche nach Workout-Namen oder Übungen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Nach Datum sortieren</option>
          <option value="name">Nach Name sortieren</option>
          <option value="exercises">Nach Anzahl Übungen</option>
          <option value="volume">Nach Volumen sortieren</option>
        </SortSelect>
      </SearchAndFilterContainer>

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
          {isAllSelected ? 'Alle abwählen' : 'Alle auswählen'} ({filteredAndSortedWorkouts.length} Workouts)
        </label>
      </SelectAllContainer>

      {selectedWorkouts.size > 0 && (
        <FloatingBar>
          <SelectionInfo>
            <strong>{selectedWorkouts.size} Workout{selectedWorkouts.size !== 1 ? 's' : ''} ausgewählt</strong>
          </SelectionInfo>
          <BulkActions>
            <Button variant="outline" size="small" onClick={clearSelection}>
              Auswahl aufheben
            </Button>
            <Button variant="danger" size="small" onClick={() => setShowDeleteModal(true)}>
              Ausgewählte löschen
            </Button>
          </BulkActions>
        </FloatingBar>
      )}

      {filteredAndSortedWorkouts.length === 0 && searchTerm && (
        <Message>
          <p>Keine Workouts gefunden für "{searchTerm}". Versuche einen anderen Suchbegriff.</p>
        </Message>
      )}

      <WorkoutList>
        {filteredAndSortedWorkouts.map((workout, index) => {
          const stats = calculateWorkoutStats(workout);
          const isSelected = selectedWorkouts.has(workout.id);
          
          return (
            <WorkoutCard key={workout.id} selected={isSelected} index={index}>
              <WorkoutHeader>
                <Checkbox
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleWorkoutSelect(workout.id)}
                />
                <WorkoutInfo>
                  <WorkoutName>{workout.name || 'Unbenanntes Workout'}</WorkoutName>
                  <WorkoutDate>{formatDate(workout.date)}</WorkoutDate>
                </WorkoutInfo>
              </WorkoutHeader>

              <WorkoutBody>
                <WorkoutStats>
                  <StatBox>
                    <StatNumber>{workout.exercises?.length || 0}</StatNumber>
                    <StatText>{workout.exercises?.length === 1 ? 'Übung' : 'Übungen'}</StatText>
                  </StatBox>
                  <StatBox>
                    <StatNumber>{stats.totalSets}</StatNumber>
                    <StatText>{stats.totalSets === 1 ? 'Satz' : 'Sätze'}</StatText>
                  </StatBox>
                  <StatBox>
                    <StatNumber>{stats.totalReps}</StatNumber>
                    <StatText>Wiederholungen</StatText>
                  </StatBox>
                  <StatBox>
                    <StatNumber>{Math.round(stats.totalWeight).toLocaleString()}</StatNumber>
                    <StatText>Gesamtgewicht (kg)</StatText>
                  </StatBox>
                </WorkoutStats>

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
              </WorkoutBody>
            </WorkoutCard>
          );
        })}
      </WorkoutList>

      {showDeleteModal && (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>Workouts löschen?</ModalTitle>
            <ModalText>
              Möchtest du wirklich {selectedWorkouts.size} Workout{selectedWorkouts.size !== 1 ? 's' : ''} löschen? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </ModalText>
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