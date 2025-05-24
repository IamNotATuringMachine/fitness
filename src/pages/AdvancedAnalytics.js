import React, { /* useState, */ useMemo } from 'react';
import styled from 'styled-components';
import { Card } from '../components/ui';
import { useWorkout } from '../context/WorkoutContext';

const AnalyticsContainer = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xxl};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const MetricCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.primary}15, ${props.theme.colors.primary}25)`};
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MetricLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AdvancedAnalytics = () => {
  const { workoutHistory } = useWorkout();

  const processedData = useMemo(() => {
    if (!workoutHistory || workoutHistory.length === 0) return null;

    const totalVolume = workoutHistory.reduce((sum, workout) => {
      return sum + (workout.sets || []).reduce((setSum, set) => 
        setSum + (set.weight || 0) * (set.reps || 0), 0
      );
    }, 0);

    return {
      totalVolume,
      totalWorkouts: workoutHistory.length,
      averageVolume: totalVolume / workoutHistory.length || 0
    };
  }, [workoutHistory]);

  if (!processedData) {
    return (
      <AnalyticsContainer>
        <DashboardHeader>
          <Title>Advanced Analytics</Title>
        </DashboardHeader>
        <Card style={{ padding: '40px', textAlign: 'center' }}>
          <h3>No workout data available</h3>
          <p>Start tracking your workouts to see detailed analytics and insights!</p>
        </Card>
      </AnalyticsContainer>
    );
  }

  return (
    <AnalyticsContainer>
      <DashboardHeader>
        <Title>🧠 Advanced Analytics Dashboard</Title>
      </DashboardHeader>

      <MetricsGrid>
        <MetricCard>
          <MetricValue>{Math.round(processedData.totalVolume).toLocaleString()}</MetricValue>
          <MetricLabel>Total Volume (kg)</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricValue>{processedData.totalWorkouts}</MetricValue>
          <MetricLabel>Total Workouts</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricValue>{Math.round(processedData.averageVolume).toLocaleString()}</MetricValue>
          <MetricLabel>Average Volume</MetricLabel>
        </MetricCard>
      </MetricsGrid>
    </AnalyticsContainer>
  );
};

export default AdvancedAnalytics; 