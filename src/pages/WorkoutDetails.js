import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
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