import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  margin: 0;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
`;

const ChartContainer = styled.div`
  height: 250px;
  margin-bottom: 10px;
`;

const FeedbackSection = styled.div`
  margin-top: 30px;
`;

const FeedbackCard = styled(Card)`
  border-left: 4px solid #4caf50;
`;

const FeedbackTitle = styled.h3`
  margin-top: 0;
  color: #333;
`;

const FeedbackList = styled.ul`
  margin-top: 10px;
  padding-left: 20px;
`;

const FeedbackItem = styled.li`
  margin-bottom: 10px;
  line-height: 1.5;
`;

const TabContainer = styled.div`
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ active }) => (active ? '#007bff' : '#f0f0f0')};
  color: ${({ active }) => (active ? 'white' : '#333')};
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: ${({ active }) => (active ? '#0069d9' : '#e0e0e0')};
  }
`;

const NoDataMessage = styled.p`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const Analysis = () => {
  const { state } = useWorkout();
  const [activeTab, setActiveTab] = useState('volume');
  const [timeFrame, setTimeFrame] = useState('month');
  const [selectedPlan, setSelectedPlan] = useState('all');
  
  // Get current month for default view
  const today = new Date();
  const currentMonth = format(today, 'MMMM yyyy');
  
  // Derived states for filtered data
  const [filteredWorkoutHistory, setFilteredWorkoutHistory] = useState([]);
  
  useEffect(() => {
    // Filter workout history based on selected time frame and plan
    let filtered = Array.isArray(state.workoutHistory) ? [...state.workoutHistory] : [];
    
    // Filter by time frame
    if (timeFrame === 'month') {
      const startDate = startOfMonth(today);
      const endDate = endOfMonth(today);
      filtered = filtered.filter(workout => {
        const workoutDate = parseISO(workout.date);
        return isWithinInterval(workoutDate, { start: startDate, end: endDate });
      });
    } else if (timeFrame === '3months') {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      filtered = filtered.filter(workout => {
        const workoutDate = parseISO(workout.date);
        return workoutDate >= threeMonthsAgo && workoutDate <= today;
      });
    } else if (timeFrame === 'year') {
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      filtered = filtered.filter(workout => {
        const workoutDate = parseISO(workout.date);
        return workoutDate >= oneYearAgo && workoutDate <= today;
      });
    }
    
    // Filter by plan
    if (selectedPlan !== 'all') {
      filtered = filtered.filter(workout => workout.planId === selectedPlan);
    }
    
    setFilteredWorkoutHistory(filtered);
  }, [timeFrame, selectedPlan, state.workoutHistory]);
  
  // Calculate total workout volume
  const calculateTotalVolume = () => {
    return filteredWorkoutHistory.reduce((total, workout) => {
      let workoutVolume = 0;
      
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          const reps = parseInt(set.reps) || 0;
          const weight = parseFloat(set.weight) || 0;
          workoutVolume += reps * weight;
        });
      });
      
      return total + workoutVolume;
    }, 0);
  };
  
  // Calculate workout frequency
  const calculateWorkoutFrequency = () => {
    const totalWorkouts = filteredWorkoutHistory.length;
    let daysInPeriod = 30; // Default for month
    
    if (timeFrame === '3months') {
      daysInPeriod = 90;
    } else if (timeFrame === 'year') {
      daysInPeriod = 365;
    }
    
    return {
      total: totalWorkouts,
      average: (totalWorkouts / daysInPeriod * 7).toFixed(1), // Average workouts per week
    };
  };
  
  // Calculate plan adherence
  const calculatePlanAdherence = () => {
    // Get all planned workouts
    const plannedWorkouts = state.calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      
      if (timeFrame === 'month') {
        return eventDate.getMonth() === today.getMonth() && 
               eventDate.getFullYear() === today.getFullYear();
      } else if (timeFrame === '3months') {
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        return eventDate >= threeMonthsAgo && eventDate <= today;
      } else if (timeFrame === 'year') {
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        return eventDate >= oneYearAgo && eventDate <= today;
      }
      
      return false;
    });
    
    // Count completed workouts based on the workout history
    const completedDates = new Set(filteredWorkoutHistory.map(workout => workout.date));
    const completedCount = plannedWorkouts.filter(event => 
      completedDates.has(format(new Date(event.date), 'yyyy-MM-dd'))
    ).length;
    
    return {
      planned: plannedWorkouts.length,
      completed: completedCount,
      adherenceRate: plannedWorkouts.length > 0 
        ? (completedCount / plannedWorkouts.length * 100).toFixed(1) 
        : 0,
    };
  };
  
  // Generate chart data for volume over time
  const getVolumeChartData = () => {
    // Group workouts by date and calculate volume for each date
    const volumeByDate = {};
    
    filteredWorkoutHistory.forEach(workout => {
      const date = workout.date;
      let dailyVolume = 0;
      
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          const reps = parseInt(set.reps) || 0;
          const weight = parseFloat(set.weight) || 0;
          dailyVolume += reps * weight;
        });
      });
      
      if (volumeByDate[date]) {
        volumeByDate[date] += dailyVolume;
      } else {
        volumeByDate[date] = dailyVolume;
      }
    });
    
    // Sort dates
    const sortedDates = Object.keys(volumeByDate).sort();
    
    return {
      labels: sortedDates.map(date => format(parseISO(date), 'dd.MM')),
      datasets: [
        {
          label: 'Trainingsvolumen (kg)',
          data: sortedDates.map(date => volumeByDate[date]),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Generate chart data for muscle group focus
  const getMuscleGroupChartData = () => {
    // Count exercises by muscle group
    const muscleGroupCounts = {};
    
    filteredWorkoutHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        // Find the exercise in the library to get muscle groups
        const exerciseData = state.exercises.find(ex => ex.id === exercise.exerciseId);
        if (exerciseData && exerciseData.muscleGroups) {
          exerciseData.muscleGroups.forEach(muscleGroup => {
            if (muscleGroupCounts[muscleGroup]) {
              muscleGroupCounts[muscleGroup] += 1;
            } else {
              muscleGroupCounts[muscleGroup] = 1;
            }
          });
        }
      });
    });
    
    const muscleGroups = Object.keys(muscleGroupCounts);
    
    return {
      labels: muscleGroups,
      datasets: [
        {
          label: 'Übungen pro Muskelgruppe',
          data: muscleGroups.map(group => muscleGroupCounts[group]),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 255, 0.6)',
            'rgba(40, 159, 64, 0.6)',
            'rgba(210, 199, 199, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Generate feedback based on the data
  const generateFeedback = () => {
    const feedback = [];
    const adherence = calculatePlanAdherence();
    const frequency = calculateWorkoutFrequency();
    
    // Feedback on adherence
    if (adherence.planned > 0) {
      if (adherence.adherenceRate >= 80) {
        feedback.push("Hervorragende Planeinhaltung! Du hältst dich konsequent an deinen Trainingsplan.");
      } else if (adherence.adherenceRate >= 60) {
        feedback.push("Gute Planeinhaltung. Versuche, noch konsequenter zu sein, um optimale Ergebnisse zu erzielen.");
      } else {
        feedback.push("Deine Planeinhaltung könnte besser sein. Überlege, ob dein Plan realistisch ist oder was dich daran hindert, ihn einzuhalten.");
      }
    }
    
    // Feedback on frequency
    if (frequency.total > 0) {
      if (frequency.average >= 4) {
        feedback.push("Beeindruckende Trainingshäufigkeit! Achte auf ausreichende Erholung zwischen den Einheiten.");
      } else if (frequency.average >= 2) {
        feedback.push("Gute Trainingshäufigkeit. Dies ist ein solides Fundament für kontinuierlichen Fortschritt.");
      } else {
        feedback.push("Du könntest von einer höheren Trainingshäufigkeit profitieren, um bessere Ergebnisse zu erzielen.");
      }
    }
    
    // Feedback on volume
    const totalVolume = calculateTotalVolume();
    if (filteredWorkoutHistory.length > 0) {
      const averageVolumePerWorkout = totalVolume / filteredWorkoutHistory.length;
      if (averageVolumePerWorkout > 10000) {
        feedback.push("Dein Trainingsvolumen ist hoch. Achte auf eine gute Technik und ausreichende Erholung.");
      } else if (averageVolumePerWorkout > 5000) {
        feedback.push("Gutes Trainingsvolumen. Eine progressive Steigerung könnte zu weiteren Fortschritten führen.");
      } else {
        feedback.push("Dein Trainingsvolumen könnte gesteigert werden. Versuche, die Gewichte oder Wiederholungen langsam zu erhöhen.");
      }
    }
    
    // General feedback if no data
    if (feedback.length === 0) {
      feedback.push("Beginne mit der Protokollierung deiner Trainingseinheiten, um personalisiertes Feedback zu erhalten.");
    }
    
    return feedback;
  };
  
  // Render functions for different tabs
  const renderVolumeTab = () => {
    if (filteredWorkoutHistory.length === 0) {
      return <NoDataMessage>Keine Trainingsdaten im ausgewählten Zeitraum vorhanden.</NoDataMessage>;
    }
    
    const volumeChartData = getVolumeChartData();
    const totalVolume = calculateTotalVolume();
    const volumePerWorkout = totalVolume / filteredWorkoutHistory.length;
    
    return (
      <StatsGrid>
        <StatCard>
          <StatTitle>Gesamtvolumen</StatTitle>
          <p>{totalVolume.toFixed(0)} kg</p>
          <p>Durchschnitt pro Training: {volumePerWorkout.toFixed(0)} kg</p>
        </StatCard>
        
        <StatCard>
          <StatTitle>Volumen über Zeit</StatTitle>
          <ChartContainer>
            <Line 
              data={volumeChartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }} 
            />
          </ChartContainer>
        </StatCard>
      </StatsGrid>
    );
  };
  
  const renderFrequencyTab = () => {
    if (filteredWorkoutHistory.length === 0) {
      return <NoDataMessage>Keine Trainingsdaten im ausgewählten Zeitraum vorhanden.</NoDataMessage>;
    }
    
    const frequency = calculateWorkoutFrequency();
    
    // Group workouts by day of week
    const dayCountMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    filteredWorkoutHistory.forEach(workout => {
      const date = parseISO(workout.date);
      const dayOfWeek = date.getDay();
      dayCountMap[dayOfWeek]++;
    });
    
    const dayOfWeekData = {
      labels: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      datasets: [
        {
          label: 'Trainings pro Wochentag',
          data: Object.values(dayCountMap),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    return (
      <StatsGrid>
        <StatCard>
          <StatTitle>Trainingshäufigkeit</StatTitle>
          <p>Gesamtanzahl Trainings: {frequency.total}</p>
          <p>Durchschnitt pro Woche: {frequency.average}</p>
        </StatCard>
        
        <StatCard>
          <StatTitle>Trainingstage pro Woche</StatTitle>
          <ChartContainer>
            <Bar 
              data={dayOfWeekData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }} 
            />
          </ChartContainer>
        </StatCard>
      </StatsGrid>
    );
  };
  
  const renderAdherenceTab = () => {
    const adherence = calculatePlanAdherence();
    
    if (adherence.planned === 0) {
      return <NoDataMessage>Keine geplanten Trainings im ausgewählten Zeitraum.</NoDataMessage>;
    }
    
    const adherenceData = {
      labels: ['Absolviert', 'Verpasst'],
      datasets: [
        {
          data: [adherence.completed, adherence.planned - adherence.completed],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          borderWidth: 1,
        },
      ],
    };
    
    return (
      <StatsGrid>
        <StatCard>
          <StatTitle>Planeinhaltung</StatTitle>
          <p>Geplante Trainings: {adherence.planned}</p>
          <p>Absolvierte Trainings: {adherence.completed}</p>
          <p>Einhaltungsrate: {adherence.adherenceRate}%</p>
        </StatCard>
        
        <StatCard>
          <StatTitle>Übersicht</StatTitle>
          <ChartContainer>
            <Pie 
              data={adherenceData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }} 
            />
          </ChartContainer>
        </StatCard>
      </StatsGrid>
    );
  };
  
  const renderMuscleGroupTab = () => {
    if (filteredWorkoutHistory.length === 0) {
      return <NoDataMessage>Keine Trainingsdaten im ausgewählten Zeitraum vorhanden.</NoDataMessage>;
    }
    
    const muscleGroupData = getMuscleGroupChartData();
    
    return (
      <StatCard>
        <StatTitle>Muskelgruppen-Fokus</StatTitle>
        <ChartContainer>
          <Bar 
            data={muscleGroupData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: false }
              }
            }} 
          />
        </ChartContainer>
        <p>Diese Grafik zeigt, welche Muskelgruppen du am häufigsten trainierst.</p>
      </StatCard>
    );
  };
  
  return (
    <Container>
      <Header>
        <PageTitle>Trainingsanalyse</PageTitle>
      </Header>
      
      <FilterContainer>
        <div>
          <label htmlFor="timeFrame">Zeitraum: </label>
          <Select id="timeFrame" value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
            <option value="month">Aktueller Monat ({currentMonth})</option>
            <option value="3months">Letzte 3 Monate</option>
            <option value="year">Letztes Jahr</option>
          </Select>
        </div>
        
        <div>
          <label htmlFor="selectedPlan">Trainingsplan: </label>
          <Select id="selectedPlan" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
            <option value="all">Alle Pläne</option>
            {state.workoutPlans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name}</option>
            ))}
          </Select>
        </div>
      </FilterContainer>
      
      <TabContainer>
        <TabButton 
          active={activeTab === 'volume'} 
          onClick={() => setActiveTab('volume')}
        >
          Volumen
        </TabButton>
        <TabButton 
          active={activeTab === 'frequency'} 
          onClick={() => setActiveTab('frequency')}
        >
          Häufigkeit
        </TabButton>
        <TabButton 
          active={activeTab === 'adherence'} 
          onClick={() => setActiveTab('adherence')}
        >
          Planeinhaltung
        </TabButton>
        <TabButton 
          active={activeTab === 'musclegroups'} 
          onClick={() => setActiveTab('musclegroups')}
        >
          Muskelgruppen
        </TabButton>
      </TabContainer>
      
      {activeTab === 'volume' && renderVolumeTab()}
      {activeTab === 'frequency' && renderFrequencyTab()}
      {activeTab === 'adherence' && renderAdherenceTab()}
      {activeTab === 'musclegroups' && renderMuscleGroupTab()}
      
      <FeedbackSection>
        <FeedbackCard>
          <FeedbackTitle>Persönliches Feedback</FeedbackTitle>
          <FeedbackList>
            {generateFeedback().map((item, index) => (
              <FeedbackItem key={index}>{item}</FeedbackItem>
            ))}
          </FeedbackList>
        </FeedbackCard>
      </FeedbackSection>
    </Container>
  );
};

export default Analysis; 