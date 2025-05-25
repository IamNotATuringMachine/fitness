import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { format, subWeeks } from 'date-fns';
import { useWorkout } from '../context/WorkoutContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const WorkoutInfoCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const WorkoutMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textLight};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.xs};
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ExerciseCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ExerciseTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ExerciseNotes = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.grayLight};
  border-radius: ${props => props.theme.borderRadius.small};
  font-style: italic;
`;

const SetsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${props => props.theme.spacing.md};
  
  th, td {
    padding: ${props => props.theme.spacing.sm};
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  th {
    font-weight: 600;
    color: ${props => props.theme.colors.textLight};
  }
  
  @media (max-width: 768px) {
    display: block;
    
    thead, tbody, tr, th, td {
      display: block;
    }
    
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    
    tr {
      margin-bottom: ${props => props.theme.spacing.md};
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: ${props => props.theme.borderRadius.small};
    }
    
    td {
      border: none;
      position: relative;
      padding-left: 50%;
      border-bottom: 1px solid ${props => props.theme.colors.border};
    }
    
    td:before {
      position: absolute;
      left: ${props => props.theme.spacing.sm};
      width: 45%;
      white-space: nowrap;
      font-weight: 600;
    }
    
    td:nth-of-type(1):before { content: "Satz"; }
    td:nth-of-type(2):before { content: "Wdh."; }
    td:nth-of-type(3):before { content: "Gewicht"; }
    td:nth-of-type(4):before { content: "RIR"; }
    td:nth-of-type(5):before { content: "Pause"; }
    td:nth-of-type(6):before { content: "Notizen"; }
  }
`;

const CompletedBadge = styled.span`
  background-color: ${props => props.theme.colors.success};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.75rem;
  margin-left: ${props => props.theme.spacing.sm};
`;

const DeleteModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  .card-header {
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const MuscleGroupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const MuscleGroupItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
  
  .muscle-name {
    font-size: 0.875rem;
    opacity: 0.9;
    margin-bottom: 4px;
  }
  
  .muscle-sets {
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const ProgressCard = styled(Card)`
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  
  .card-header {
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const ProgressItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  .progress-label {
    font-size: 0.875rem;
    opacity: 0.9;
  }
  
  .progress-value {
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  .progress-positive {
    color: #90ee90;
  }
  
  .progress-negative {
    color: #ffcccb;
  }
  
  .progress-neutral {
    color: white;
  }
`;

const DetailStatsCard = styled(Card)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  
  .card-header {
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const DetailStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
  
  .stat-label {
    opacity: 0.9;
  }
  
  .stat-value {
    font-weight: 600;
  }
`;

const WorkoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useWorkout();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Find the workout in the state
  const workout = state.workoutHistory?.find(workout => workout.id === id);
  
  if (!workout) {
    return (
      <PageContainer>
        <Card>
          <Card.Body>
            <h2>Workout nicht gefunden</h2>
            <p>Das angeforderte Workout wurde nicht gefunden.</p>
            <Button as={Link} to="/">Zurück zum Dashboard</Button>
          </Card.Body>
        </Card>
      </PageContainer>
    );
  }
  
  const handleDeleteWorkout = () => {
    dispatch({ type: 'DELETE_WORKOUT', payload: id });
    // Add a small delay to allow state to propagate before navigation
    setTimeout(() => {
      navigate('/');
    }, 50); // 50ms delay
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      return 'Unbekanntes Datum';
    }
  };

  // Calculate muscle group statistics
  const calculateMuscleGroupSets = (workout) => {
    const muscleGroupSets = {};
    
    if (!workout.exercises) return muscleGroupSets;
    
    workout.exercises.forEach(exercise => {
      // Get muscle groups from exercise, fallback to state exercises if needed
      let muscleGroups = exercise.muscleGroups;
      
      if (!muscleGroups && state.exercises) {
        const stateExercise = state.exercises.find(ex => ex.name === exercise.name);
        muscleGroups = stateExercise?.muscleGroups || [];
      }
      
      if (!muscleGroups || !Array.isArray(muscleGroups)) {
        muscleGroups = ['Unbekannt'];
      }
      
      const setsCount = exercise.performedSets?.length || 0;
      
      muscleGroups.forEach(muscleGroup => {
        if (!muscleGroupSets[muscleGroup]) {
          muscleGroupSets[muscleGroup] = 0;
        }
        muscleGroupSets[muscleGroup] += setsCount;
      });
    });
    
    return muscleGroupSets;
  };

  // Calculate progressive overload compared to previous week
  const calculateProgressiveOverload = (currentWorkout) => {
    if (!state.workoutHistory || state.workoutHistory.length < 2) {
      return null;
    }
    
    const currentDate = new Date(currentWorkout.date);
    const oneWeekAgo = subWeeks(currentDate, 1);
    
    // Find workout from approximately one week ago
    const previousWorkout = state.workoutHistory
      .filter(w => w.id !== currentWorkout.id)
      .sort((a, b) => Math.abs(new Date(a.date) - oneWeekAgo) - Math.abs(new Date(b.date) - oneWeekAgo))[0];
    
    if (!previousWorkout) return null;
    
    // Calculate current workout stats
    const currentStats = calculateWorkoutVolume(currentWorkout);
    const previousStats = calculateWorkoutVolume(previousWorkout);
    
    const volumeChange = ((currentStats.totalVolume - previousStats.totalVolume) / previousStats.totalVolume) * 100;
    const setsChange = currentStats.totalSets - previousStats.totalSets;
    const repsChange = currentStats.totalReps - previousStats.totalReps;
    
    return {
      previousWorkout,
      volumeChange: isFinite(volumeChange) ? volumeChange : 0,
      setsChange,
      repsChange,
      currentStats,
      previousStats
    };
  };

  // Calculate workout volume and stats
  const calculateWorkoutVolume = (workout) => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    
    if (!workout.exercises) {
      return { totalVolume, totalSets, totalReps };
    }
    
    workout.exercises.forEach(exercise => {
      if (exercise.performedSets) {
        totalSets += exercise.performedSets.length;
        
        exercise.performedSets.forEach(set => {
          const reps = parseInt(set.actualReps) || 0;
          const weight = parseFloat(set.actualWeight) || 0;
          
          totalReps += reps;
          totalVolume += reps * weight;
        });
      }
    });
    
    return { totalVolume, totalSets, totalReps };
  };

  // Calculate detailed workout statistics
  const calculateDetailedStats = (workout) => {
    const stats = calculateWorkoutVolume(workout);
    const muscleGroups = calculateMuscleGroupSets(workout);
    const muscleGroupCount = Object.keys(muscleGroups).length;
    
    let avgRepsPerSet = 0;
    let avgWeightPerSet = 0;
    let avgRir = 0;
    let avgRestTime = 0;
    let totalValidSets = 0;
    
    if (workout.exercises) {
      workout.exercises.forEach(exercise => {
        if (exercise.performedSets) {
          exercise.performedSets.forEach(set => {
            if (set.actualReps && set.actualWeight) {
              totalValidSets++;
              avgRepsPerSet += parseInt(set.actualReps) || 0;
              avgWeightPerSet += parseFloat(set.actualWeight) || 0;
              avgRir += parseInt(set.rir) || 0;
              avgRestTime += parseInt(set.restTime) || 0;
            }
          });
        }
      });
    }
    
    if (totalValidSets > 0) {
      avgRepsPerSet = Math.round(avgRepsPerSet / totalValidSets);
      avgWeightPerSet = Math.round((avgWeightPerSet / totalValidSets) * 10) / 10;
      avgRir = Math.round((avgRir / totalValidSets) * 10) / 10;
      avgRestTime = Math.round(avgRestTime / totalValidSets);
    }
    
    return {
      ...stats,
      muscleGroupCount,
      avgRepsPerSet,
      avgWeightPerSet,
      avgRir,
      avgRestTime
    };
  };

  const muscleGroupSets = calculateMuscleGroupSets(workout);
  const progressiveOverload = calculateProgressiveOverload(workout);
  const detailedStats = calculateDetailedStats(workout);
  
  return (
    <PageContainer>
      <Title>{workout.name || 'Workout Details'}</Title>
      
      <WorkoutInfoCard>
        <Card.Header>Workout Information</Card.Header>
        <Card.Body>
          <WorkoutMeta>
            <MetaItem>
              <strong>Datum:</strong> {formatDate(workout.date)}
            </MetaItem>
            <MetaItem>
              <strong>Übungen:</strong> {workout.exercises?.length || 0}
            </MetaItem>
            <MetaItem>
              <strong>Sätze gesamt:</strong> {
                workout.exercises?.reduce((total, ex) => total + (ex.performedSets?.length || 0), 0) || 0
              }
            </MetaItem>
          </WorkoutMeta>
          
          <ActionButtons>
            <Button as={Link} to={`/edit-workout/${workout.id}`} variant="primary">
              Workout bearbeiten
            </Button>
            <Button as={Link} to="/workout-tracker" variant="secondary">
              Neues Workout
            </Button>
            <Button onClick={() => setShowDeleteModal(true)} variant="danger">
              Workout löschen
            </Button>
          </ActionButtons>
        </Card.Body>
      </WorkoutInfoCard>

      <StatsGrid>
        <StatCard>
          <Card.Header>📊 Sätze pro Muskelgruppe</Card.Header>
          <Card.Body>
            {Object.keys(muscleGroupSets).length > 0 ? (
              <MuscleGroupGrid>
                {Object.entries(muscleGroupSets)
                  .sort(([,a], [,b]) => b - a)
                  .map(([muscle, sets]) => (
                    <MuscleGroupItem key={muscle}>
                      <div className="muscle-name">{muscle}</div>
                      <div className="muscle-sets">{sets} Sätze</div>
                    </MuscleGroupItem>
                  ))}
              </MuscleGroupGrid>
            ) : (
              <p>Keine Muskelgruppen-Daten verfügbar</p>
            )}
          </Card.Body>
        </StatCard>

        {progressiveOverload && (
          <ProgressCard>
            <Card.Header>📈 Progressive Overload vs. Vorwoche</Card.Header>
            <Card.Body>
              <ProgressItem>
                <span className="progress-label">Volumen Änderung:</span>
                <span className={`progress-value ${
                  progressiveOverload.volumeChange > 0 ? 'progress-positive' : 
                  progressiveOverload.volumeChange < 0 ? 'progress-negative' : 'progress-neutral'
                }`}>
                  {progressiveOverload.volumeChange > 0 ? '+' : ''}{progressiveOverload.volumeChange.toFixed(1)}%
                </span>
              </ProgressItem>
              <ProgressItem>
                <span className="progress-label">Sätze Änderung:</span>
                <span className={`progress-value ${
                  progressiveOverload.setsChange > 0 ? 'progress-positive' : 
                  progressiveOverload.setsChange < 0 ? 'progress-negative' : 'progress-neutral'
                }`}>
                  {progressiveOverload.setsChange > 0 ? '+' : ''}{progressiveOverload.setsChange}
                </span>
              </ProgressItem>
              <ProgressItem>
                <span className="progress-label">Wiederholungen:</span>
                <span className={`progress-value ${
                  progressiveOverload.repsChange > 0 ? 'progress-positive' : 
                  progressiveOverload.repsChange < 0 ? 'progress-negative' : 'progress-neutral'
                }`}>
                  {progressiveOverload.repsChange > 0 ? '+' : ''}{progressiveOverload.repsChange}
                </span>
              </ProgressItem>
              <ProgressItem>
                <span className="progress-label">Vergleich mit:</span>
                <span className="progress-value">
                  {formatDate(progressiveOverload.previousWorkout.date)}
                </span>
              </ProgressItem>
            </Card.Body>
          </ProgressCard>
        )}

        <DetailStatsCard>
          <Card.Header>📋 Workout Details</Card.Header>
          <Card.Body>
            <DetailStatItem>
              <span className="stat-label">Gesamtvolumen:</span>
              <span className="stat-value">{Math.round(detailedStats.totalVolume).toLocaleString()} kg</span>
            </DetailStatItem>
            <DetailStatItem>
              <span className="stat-label">Trainierte Muskelgruppen:</span>
              <span className="stat-value">{detailedStats.muscleGroupCount}</span>
            </DetailStatItem>
            <DetailStatItem>
              <span className="stat-label">Ø Wiederholungen/Satz:</span>
              <span className="stat-value">{detailedStats.avgRepsPerSet}</span>
            </DetailStatItem>
            <DetailStatItem>
              <span className="stat-label">Ø Gewicht/Satz:</span>
              <span className="stat-value">{detailedStats.avgWeightPerSet} kg</span>
            </DetailStatItem>
            <DetailStatItem>
              <span className="stat-label">Ø RIR/Satz:</span>
              <span className="stat-value">{detailedStats.avgRir}</span>
            </DetailStatItem>
            <DetailStatItem>
              <span className="stat-label">Ø Pausenzeit:</span>
              <span className="stat-value">{detailedStats.avgRestTime} s</span>
            </DetailStatItem>
          </Card.Body>
        </DetailStatsCard>
      </StatsGrid>
      
      <h2>Ausgeführte Übungen</h2>
      
      {workout.exercises?.map((exercise) => (
        <ExerciseCard key={exercise.exerciseId}>
          <Card.Header>
            <ExerciseTitle>
              {exercise.name}
              {exercise.isCompleted && <CompletedBadge>Abgeschlossen</CompletedBadge>}
            </ExerciseTitle>
          </Card.Header>
          <Card.Body>
            <SetsTable>
              <thead>
                <tr>
                  <th>Satz</th>
                  <th>Wiederholungen</th>
                  <th>Gewicht</th>
                  <th>RIR</th>
                  <th>Pause</th>
                  <th>Notizen</th>
                </tr>
              </thead>
              <tbody>
                {exercise.performedSets?.map((set) => (
                  <tr key={set.setNumber}>
                    <td>{set.setNumber}</td>
                    <td>{set.actualReps || '-'}</td>
                    <td>{set.actualWeight ? `${set.actualWeight} kg` : '-'}</td>
                    <td>{set.rir || '-'}</td>
                    <td>{set.restTime ? `${set.restTime} s` : '-'}</td>
                    <td>{set.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </SetsTable>
            
            {exercise.exerciseNotes && (
              <ExerciseNotes>
                <strong>Notizen:</strong> {exercise.exerciseNotes}
              </ExerciseNotes>
            )}
          </Card.Body>
        </ExerciseCard>
      ))}
      
      {showDeleteModal && (
        <DeleteModal>
          <ModalContent>
            <ModalTitle>Workout löschen</ModalTitle>
            <p>Bist du sicher, dass du dieses Workout löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.</p>
            
            <ModalButtons>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Abbrechen
              </Button>
              <Button variant="danger" onClick={handleDeleteWorkout}>
                Löschen
              </Button>
            </ModalButtons>
          </ModalContent>
        </DeleteModal>
      )}
    </PageContainer>
  );
};

export default WorkoutDetails; 