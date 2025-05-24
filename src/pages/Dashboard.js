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

/*
const GridLayoutContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.md};
`;
*/

const RecentWorkoutsRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};

  scroll-snap-type: x mandatory;

  /* Hide scrollbar for Webkit browsers */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  /* Hide scrollbar for IE, Edge and Firefox - these might not be needed if webkit works well */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: thin;  /* Firefox - or auto */
  scrollbar-color: ${props => props.theme.colors.border} transparent; /* Firefox */

  > * {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 280px;
  }
`;

const ListLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textLight};
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
  
  // Get recent workouts
  const recentWorkouts = [...workoutHistory].sort((a, b) => {
    // Sort by timestamp or date, whichever is available
    const timeA = a.timestamp || new Date(a.date).getTime() || 0;
    const timeB = b.timestamp || new Date(b.date).getTime() || 0;
    return timeB - timeA;
  });

  // Helper function to format date 
  /* const formatDate = (timestamp) => {
    if (!timestamp) return 'Kein Datum';
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }; */

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
                        <h2>Professionelles Fitness Management System</h2>            <p>              Entwerfen und verwalten Sie umfassende Trainingsprogramme, überwachen Sie Leistungsmetriken und erreichen Sie Ihre Fitnessziele mit Präzision.            </p>
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
                <StatLabel>Geplante Einheiten</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{workoutHistory.length}</StatValue>
                <StatLabel>Abgeschlossene Workouts</StatLabel>
              </StatItem>
            </StatsContainer>
          </Card.Body>
          <Card.Footer>
            <Button as={Link} to="/create-plan">Trainingsplan erstellen</Button>
          </Card.Footer>
        </WelcomeCard>
        
        <Card>
                    <Card.Header>Leistungsanalyse</Card.Header>          <Card.Body>            <p>Analysieren Sie Trainingsdaten, um Fortschrittsmuster und Optimierungsmöglichkeiten für eine verbesserte Leistung zu identifizieren.</p>          </Card.Body>          <Card.Footer>
            <Button as={Link} to="/analysis">Analysen anzeigen</Button>          </Card.Footer>
        </Card>
      </DashboardContainer>
      
            <RecentWorkoutsContainer>        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>          <h2>Letzte Trainingseinheiten</h2>          {recentWorkouts.length > 0 && (            <Button as={Link} to="/workout-history" variant="outline" size="small">              Alle anzeigen            </Button>          )}        </div>
        {recentWorkouts.length > 0 ? (
          userPreferences.dashboardLayout === 'grid' ? (
            // Grid Layout (now a single horizontal row)
            <RecentWorkoutsRow>
              {recentWorkouts.map(workout => (
                <Link key={workout.id} to={`/workout/${workout.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ClickableCard>
                    <Card.Header>
                      {workout.name || 'Unbenanntes Workout'}
                    </Card.Header>
                    <Card.Body>
                                            <p><strong>Datum:</strong> {formatDateFromString(workout.date)}</p>                      <p><strong>Übungen:</strong> {workout.exercises?.length || 0}</p>
                      
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
            </RecentWorkoutsRow>
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
                            <p>Noch keine Trainingseinheiten erfasst.</p>              <Button as={Link} to="/workout-tracker">Erstes Workout starten</Button>
            </Card.Body>
          </Card>
        )}
      </RecentWorkoutsContainer>
    </div>
  );
};

export default Dashboard; 