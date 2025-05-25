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
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.mobile.lg};
    margin-bottom: ${props => props.theme.spacing.mobile.xl};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: ${props => props.theme.spacing.mobile.md};
    margin-bottom: ${props => props.theme.spacing.mobile.lg};
  }
`;

const WelcomeCard = styled(Card)`
  grid-column: 1 / -1;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-column: 1;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: ${props => props.theme.spacing.mobile.md};
    margin-top: ${props => props.theme.spacing.mobile.md};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.mobile.sm};
  }
`;

const StatItem = styled.div`
  flex: 1;
  min-width: 120px;
  background-color: ${props => props.theme.colors.grayLight};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.mobile.md};
    min-width: 100px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: auto;
    padding: ${props => props.theme.spacing.mobile.sm};
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSizes.mobile.xl};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.typography.fontSizes.mobile.lg};
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  margin-top: 0.25rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSizes.mobile.sm};
    margin-top: ${props => props.theme.spacing.mobile.xs};
  }
`;

const RecentWorkoutsContainer = styled.div`
  margin-top: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-top: ${props => props.theme.spacing.mobile.xl};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-top: ${props => props.theme.spacing.mobile.lg};
  }
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
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: ${props => props.theme.spacing.mobile.lg};
    margin-top: ${props => props.theme.spacing.mobile.md};
    padding: ${props => props.theme.spacing.mobile.sm} ${props => props.theme.spacing.mobile.md};
    
    > * {
      width: 250px;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: ${props => props.theme.spacing.mobile.md};
    padding: ${props => props.theme.spacing.mobile.xs} ${props => props.theme.spacing.mobile.sm};
    
    > * {
      width: 220px;
    }
  }
`;

const ListLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textLight};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: ${props => props.theme.spacing.mobile.md};
    margin-top: ${props => props.theme.spacing.mobile.md};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: ${props => props.theme.spacing.mobile.sm};
  }
`;

const ClickableCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-height: ${props => props.theme.mobile?.touchTarget || '44px'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 16px rgba(0,0,0,0.1);
    transform: translateY(-5px);
  }
  
  /* Remove hover effects on touch devices */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
      box-shadow: ${props => props.theme.shadows.card};
    }
  }
  
  /* Add touch feedback */
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-height: 60px;
    padding: ${props => props.theme.spacing.mobile.lg};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-height: 80px;
    padding: ${props => props.theme.spacing.mobile.xl};
  }
`;

const ClickableListItem = styled(Card)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.grayLight};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    padding: ${props => props.theme.spacing.mobile.lg};
    min-height: 70px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.mobile.xl};
    min-height: 90px;
  }
  
  /* Remove hover effects on touch devices */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      background-color: transparent;
    }
  }
`;

const WorkoutInfo = styled.div`
  flex: 1;
  padding: 0 ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0;
    width: 100%;
  }
`;

const WorkoutTitle = styled.h3`
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSizes.mobile.lg};
    margin-bottom: ${props => props.theme.spacing.mobile.xs};
  }
`;

const WorkoutDescription = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textLight};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSizes.mobile.sm};
  }
`;

const ExerciseList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: ${props => props.theme.spacing.md} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin: ${props => props.theme.spacing.mobile.md} 0;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: ${props => props.theme.spacing.mobile.sm} 0;
  }
`;

const ExerciseItem = styled.li`
  padding: ${props => props.theme.spacing.xs} 0;
  font-size: 0.9rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.mobile.xs} 0;
    font-size: ${props => props.theme.typography.fontSizes.mobile.sm};
  }
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
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1px 4px;
    font-size: ${props => props.theme.typography.fontSizes.mobile.xs};
    margin-right: ${props => props.theme.spacing.mobile.xs};
  }
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
            <Button 
              as={Link} 
              to="/create-plan"
              style={{
                minHeight: '48px',
                fontSize: window.innerWidth <= 768 ? '1.1rem' : 'inherit',
                padding: window.innerWidth <= 768 ? '12px 24px' : 'inherit'
              }}
            >
              Trainingsplan erstellen
            </Button>
          </Card.Footer>
        </WelcomeCard>
        
        <Card>
                    <Card.Header>Leistungsanalyse</Card.Header>          <Card.Body>            <p>Analysieren Sie Trainingsdaten, um Fortschrittsmuster und Optimierungsmöglichkeiten für eine verbesserte Leistung zu identifizieren.</p>          </Card.Body>          <Card.Footer>
            <Button 
              as={Link} 
              to="/analysis"
              style={{
                minHeight: '48px',
                fontSize: window.innerWidth <= 768 ? '1.1rem' : 'inherit',
                padding: window.innerWidth <= 768 ? '12px 24px' : 'inherit'
              }}
            >
              Analysen anzeigen
            </Button>          </Card.Footer>
        </Card>
      </DashboardContainer>
      
            <RecentWorkoutsContainer>        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>          <h2>Letzte Trainingseinheiten</h2>          {recentWorkouts.length > 0 && (            <Button 
              as={Link} 
              to="/workout-history" 
              variant="outline" 
              size="small"
              style={{
                minHeight: '44px',
                fontSize: window.innerWidth <= 768 ? '1rem' : 'inherit',
                padding: window.innerWidth <= 768 ? '10px 20px' : 'inherit'
              }}
            >              Alle anzeigen            </Button>          )}        </div>
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
                            <p>Noch keine Trainingseinheiten erfasst.</p>              <Button 
                as={Link} 
                to="/workout-tracker"
                style={{
                  minHeight: '48px',
                  fontSize: window.innerWidth <= 768 ? '1.1rem' : 'inherit',
                  padding: window.innerWidth <= 768 ? '12px 24px' : 'inherit'
                }}
              >
                Erstes Workout starten
              </Button>
            </Card.Body>
          </Card>
        )}
      </RecentWorkoutsContainer>
    </div>
  );
};

export default Dashboard; 