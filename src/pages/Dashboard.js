import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';
import { useTheme } from '../theme/ThemeProvider';

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

const RecentPlansContainer = styled.div`
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

const PlanCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PlanListItem = styled(Card)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PlanInfo = styled.div`
  flex: 1;
  padding: 0 ${props => props.theme.spacing.md};
`;

const PlanTitle = styled.h3`
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
`;

const PlanDescription = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textLight};
`;

const PlanMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const PlanActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: auto;
  
  @media (max-width: 768px) {
    margin-top: ${props => props.theme.spacing.md};
    width: 100%;
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
  
  // Get recent plans (up to 3)
  const recentPlans = [...workoutPlans].sort((a, b) => {
    const dateA = a.createdAt || 0;
    const dateB = b.createdAt || 0;
    return dateB - dateA;
  }).slice(0, 3);

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
      
      <RecentPlansContainer>
        <h2>Deine letzten Trainingspläne</h2>
        {recentPlans.length > 0 ? (
          userPreferences.dashboardLayout === 'grid' ? (
            // Grid Layout
            <GridLayoutContainer>
              {recentPlans.map(plan => (
                <PlanCard key={plan.id}>
                  <Card.Header>{plan.name}</Card.Header>
                  <Card.Body>
                    <p>{plan.description || 'Keine Beschreibung.'}</p>
                    <p><strong>Tage:</strong> {plan.days ? plan.days.length : 0}</p>
                    <p><strong>Erstellt:</strong> {formatDate(plan.createdAt)}</p>
                  </Card.Body>
                  <Card.Footer>
                    <PlanActions>
                      <Button as={Link} to={`/edit-plan/${plan.id}`} variant="primary">Bearbeiten</Button>
                      <Button as={Link} to="/calendar" variant="secondary">Planen</Button>
                    </PlanActions>
                  </Card.Footer>
                </PlanCard>
              ))}
            </GridLayoutContainer>
          ) : (
            // List Layout
            <ListLayoutContainer>
              {recentPlans.map(plan => (
                <PlanListItem key={plan.id}>
                  <PlanInfo>
                    <PlanTitle>{plan.name}</PlanTitle>
                    <PlanDescription>{plan.description || 'Keine Beschreibung.'}</PlanDescription>
                    <PlanMeta>
                      <span>Tage: {plan.days ? plan.days.length : 0}</span>
                      <span>Erstellt: {formatDate(plan.createdAt)}</span>
                    </PlanMeta>
                  </PlanInfo>
                  <PlanActions>
                    <Button as={Link} to={`/edit-plan/${plan.id}`} variant="primary">Bearbeiten</Button>
                    <Button as={Link} to="/calendar" variant="secondary">Planen</Button>
                  </PlanActions>
                </PlanListItem>
              ))}
            </ListLayoutContainer>
          )
        ) : (
          <Card>
            <Card.Body>
              <p>Du hast noch keine Trainingspläne erstellt.</p>
              <Button as={Link} to="/create-plan">Ersten Plan erstellen</Button>
            </Card.Body>
          </Card>
        )}
      </RecentPlansContainer>
    </div>
  );
};

export default Dashboard; 