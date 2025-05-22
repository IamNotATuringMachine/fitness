import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';
import { useTheme } from '../theme/ThemeProvider';
import { format } from 'date-fns';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const WelcomeCard = styled(Card)`
  grid-column: 1 / -1;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  flex: 1;
  min-width: 120px;
  background-color: ${props => props.theme.colors.grayLight};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  margin-top: 0.25rem;
`;

const RecentWorkoutsContainer = styled.div`
  margin-top: 2rem;
`;

const GridLayoutContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.md};
`;

const ListLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const ClickableCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 16px rgba(0,0,0,0.1);
    transform: translateY(-5px);
  }
`;

const ClickableListItem = styled(Card)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.grayLight};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const WorkoutInfo = styled.div`
  flex: 1;
  padding: 0 ${props => props.theme.spacing.md};
`;

const WorkoutTitle = styled.h3`
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
`;

const WorkoutDescription = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textLight};
`;

const WorkoutMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const ExerciseList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: ${props => props.theme.spacing.md} 0;
`;

const ExerciseItem = styled.li`
  padding: ${props => props.theme.spacing.xs} 0;
  font-size: 0.9rem;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};
  margin-right: ${props => props.theme.spacing.xs};
`;

const Dashboard = () => {
  const { state } = useWorkout();
  const { userPreferences } = useTheme();
  
  // Ensure all properties exist with defaults
  const workoutPlans = state?.workoutPlans || [];
  const exercises = state?.exercises || [];
  const calendarEvents = state?.calendarEvents || [];
  const workoutHistory = state?.workoutHistory || [];
  
  // Get recent workouts (up to 3)
  const recentWorkouts = [...workoutHistory].sort((a, b) => {
    // Sort by timestamp or date, whichever is available
    const timeA = a.timestamp || new Date(a.date).getTime() || 0;
    const timeB = b.timestamp || new Date(b.date).getTime() || 0;
    return timeB - timeA;
  }).slice(0, userPreferences.showMaxRecentWorkouts || 3);

  // Helper function to format date 
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Kein Datum';
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Format date from ISO string
  const formatDateFromString = (dateString) => {
    if (!dateString) return 'Kein Datum';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      return 'Ungültiges Datum';
    }
  };
  
  return (
    <div className={userPreferences.compactMode ? 'compact-mode' : ''}>
      <h1>Dashboard</h1>
      
      <DashboardContainer>
        <WelcomeCard>
          <Card.Body>
            <h2>Willkommen bei deinem Fitness-Trainingsplaner</h2>
            <p>
              Erstelle und verwalte deine Trainingspläne, verfolge deinen Fortschritt und erreiche deine Fitnessziele.
            </p>
            <StatsContainer>
              <StatItem>
                <StatValue>{workoutPlans.length}</StatValue>
                <StatLabel>Trainingspläne</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{exercises.length}</StatValue>
                <StatLabel>Übungen</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{calendarEvents.length}</StatValue>
                <StatLabel>Geplante Trainings</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{workoutHistory.length}</StatValue>
                <StatLabel>Absolvierte Trainings</StatLabel>
              </StatItem>
            </StatsContainer>
          </Card.Body>
          <Card.Footer>
            <Button as={Link} to="/create-plan">Neuen Trainingsplan erstellen</Button>
          </Card.Footer>
        </WelcomeCard>
        
        <Card>
          <Card.Header>Trainingsanalyse</Card.Header>
          <Card.Body>
            <p>Analysiere deine Trainingsdaten, um Fortschritte zu erkennen und Verbesserungspotential zu identifizieren.</p>
          </Card.Body>
          <Card.Footer>
            <Button as={Link} to="/analysis">Zur Analyse</Button>
          </Card.Footer>
        </Card>
      </DashboardContainer>
      
      <RecentWorkoutsContainer>
        <h2>Deine letzten Workouts</h2>
        {recentWorkouts.length > 0 ? (
          userPreferences.dashboardLayout === 'grid' ? (
            // Grid Layout
            <GridLayoutContainer>
              {recentWorkouts.map(workout => (
                <Link key={workout.id} to={`/workout/${workout.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ClickableCard>
                    <Card.Header>
                      {workout.name || 'Unbenanntes Workout'}
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Datum:</strong> {formatDateFromString(workout.date)}</p>
                      <p><strong>Übungen:</strong> {workout.exercises?.length || 0}</p>
                      
                      {workout.exercises && workout.exercises.length > 0 && (
                        <ExerciseList>
                          {workout.exercises.slice(0, 3).map(exercise => (
                            <ExerciseItem key={exercise.exerciseId || exercise.id}>
                              <Badge>{exercise.performedSets?.length || exercise.sets?.length || 0} Sätze</Badge>
                              {exercise.name}
                            </ExerciseItem>
                          ))}
                        </ExerciseList>
                      )}
                    </Card.Body>
                  </ClickableCard>
                </Link>
              ))}
            </GridLayoutContainer>
          ) : (
            // List Layout
            <ListLayoutContainer>
              {recentWorkouts.map(workout => (
                <Link key={workout.id} to={`/workout/${workout.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ClickableListItem>
                    <WorkoutInfo>
                      <WorkoutTitle>{workout.name || 'Unbenanntes Workout'}</WorkoutTitle>
                      <WorkoutDescription>
                        Datum: {formatDateFromString(workout.date)} - Übungen: {workout.exercises?.length || 0}
                      </WorkoutDescription>
                      {workout.exercises && workout.exercises.length > 0 && (
                        <ExerciseList style={{ margin: '8px 0 0 0' }}>
                          {workout.exercises.slice(0, 2).map(exercise => (
                            <ExerciseItem key={exercise.exerciseId || exercise.id} style={{ fontSize: '0.8rem', padding: '2px 0'}}>
                              <Badge style={{fontSize: '0.7rem', padding: '1px 4px'}}>{exercise.performedSets?.length || exercise.sets?.length || 0} Sätze</Badge>
                              {exercise.name}
                            </ExerciseItem>
                          ))}
                          {workout.exercises.length > 2 && <ExerciseItem style={{ fontSize: '0.8rem', color: 'gray' }}>... und {workout.exercises.length - 2} weitere</ExerciseItem>}
                        </ExerciseList>
                      )}
                    </WorkoutInfo>
                  </ClickableListItem>
                </Link>
              ))}
            </ListLayoutContainer>
          )
        ) : (
          <Card>
            <Card.Body>
              <p>Du hast noch keine Workouts erfasst.</p>
              <Button as={Link} to="/workout-tracker">Erstes Workout erfassen</Button>
            </Card.Body>
          </Card>
        )}
      </RecentWorkoutsContainer>
    </div>
  );
};

export default Dashboard; 