import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import { format, parseISO, startOfWeek, endOfWeek, eachWeekOfInterval, isWithinInterval, subWeeks } from 'date-fns';
import { de } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import { exerciseDatabase } from '../data/exerciseDatabase';
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
import { Bar, Line } from 'react-chartjs-2';

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

// Generate muscle group weights from the detailed exercise database
const generateMuscleGroupWeights = () => {
  const weights = {};
  
  // Convert the detailed database to the format expected by Analysis.js
  Object.keys(exerciseDatabase).forEach(muscleGroup => {
    exerciseDatabase[muscleGroup].forEach(exercise => {
      // Add main exercise
      if (exercise.gewichtete_muskelbeteiligung_pro_satz) {
        weights[exercise.übung_name] = { ...exercise.gewichtete_muskelbeteiligung_pro_satz };
      }
      
      // Add variations
      if (exercise.variationen) {
        exercise.variationen.forEach(variation => {
          if (variation.gewichtete_muskelbeteiligung_pro_satz) {
            weights[variation.name] = { ...variation.gewichtete_muskelbeteiligung_pro_satz };
          }
        });
      }
    });
  });
  
  // Normalize muscle group names for compatibility with existing analysis logic
  const normalizedWeights = {};
  Object.keys(weights).forEach(exerciseName => {
    const normalizedMuscleWeights = {};
    Object.keys(weights[exerciseName]).forEach(muscleGroup => {
      // Map detailed muscle names to simpler categories for analysis
      let simplifiedMuscle = muscleGroup;
      
      // Mapping rules for better analysis compatibility
      if (muscleGroup.includes('Brust') || muscleGroup.includes('brust')) {
        simplifiedMuscle = 'Brust';
      } else if (muscleGroup.includes('Schulter') || muscleGroup.includes('schulter')) {
        simplifiedMuscle = 'Schultern';
      } else if (muscleGroup.includes('Latissimus') || muscleGroup.includes('Trapez') || muscleGroup.includes('Rhomb') || muscleGroup.includes('Rückenstrecker')) {
        simplifiedMuscle = 'Rücken';
      } else if (muscleGroup.includes('Quadrizeps') || muscleGroup.includes('Beinbeuger') || muscleGroup.includes('Adduktor')) {
        simplifiedMuscle = 'Beine';
      } else if (muscleGroup.includes('Bizeps') || muscleGroup.includes('Brachialis')) {
        simplifiedMuscle = 'Bizeps';
      } else if (muscleGroup.includes('Trizeps')) {
        simplifiedMuscle = 'Trizeps';
      } else if (muscleGroup.includes('Gesäß') || muscleGroup.includes('gesäß')) {
        simplifiedMuscle = 'Gesäß';
      } else if (muscleGroup.includes('Bauch') || muscleGroup.includes('bauch') || muscleGroup.includes('Rumpf')) {
        simplifiedMuscle = 'Bauch';
      } else if (muscleGroup.includes('Gastrocnemius') || muscleGroup.includes('Soleus')) {
        simplifiedMuscle = 'Waden';
      } else if (muscleGroup.includes('Unterarme') || muscleGroup.includes('Griffkraft')) {
        simplifiedMuscle = 'Unterarme';
      }
      
      // Sum up weights for the same simplified muscle group
      if (normalizedMuscleWeights[simplifiedMuscle]) {
        normalizedMuscleWeights[simplifiedMuscle] = Math.max(normalizedMuscleWeights[simplifiedMuscle], weights[exerciseName][muscleGroup]);
      } else {
        normalizedMuscleWeights[simplifiedMuscle] = weights[exerciseName][muscleGroup];
      }
    });
    
    normalizedWeights[exerciseName] = normalizedMuscleWeights;
  });
  
  console.log('🔍 Generated muscle group weights from database:', normalizedWeights);
  return normalizedWeights;
};

// Use the new dynamic weights instead of hardcoded ones
const MUSCLE_GROUP_WEIGHTS = generateMuscleGroupWeights();

// Helper to get all unique muscle groups
const getAllMuscleGroups = (weights) => {
  const allGroups = new Set();
  Object.values(weights).forEach(exercise => {
    Object.keys(exercise).forEach(group => allGroups.add(group));
  });
  // Ensure major muscle groups are present even if not in weights initially
  ['Brust', 'Rücken', 'Beine', 'Schultern', 'Bizeps', 'Trizeps', 'Bauch', 'Gesäß', 'Waden', 'Unterarme'].forEach(g => allGroups.add(g));
  
  console.log('🔍 All muscle groups found:', Array.from(allGroups).sort());
  return Array.from(allGroups).sort();
};

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: #333;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  min-width: 120px;
`;

const TabContainer = styled.div`
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
`;

const TabButton = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: ${({ active }) => (active ? 'white' : '#666')};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #007bff;
  }
  
  ${({ active }) => active && `
    border-bottom-color: #007bff;
    color: white;
  `}
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.25rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 15px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  color: white;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 1.1rem;
`;

const ExerciseProgressCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid ${({ positive }) => positive ? '#4CAF50' : positive === false ? '#F44336' : '#ddd'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ExerciseProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ExerciseName = styled.h4`
  margin: 0;
  color: #333;
`;

const ProgressBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${({ positive }) => positive ? '#E8F5E8' : positive === false ? '#FFEBEE' : '#F5F5F5'};
  color: ${({ positive }) => positive ? '#2E7D32' : positive === false ? '#C62828' : '#666'};
`;

// Styled components from ProgressTracking (or similar ones for Analysis page)
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  tr:hover {
    background-color: #e9ecef;
  }
`;
// End of styles from ProgressTracking

const Analysis = () => {
  const { state, dispatch } = useWorkout();
  const [timeFrame, setTimeFrame] = useState('4weeks');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'progression', 'bodyMeasurements'
  const [selectedExercise, setSelectedExercise] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); // Added for exercise search
  const [sortBy, setSortBy] = useState('date'); // 'date', 'workouts', 'weekly'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [groupBy, setGroupBy] = useState('individual'); // 'individual', 'weekly'
  
  // State for body measurements form (moved from ProgressTracking or similar)
  const [bodyMeasurement, setBodyMeasurement] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: ''
  });

  // Fetch data from context
  const { 
    workoutHistory = [], 
    exercises = [], 
    bodyMeasurements = []
  } = state;  // Destructure here

  // Prepare body measurement data for charts
  const bodyMeasurementChartData = useMemo(() => {
    if (!bodyMeasurements || bodyMeasurements.length === 0) {
      return { weightData: null, circumferenceData: null };
    }

    const sortedMeasurements = [...bodyMeasurements]
      .filter(m => m.date)
      .sort((a, b) => parseISO(a.date) - parseISO(b.date));

    const labels = sortedMeasurements.map(m => format(parseISO(m.date), 'dd.MM.yy', { locale: de }));

    const weightData = {
      labels,
      datasets: [{
        label: 'Körpergewicht (kg)',
        data: sortedMeasurements.map(m => m.weight || null),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: false,
      }]
    };

    const circumferenceMetrics = [
      { key: 'chest', label: 'Brust (cm)', color: 'rgba(255, 99, 132, 1)' },
      { key: 'waist', label: 'Taille (cm)', color: 'rgba(54, 162, 235, 1)' },
      { key: 'hips', label: 'Hüfte (cm)', color: 'rgba(255, 206, 86, 1)' },
      { key: 'biceps', label: 'Bizeps (cm)', color: 'rgba(153, 102, 255, 1)' },
      { key: 'thighs', label: 'Oberschenkel (cm)', color: 'rgba(255, 159, 64, 1)' },
      // Add more if needed, e.g., neck, calves, forearms if they are tracked
    ];

    const circumferenceDatasets = circumferenceMetrics.map(metric => ({
      label: metric.label,
      data: sortedMeasurements.map(m => m[metric.key] || null),
      borderColor: metric.color,
      backgroundColor: metric.color.replace(', 1)', ', 0.2)'), // Make color transparent for area
      tension: 0.1,
      fill: false,
    })).filter(dataset => dataset.data.some(d => d !== null)); // Only include if data exists

    const circumferenceData = circumferenceDatasets.length > 0 ? {
      labels,
      datasets: circumferenceDatasets
    } : null;

    return { weightData, circumferenceData };
  }, [bodyMeasurements]);

  // Calculate date range based on timeFrame
  const getDateRange = useCallback(() => {
    const today = new Date();
    let startDate;
    
    switch (timeFrame) {
      case '4weeks':
        startDate = subWeeks(today, 4);
        break;
      case '8weeks':
        startDate = subWeeks(today, 8);
        break;
      case '12weeks':
        startDate = subWeeks(today, 12);
        break;
      case '6months':
        startDate = subWeeks(today, 26);
        break;
      case '1year':
        startDate = subWeeks(today, 52);
        break;
      default:
        startDate = subWeeks(today, 12);
    }
    
    return { start: startDate, end: today };
  }, [timeFrame]);

  // Filter workouts by date range
  const filteredWorkouts = useMemo(() => {
    const { start, end } = getDateRange();
    return workoutHistory.filter(workout => {
      const workoutDate = parseISO(workout.date);
      return isWithinInterval(workoutDate, { start, end });
    });
  }, [workoutHistory, getDateRange]);

  // Calculate sorted and grouped workout data
  const sortedAndGroupedData = useMemo(() => {
    if (groupBy === 'weekly') {
      const { start, end } = getDateRange();
      const weeks = eachWeekOfInterval({ start, end }, { locale: de });
      
      const weeklyData = weeks.map(weekStart => {
        const weekEnd = endOfWeek(weekStart, { locale: de });
        const weekLabel = format(weekStart, 'dd.MM', { locale: de });
        
        const weekWorkouts = filteredWorkouts.filter(workout => {
          const workoutDate = parseISO(workout.date);
          return isWithinInterval(workoutDate, { start: weekStart, end: weekEnd });
        });
        
        let totalSets = 0;
        let totalVolume = 0;
        let workoutCount = weekWorkouts.length;
        
        weekWorkouts.forEach(workout => {
          if (workout.exercises && Array.isArray(workout.exercises)) {
            workout.exercises.forEach(exercise => {
              if (exercise.performedSets && Array.isArray(exercise.performedSets)) {
                totalSets += exercise.performedSets.length;
                exercise.performedSets.forEach(set => {
                  const weight = parseFloat(set.actualWeight) || 0;
                  const reps = parseInt(set.actualReps) || 0;
                  totalVolume += weight * reps;
                });
              }
            });
          }
        });
        
        return { 
          period: weekLabel, 
          date: weekStart,
          workouts: workoutCount,
          sets: totalSets, 
          volume: totalVolume,
          type: 'week'
        };
      });
      
      // Sort weekly data
      return weeklyData.sort((a, b) => {
        const getValue = (item) => {
          switch (sortBy) {
            case 'date': return new Date(item.date);
            case 'workouts': return item.workouts;
            case 'volume': return item.volume;
            case 'sets': return item.sets;
            default: return new Date(item.date);
          }
        };
        
        const aVal = getValue(a);
        const bVal = getValue(b);
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    } else {
      // Individual workouts
      const workoutData = filteredWorkouts.map(workout => {
        let totalSets = 0;
        let totalVolume = 0;
        
        if (workout.exercises && Array.isArray(workout.exercises)) {
          workout.exercises.forEach(exercise => {
            if (exercise.performedSets && Array.isArray(exercise.performedSets)) {
              totalSets += exercise.performedSets.length;
              exercise.performedSets.forEach(set => {
                const weight = parseFloat(set.actualWeight) || 0;
                const reps = parseInt(set.actualReps) || 0;
                totalVolume += weight * reps;
              });
            }
          });
        }
        
        return {
          ...workout,
          period: format(parseISO(workout.date), 'dd.MM.yyyy', { locale: de }),
          workouts: 1,
          sets: totalSets,
          volume: totalVolume,
          type: 'workout'
        };
      });
      
      // Sort individual workouts
      return workoutData.sort((a, b) => {
        const getValue = (item) => {
          switch (sortBy) {
            case 'date': return parseISO(item.date);
            case 'workouts': return item.workouts;
            case 'volume': return item.volume;
            case 'sets': return item.sets;
            default: return parseISO(item.date);
          }
        };
        
        const aVal = getValue(a);
        const bVal = getValue(b);
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
  }, [filteredWorkouts, groupBy, sortBy, sortOrder, getDateRange]);

  const calculateExerciseProgression = useCallback((filteredHistory, allExercises, startDate, endDate) => {
    if (!filteredHistory || filteredHistory.length === 0) return {};
    if (!allExercises || !Array.isArray(allExercises)) return {};
  
    const progression = {};
    const exerciseDetails = {}; // Store details like sets, reps, weight over time
    const exerciseVolume = {}; // Store volume data

    // Initialize progression for all available exercises
    allExercises.forEach(ex => {
        progression[ex.name] = [];
        exerciseDetails[ex.name] = [];
        exerciseVolume[ex.name] = []; // Initialize volume data
    });
  
    // Sort history by date to process in chronological order
    const sortedHistory = [...filteredHistory].sort((a, b) => parseISO(a.date) - parseISO(b.date));
  
    sortedHistory.forEach(workout => {
      const workoutDate = parseISO(workout.date);
      if (workout.exercises && Array.isArray(workout.exercises)) {
        workout.exercises.forEach(ex => {
          if (!exerciseDetails[ex.name]) {
              exerciseDetails[ex.name] = [];
          }
          // Store details for each set for this exercise on this date
          if (ex.sets && Array.isArray(ex.sets)) {
            ex.sets.forEach(set => {
                exerciseDetails[ex.name].push({
                    date: workout.date, // Keep original date string for display if needed
                    parsedDate: workoutDate,
                    weight: parseFloat(set.weight) || 0,
                    reps: parseInt(set.reps) || 0,
                    isWarmup: set.isWarmup || false,
                });
            });
          }
          // Also check performedSets for more recent data structure
          if (ex.performedSets && Array.isArray(ex.performedSets)) {
            ex.performedSets.forEach(set => {
                exerciseDetails[ex.name].push({
                    date: workout.date, // Keep original date string for display if needed
                    parsedDate: workoutDate,
                    weight: parseFloat(set.actualWeight) || 0,
                    reps: parseInt(set.actualReps) || 0,
                    rpe: parseFloat(set.rpe) || null, // Handle RPE safely
                    isWarmup: set.isWarmup || false,
                });
            });
          }
        });
      }
    });

    Object.keys(exerciseDetails).forEach(exerciseName => {
        const entries = exerciseDetails[exerciseName]
            .filter(entry => !entry.isWarmup && entry.weight > 0 && entry.reps > 0) // Consider only work sets
            .sort((a, b) => a.parsedDate - b.parsedDate); // Sort by date again just in case

        if (entries.length === 0) {
            progression[exerciseName] = {
                labels: [],
                datasets: [{ label: 'Gewicht (kg)', data: [], borderColor: 'rgba(75, 192, 192, 1)', tension: 0.1 }],
                performanceChanges: []
            };
            return;
        }
        
        const labels = [];
        const weightData = [];
        const performanceChanges = [];
        let previousWorkoutPerformance = null;

        // Group by workout session (date) to average or take max for that day
        const workoutSessions = {};
        entries.forEach(entry => {
            const dateStr = format(entry.parsedDate, 'yyyy-MM-dd');
            if (!workoutSessions[dateStr]) {
                workoutSessions[dateStr] = {
                    date: entry.parsedDate,
                    weights: [],
                    reps: [],
                    totalVolume: 0, // weight * reps
                    maxWeight: 0,
                    sessionVolume: 0, // Volume for this session
                    estimated1RM: 0, // Estimated 1RM for this session
                    avgWeightForTargetReps: 0,
                    targetRepsMet: false,
                    avgRPE: 0, // Average RPE for this session
                    rpeReported: false // Flag if any RPE was reported for the session
                };
            }
            const volumeOfSet = entry.weight * entry.reps;
            workoutSessions[dateStr].weights.push(entry.weight);
            workoutSessions[dateStr].reps.push(entry.reps);
            workoutSessions[dateStr].totalVolume += volumeOfSet;
            workoutSessions[dateStr].maxWeight = Math.max(workoutSessions[dateStr].maxWeight, entry.weight);
            workoutSessions[dateStr].sessionVolume += volumeOfSet;

            // Calculate estimated 1RM for each set and find the max for the session
            // Using Epley formula: 1RM = weight * (1 + reps / 30)
            // Only calculate if reps > 0 to avoid division by zero or nonsensical 1RM
            if (entry.reps > 0) {
                const set1RM = entry.weight * (1 + entry.reps / 30);
                workoutSessions[dateStr].estimated1RM = Math.max(workoutSessions[dateStr].estimated1RM, set1RM);
            }

            // Calculate average weight for target reps (e.g., 8-12)
            const targetMinReps = 8;
            const targetMaxReps = 12;
            if (entry.reps >= targetMinReps && entry.reps <= targetMaxReps) {
                // This logic needs to be session-based, not entry-based for averaging
                // We will collect all weights for target reps in the session and average later
                if (!workoutSessions[dateStr].targetRepWeights) {
                    workoutSessions[dateStr].targetRepWeights = [];
                }
                workoutSessions[dateStr].targetRepWeights.push(entry.weight);
                workoutSessions[dateStr].targetRepsMet = true; 
            }

            // Collect RPE data
            if (entry.rpe !== undefined && entry.rpe !== null) {
                if (!workoutSessions[dateStr].rpeValues) {
                    workoutSessions[dateStr].rpeValues = [];
                }
                const rpeValue = parseFloat(entry.rpe);
                if (!isNaN(rpeValue)) {
                    workoutSessions[dateStr].rpeValues.push(rpeValue);
                    workoutSessions[dateStr].rpeReported = true;
                }
            }
        });
        
        const sortedSessions = Object.values(workoutSessions).sort((a,b) => a.date - b.date);
        const volumeLabels = [];
        const volumeDataset = [];
        const estimated1RMLabels = [];
        const estimated1RMDataset = [];
        const avgWeightLabels = [];
        const avgWeightDataset = [];
        const avgRPELabels = [];
        const avgRPEDataset = [];

        sortedSessions.forEach((session, index) => {
            labels.push(format(session.date, 'dd.MM.yy', { locale: de }));
            weightData.push(session.maxWeight);
            volumeLabels.push(format(session.date, 'dd.MM.yy', { locale: de }));
            volumeDataset.push(session.sessionVolume);
            estimated1RMLabels.push(format(session.date, 'dd.MM.yy', { locale: de }));
            estimated1RMDataset.push(session.estimated1RM > 0 ? parseFloat(session.estimated1RM.toFixed(1)) : 0);

            if (session.targetRepsMet && session.targetRepWeights && session.targetRepWeights.length > 0) {
                const avgWeight = session.targetRepWeights.reduce((sum, w) => sum + w, 0) / session.targetRepWeights.length;
                session.avgWeightForTargetReps = avgWeight;
                avgWeightLabels.push(format(session.date, 'dd.MM.yy', { locale: de }));
                avgWeightDataset.push(parseFloat(avgWeight.toFixed(1)));
            } else {
                // If no sets in target range, we can push null or 0, or skip the point
                // For now, let's ensure labels match, so push a value that won't be plotted or is clearly distinct
                 avgWeightLabels.push(format(session.date, 'dd.MM.yy', { locale: de }));
                 avgWeightDataset.push(null); // Chart.js can handle nulls by skipping points
            }

            // Calculate and store average RPE for the session
            if (session.rpeReported && session.rpeValues && session.rpeValues.length > 0) {
                const avgRPE = session.rpeValues.reduce((sum, rpe) => sum + rpe, 0) / session.rpeValues.length;
                session.avgRPE = avgRPE;
                avgRPELabels.push(format(session.date, 'dd.MM.yy', { locale: de }));
                avgRPEDataset.push(parseFloat(avgRPE.toFixed(1)));
            } else {
                avgRPELabels.push(format(session.date, 'dd.MM.yy', { locale: de }));
                avgRPEDataset.push(null); // Push null if no RPE data for this session
            }

            // Calculate performance change
            // Performance metric: sum of (weight * reps) for all work sets in that session for that exercise
            const currentPerformance = session.totalVolume;

            if (previousWorkoutPerformance !== null) {
                const change = ((currentPerformance - previousWorkoutPerformance) / previousWorkoutPerformance) * 100;
                performanceChanges.push({
                    date: format(session.date, 'dd.MM.yy', { locale: de }),
                    change: change.toFixed(1), // Percentage change
                    currentPerformance: currentPerformance,
                    previousPerformance: previousWorkoutPerformance,
                    maxWeight: session.maxWeight, // Added maxWeight for the session
                });
            } else {
                 performanceChanges.push({
                    date: format(session.date, 'dd.MM.yy', { locale: de }),
                    change: null, // No previous data
                    currentPerformance: currentPerformance,
                    previousPerformance: null,
                    maxWeight: session.maxWeight, // Added maxWeight for the session
                });
            }
            previousWorkoutPerformance = currentPerformance;
        });
  
        progression[exerciseName] = {
          labels,
          datasets: [
            {
              label: 'Maximales Gewicht (kg)',
              data: weightData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
              tension: 0.1,
              yAxisID: 'yWeight', // Assign to the first y-axis
            },
            // Conditionally add RPE dataset if there is data
            ...(avgRPEDataset.some(d => d !== null) ? [{
              label: 'Durchschnitts-RPE',
              data: avgRPEDataset,
              borderColor: 'rgba(255, 206, 86, 1)',
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              fill: false,
              tension: 0.1,
              yAxisID: 'yRPE', // Assign to the second y-axis
            }] : [])
          ],
          volumeData: { // Add volume data here
            labels: volumeLabels,
            datasets: [{
              label: 'Gesamtvolumen (kg)',
              data: volumeDataset,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              tension: 0.1,
            }]
          },
          estimated1RMData: { // Add 1RM data here
            labels: estimated1RMLabels,
            datasets: [{
              label: 'Geschätztes 1RM (kg)',
              data: estimated1RMDataset,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              fill: true,
              tension: 0.1,
            }]
          },
          avgWeightForTargetRepsData: { // Add average weight for target reps data
            labels: avgWeightLabels,
            datasets: [{
              label: `Avg. Gewicht (8-12 Wdh) (kg)`,
              data: avgWeightDataset,
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              fill: true,
              tension: 0.1,
              spanGaps: true, // Connect lines even if there are null data points
            }]
          },
          performanceChanges: performanceChanges.reverse(), // Show most recent first
        };
    });
  
    return progression;
  }, []);

  const processedData = useMemo(() => {
    console.log('[Analysis.js] workoutHistory received (first 2 entries if available):', workoutHistory.slice(0, 2).map(w => ({ id: w.id, date: w.date, name: w.name, exercisesCount: w.exercises?.length })) );
    if (!workoutHistory || workoutHistory.length === 0) return null;

    const { start: startDate, end: endDate } = getDateRange(); // Destructure for clarity in logging
    console.log('[Analysis.js] Date range for filtering: startDate:', startDate, 'endDate:', endDate);
    const filteredHistory = workoutHistory.filter(workout => {
      try {
        const workoutDate = parseISO(workout.date);
        // Log each workout date and the result of the check
        const isInInterval = isWithinInterval(workoutDate, { start: startDate, end: endDate });
        console.log(`[Analysis.js] Checking workout: ID=${workout.id}, Date=${workout.date}, ParsedDate=${workoutDate}, IsInInterval=${isInInterval}`);
        return isInInterval;
      } catch (e) {
        console.error(`[Analysis.js] Error parsing date for workout ID ${workout.id}, Date: ${workout.date}`, e);
        return false;
      }
    });
    console.log('[Analysis.js] filteredHistory after detailed check:', filteredHistory.map(w => ({ id: w.id, date: w.date, name: w.name })) );

    if (filteredHistory.length === 0) {
      console.log('[Analysis.js] No workouts in filteredHistory, returning basic structure.');
      return { weeklyTotalSetsData: null, weeklyMuscleGroupData: null, exerciseProgressData: null, overallStats: null, allMuscleGroups: getAllMuscleGroups(MUSCLE_GROUP_WEIGHTS) };
    }

    const weeklyData = {};
    const allMuscleGroups = getAllMuscleGroups(MUSCLE_GROUP_WEIGHTS);
    console.log('[Analysis.js] All muscle groups:', allMuscleGroups);
    
    const initialMuscleGroupSets = Object.fromEntries(allMuscleGroups.map(mg => [mg, 0]));
    const initialMuscleGroupVolume = Object.fromEntries(allMuscleGroups.map(mg => [mg, 0])); // For volume
    const initialMuscleGroupHardSets = Object.fromEntries(allMuscleGroups.map(mg => [mg, 0])); // For hard sets
    const muscleGroupTrainingDays = Object.fromEntries(allMuscleGroups.map(mg => [mg, new Set()])); // For training frequency
    
    console.log('[Analysis.js] Initialized muscleGroupTrainingDays keys:', Object.keys(muscleGroupTrainingDays));

    // Initialize weekly data structure
    const weeksInInterval = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 /* Monday */ });
    weeksInInterval.forEach(weekStart => {
      const weekLabel = format(weekStart, 'dd.MM.yy', { locale: de });
      weeklyData[weekLabel] = {
        totalSets: 0,
        muscleGroupSets: { ...initialMuscleGroupSets },
        muscleGroupVolume: { ...initialMuscleGroupVolume }, // Initialize volume storage
        muscleGroupHardSets: { ...initialMuscleGroupHardSets }, // Initialize hard sets storage
        dateRange: {
          start: weekStart,
          end: endOfWeek(weekStart, { weekStartsOn: 1 }),
        },
      };
    });
    console.log('[Analysis.js] Initialized weeklyData structure:', JSON.parse(JSON.stringify(weeklyData)));
    
    filteredHistory.forEach(workout => {
      console.log('[Analysis.js] Processing workout:', workout);
      const workoutDate = parseISO(workout.date);
      const weekStartForWorkout = startOfWeek(workoutDate, { weekStartsOn: 1 });
      const weekLabel = format(weekStartForWorkout, 'dd.MM.yy', { locale: de });

      if (weeklyData[weekLabel]) {
        console.log(`[Analysis.js] Workout ${workout.id} maps to week ${weekLabel}`);
        workout.exercises.forEach(ex => {
          console.log(`[Analysis.js] Processing exercise in workout:`, ex);
          const sets = ex.performedSets ? ex.performedSets.length : 0;
          console.log(`[Analysis.js] Exercise ${ex.name} has ${sets} performedSets.`);
          weeklyData[weekLabel].totalSets += sets;

          // Calculate total volume and hard sets for the exercise in this workout
          let exerciseTotalVolumeInWorkout = 0;
          let exerciseTotalHardSetsInWorkout = 0;
          if (ex.performedSets && Array.isArray(ex.performedSets)) {
            ex.performedSets.forEach(set => {
              const reps = parseInt(set.actualReps) || 0;
              const weight = parseFloat(set.actualWeight) || 0;
              const rpe = parseFloat(set.rpe);
              if (!set.isWarmup) { // Only count volume for non-warmup sets
                exerciseTotalVolumeInWorkout += reps * weight;
                if (rpe !== undefined && !isNaN(rpe) && rpe >= 9) { // RPE >= 9 counts as a hard set
                    exerciseTotalHardSetsInWorkout += 1;
                }
              }
            });
          }

          // Improved exercise matching with fallback for similar names
          const getExerciseMuscleWeights = (exerciseName) => {
            // Direct match first
            if (MUSCLE_GROUP_WEIGHTS[exerciseName]) {
              return MUSCLE_GROUP_WEIGHTS[exerciseName];
            }
            
            // Try to find similar exercise names (fuzzy matching)
            const exerciseKeys = Object.keys(MUSCLE_GROUP_WEIGHTS);
            const similarExercise = exerciseKeys.find(key => {
              const keyLower = key.toLowerCase();
              const nameLower = exerciseName.toLowerCase();
              
              // Check if either contains the other (partial match)
              return keyLower.includes(nameLower) || nameLower.includes(keyLower) ||
                     // Check for common abbreviations or variations
                     (keyLower.includes('bankdrücken') && nameLower.includes('bankdrücken')) ||
                     (keyLower.includes('klimmzug') && nameLower.includes('klimmzug')) ||
                     (keyLower.includes('kniebeuge') && nameLower.includes('kniebeuge')) ||
                     (keyLower.includes('kreuzheben') && nameLower.includes('kreuzheben')) ||
                     (keyLower.includes('rudern') && nameLower.includes('rudern')) ||
                     (keyLower.includes('seitheben') && nameLower.includes('seitheben')) ||
                     (keyLower.includes('bizepscurl') && nameLower.includes('curl')) ||
                     (keyLower.includes('trizepsdrücken') && nameLower.includes('trizeps'));
            });
            
            if (similarExercise) {
              console.log(`🔍 Found similar exercise: "${exerciseName}" matched to "${similarExercise}"`);
              return MUSCLE_GROUP_WEIGHTS[similarExercise];
            }
            
            return {};
          };
          
          const exerciseMuscleWeights = getExerciseMuscleWeights(ex.name);
          if (Object.keys(exerciseMuscleWeights).length > 0) {
            Object.entries(exerciseMuscleWeights).forEach(([muscle, weightFactor]) => {
              if (weeklyData[weekLabel].muscleGroupSets[muscle] !== undefined) {
                weeklyData[weekLabel].muscleGroupSets[muscle] += sets * weightFactor;
                weeklyData[weekLabel].muscleGroupVolume[muscle] += exerciseTotalVolumeInWorkout * weightFactor; // Distribute volume
                weeklyData[weekLabel].muscleGroupHardSets[muscle] += exerciseTotalHardSetsInWorkout * weightFactor; // Distribute hard sets
              } else {
                // This case should ideally not happen if allMuscleGroups is comprehensive
                console.warn(`Muscle group ${muscle} not initialized for week ${weekLabel}`);
                weeklyData[weekLabel].muscleGroupSets[muscle] = sets * weightFactor; 
                weeklyData[weekLabel].muscleGroupVolume[muscle] = exerciseTotalVolumeInWorkout * weightFactor;
                weeklyData[weekLabel].muscleGroupHardSets[muscle] = exerciseTotalHardSetsInWorkout * weightFactor;
              }
            });
          } else {
            // Fallback for exercises not in MUSCLE_GROUP_WEIGHTS or single-muscle exercises
            const primaryMuscleGroup = ex.muscleGroup || 'Unbekannt'; // Assuming ex.muscleGroup exists
            if (allMuscleGroups.includes(primaryMuscleGroup)) {
                 if (weeklyData[weekLabel].muscleGroupSets[primaryMuscleGroup] !== undefined) {
                    weeklyData[weekLabel].muscleGroupSets[primaryMuscleGroup] += sets;
                    weeklyData[weekLabel].muscleGroupVolume[primaryMuscleGroup] += exerciseTotalVolumeInWorkout;
                    weeklyData[weekLabel].muscleGroupHardSets[primaryMuscleGroup] += exerciseTotalHardSetsInWorkout;
                } else {
                    weeklyData[weekLabel].muscleGroupSets[primaryMuscleGroup] = sets;
                    weeklyData[weekLabel].muscleGroupVolume[primaryMuscleGroup] = exerciseTotalVolumeInWorkout;
                    weeklyData[weekLabel].muscleGroupHardSets[primaryMuscleGroup] = exerciseTotalHardSetsInWorkout;
                }
            } else if (primaryMuscleGroup !== 'Unbekannt') {
                 const groups = primaryMuscleGroup.split(/, | und /);
                 groups.forEach(g => {
                     const trimmedGroup = g.trim();
                     if (allMuscleGroups.includes(trimmedGroup)) {
                         if (weeklyData[weekLabel].muscleGroupSets[trimmedGroup] !== undefined) {
                            weeklyData[weekLabel].muscleGroupSets[trimmedGroup] += sets / groups.length; // Distribute sets
                            weeklyData[weekLabel].muscleGroupVolume[trimmedGroup] += exerciseTotalVolumeInWorkout / groups.length; // Distribute volume
                            weeklyData[weekLabel].muscleGroupHardSets[trimmedGroup] += exerciseTotalHardSetsInWorkout / groups.length; // Distribute hard sets
                        } else {
                            weeklyData[weekLabel].muscleGroupSets[trimmedGroup] = sets / groups.length;
                            weeklyData[weekLabel].muscleGroupVolume[trimmedGroup] = exerciseTotalVolumeInWorkout / groups.length;
                            weeklyData[weekLabel].muscleGroupHardSets[trimmedGroup] = exerciseTotalHardSetsInWorkout / groups.length;
                        }
                     } else {
                         console.warn(`Unknown primary muscle group part: ${trimmedGroup} for exercise ${ex.name}`);
                     }
                 });
            } else {
                console.warn(`Exercise ${ex.name} not found in MUSCLE_GROUP_WEIGHTS and no primary muscle group specified or recognized.`);
                 if (weeklyData[weekLabel].muscleGroupSets['Unbekannt'] !== undefined) {
                    weeklyData[weekLabel].muscleGroupSets['Unbekannt'] += sets;
                    weeklyData[weekLabel].muscleGroupVolume['Unbekannt'] += exerciseTotalVolumeInWorkout;
                    weeklyData[weekLabel].muscleGroupHardSets['Unbekannt'] += exerciseTotalHardSetsInWorkout;
                } else {
                    weeklyData[weekLabel].muscleGroupSets['Unbekannt'] = sets;
                    weeklyData[weekLabel].muscleGroupVolume['Unbekannt'] = exerciseTotalVolumeInWorkout;
                    weeklyData[weekLabel].muscleGroupHardSets['Unbekannt'] = exerciseTotalHardSetsInWorkout;
                }
            }
          }

          // Update training days for frequency calculation (overall, not weekly here)
          const workoutDateForFrequency = format(parseISO(workout.date), 'yyyy-MM-dd');
          if (Object.keys(exerciseMuscleWeights).length > 0) {
            Object.keys(exerciseMuscleWeights).forEach(muscle => {
              console.log(`[Analysis.js] Processing muscle group: ${muscle} for exercise ${ex.name}`);
              if (allMuscleGroups.includes(muscle)) {
                // Defensive check to ensure the Set exists
                if (!muscleGroupTrainingDays[muscle]) {
                  console.warn(`[Analysis.js] Creating missing Set for muscle group: ${muscle}`);
                  muscleGroupTrainingDays[muscle] = new Set();
                }
                muscleGroupTrainingDays[muscle].add(workoutDateForFrequency);
              } else {
                console.warn(`[Analysis.js] Muscle group ${muscle} not found in allMuscleGroups for exercise ${ex.name}`);
              }
            });
          } else {
            const primaryMuscleGroup = ex.muscleGroup || 'Unbekannt';
            console.log(`[Analysis.js] Processing primary muscle group: ${primaryMuscleGroup} for exercise ${ex.name}`);
            if (allMuscleGroups.includes(primaryMuscleGroup)) {
              // Defensive check to ensure the Set exists
              if (!muscleGroupTrainingDays[primaryMuscleGroup]) {
                console.warn(`[Analysis.js] Creating missing Set for primary muscle group: ${primaryMuscleGroup}`);
                muscleGroupTrainingDays[primaryMuscleGroup] = new Set();
              }
              muscleGroupTrainingDays[primaryMuscleGroup].add(workoutDateForFrequency);
            } else if (primaryMuscleGroup !== 'Unbekannt') {
              const groups = primaryMuscleGroup.split(/, | und /);
              groups.forEach(g => {
                const trimmedGroup = g.trim();
                console.log(`[Analysis.js] Processing split muscle group: ${trimmedGroup} for exercise ${ex.name}`);
                if (allMuscleGroups.includes(trimmedGroup)) {
                  // Defensive check to ensure the Set exists
                  if (!muscleGroupTrainingDays[trimmedGroup]) {
                    console.warn(`[Analysis.js] Creating missing Set for split muscle group: ${trimmedGroup}`);
                    muscleGroupTrainingDays[trimmedGroup] = new Set();
                  }
                  muscleGroupTrainingDays[trimmedGroup].add(workoutDateForFrequency);
                } else {
                  console.warn(`[Analysis.js] Split muscle group ${trimmedGroup} not found in allMuscleGroups for exercise ${ex.name}`);
                }
              });
            } else {
              // Defensive check to ensure the Set exists
              if (!muscleGroupTrainingDays['Unbekannt']) {
                console.warn(`[Analysis.js] Creating missing Set for Unbekannt muscle group`);
                muscleGroupTrainingDays['Unbekannt'] = new Set();
              }
              muscleGroupTrainingDays['Unbekannt'].add(workoutDateForFrequency);
            }
          }
        });
      }
    });
    console.log('[Analysis.js] weeklyData after processing all filtered workouts:', JSON.parse(JSON.stringify(weeklyData)));

    const weekLabels = Object.keys(weeklyData).sort((a, b) => {
      const dateA = weeklyData[a].dateRange.start;
      const dateB = weeklyData[b].dateRange.start;
      return dateA - dateB;
    });
    
    const weeklyTotalSetsData = {
      labels: weekLabels,
      datasets: [{
        label: 'Totale wöchentliche Sätze',
        data: weekLabels.map(label => weeklyData[label].totalSets),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };

    const weeklyMuscleGroupData = {
      labels: weekLabels,
      datasets: allMuscleGroups.map((mg, index) => ({
        label: mg,
        data: weekLabels.map(label => weeklyData[label].muscleGroupSets[mg] || 0),
        // You might want to define a color palette for muscle groups
        backgroundColor: `hsl(${(index * 360 / allMuscleGroups.length)}, 70%, 60%)`, 
        borderColor: `hsl(${(index * 360 / allMuscleGroups.length)}, 70%, 40%)`,
        borderWidth: 1,
        stack: 'muscleGroupStack', // To stack bars for the same week
      })).filter(dataset => dataset.data.some(d => d > 0)), // Only include datasets with data
    };

    const weeklyMuscleGroupVolumeData = { // New data structure for volume
      labels: weekLabels,
      datasets: allMuscleGroups.map((mg, index) => ({
        label: mg,
        data: weekLabels.map(label => Math.round(weeklyData[label].muscleGroupVolume[mg] || 0)),
        backgroundColor: `hsl(${(index * 360 / allMuscleGroups.length)}, 70%, 70%)`, // Slightly different color for volume
        borderColor: `hsl(${(index * 360 / allMuscleGroups.length)}, 70%, 50%)`,
        borderWidth: 1,
        stack: 'muscleGroupVolumeStack',
      })).filter(dataset => dataset.data.some(d => d > 0)),
    };

    const weeklyMuscleGroupHardSetsData = { // New data structure for hard sets
      labels: weekLabels,
      datasets: allMuscleGroups.map((mg, index) => ({
        label: mg,
        data: weekLabels.map(label => Math.round(weeklyData[label].muscleGroupHardSets[mg] || 0)),
        backgroundColor: `hsl(${(index * 360 / allMuscleGroups.length)}, 80%, 65%)`, // Different color scheme for hard sets
        borderColor: `hsl(${(index * 360 / allMuscleGroups.length)}, 80%, 45%)`,
        borderWidth: 1,
        stack: 'muscleGroupHardSetsStack',
      })).filter(dataset => dataset.data.some(d => d > 0)),
    };
    
    const trainingFrequencyData = Object.entries(muscleGroupTrainingDays)
      .map(([muscle, daysSet]) => ({ 
        muscle, 
        frequency: daysSet ? daysSet.size : 0 // Handle undefined daysSet
      }))
      .filter(item => item.frequency > 0)
      .sort((a, b) => b.frequency - a.frequency);
    
    // Placeholder for overall stats - to be implemented
    const overallStats = {
      totalWorkouts: filteredHistory.length,
      // ... more stats
    };

    // Placeholder for exercise progression - to be implemented
    const exerciseProgressData = calculateExerciseProgression(filteredHistory, exercises, startDate, endDate);

    return { weeklyTotalSetsData, weeklyMuscleGroupData, weeklyMuscleGroupVolumeData, weeklyMuscleGroupHardSetsData, trainingFrequencyData, exerciseProgressData, overallStats, allMuscleGroups };
  }, [workoutHistory, getDateRange, exercises, calculateExerciseProgression]);

  // Memoize exercise options to prevent re-calculation on every render
  const exerciseOptions = useMemo(() => {
    if (!exercises || exercises.length === 0) return [{ value: 'all', label: 'Alle Übungen' }];
    const uniqueExercises = Array.from(new Set(exercises.map(ex => ex.name)))
                                 .sort((a,b) => a.localeCompare(b));
    const filtered = uniqueExercises.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return [{ value: 'all', label: 'Wähle eine Übung' }, ...filtered.map(name => ({ value: name, label: name }))];
  }, [exercises, searchTerm]); // Added searchTerm dependency

  // Body measurement handlers (from ProgressTracking)
  const TRACK_BODY_MEASUREMENT = 'TRACK_BODY_MEASUREMENT'; // Action Type

  const handleBodyMeasurementChange = (field, value) => {
    setBodyMeasurement(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleBodyMeasurementSubmit = () => {
    // Basic validation
    if (!bodyMeasurement.date || !bodyMeasurement.weight) {
        alert("Datum und Gewicht sind Pflichtfelder für Körpermessungen.");
        return;
    }
    const measurementRecord = {
      id: uuidv4(),
      ...bodyMeasurement, // date is already part of bodyMeasurement state
      // Ensure numeric fields are stored as numbers if possible, or handle during display/processing
      weight: parseFloat(bodyMeasurement.weight) || null,
      bodyFat: parseFloat(bodyMeasurement.bodyFat) || null,
      chest: parseFloat(bodyMeasurement.chest) || null,
      waist: parseFloat(bodyMeasurement.waist) || null,
      hips: parseFloat(bodyMeasurement.hips) || null,
      biceps: parseFloat(bodyMeasurement.biceps) || null,
      thighs: parseFloat(bodyMeasurement.thighs) || null,
    };
    
    dispatch({
      type: TRACK_BODY_MEASUREMENT,
      payload: measurementRecord,
    });
    
    // Reset form
    setBodyMeasurement({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: '',
      bodyFat: '',
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      thighs: '',
    });
    alert("Körpermessung gespeichert!");
  };

  const renderOverviewTab = () => (
    <>
      <StatsGrid>
        <StatCard>
          <StatValue>{processedData?.overallStats?.totalWorkouts ?? 0}</StatValue>
          <StatLabel>Workouts in Zeitraum</StatLabel>
        </StatCard>
        {/* Add more StatCards here later, e.g. total sets, total volume */}
      </StatsGrid>
      <ChartsGrid>
        {processedData?.weeklyTotalSetsData && processedData.weeklyTotalSetsData.labels.length > 0 ? (
          <ChartCard>
            <ChartTitle>Totale wöchentliche Sätze</ChartTitle>
            <ChartContainer>
              <Bar data={processedData.weeklyTotalSetsData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Anzahl Sätze'} } } }} />
            </ChartContainer>
          </ChartCard>
        ) : (
          <ChartCard><ChartTitle>Totale wöchentliche Sätze</ChartTitle><NoDataMessage>Nicht genügend Daten für wöchentliche Satzanalyse.</NoDataMessage></ChartCard>
        )}

        {processedData?.weeklyMuscleGroupData && processedData.weeklyMuscleGroupData.labels.length > 0 && processedData.weeklyMuscleGroupData.datasets.length > 0 ? (
          <ChartCard>
            <ChartTitle>Wöchentliche Sätze pro Muskelgruppe</ChartTitle>
            <ChartContainer>
              <Bar 
                data={processedData.weeklyMuscleGroupData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  scales: { 
                    x: { stacked: true }, 
                    y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Anzahl Sätze'} } 
                  },
                  plugins: {
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    },
                    legend: {
                       position: 'bottom',
                       labels: {
                          boxWidth: 20,
                          padding: 15,
                       }
                    }
                  }
                }} 
              />
            </ChartContainer>
          </ChartCard>
        ) : (
          <ChartCard><ChartTitle>Wöchentliche Sätze pro Muskelgruppe</ChartTitle><NoDataMessage>Nicht genügend Daten für Muskelgruppenanalyse.</NoDataMessage></ChartCard>
        )}
      </ChartsGrid>
      <ChartsGrid> {/* New Grid for Volume Chart */}
        {processedData?.weeklyMuscleGroupVolumeData && processedData.weeklyMuscleGroupVolumeData.labels.length > 0 && processedData.weeklyMuscleGroupVolumeData.datasets.length > 0 ? (
          <ChartCard>
            <ChartTitle>Wöchentliches Volumen pro Muskelgruppe</ChartTitle>
            <ChartContainer>
              <Bar 
                data={processedData.weeklyMuscleGroupVolumeData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  scales: { 
                    x: { stacked: true }, 
                    y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Volumen (kg)'} } 
                  },
                  plugins: {
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                       callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed.y !== null) {
                            label += context.parsed.y + ' kg';
                          }
                          return label;
                        }
                      }
                    },
                    legend: {
                       position: 'bottom',
                       labels: {
                          boxWidth: 20,
                          padding: 15,
                       }
                    }
                  }
                }} 
              />
            </ChartContainer>
          </ChartCard>
        ) : (
          <ChartCard><ChartTitle>Wöchentliches Volumen pro Muskelgruppe</ChartTitle><NoDataMessage>Nicht genügend Daten für Muskelgruppen-Volumenanalyse.</NoDataMessage></ChartCard>
        )}
      </ChartsGrid>
      <ChartsGrid> {/* New Grid for Hard Sets Chart */}
        {processedData?.weeklyMuscleGroupHardSetsData && processedData.weeklyMuscleGroupHardSetsData.labels.length > 0 && processedData.weeklyMuscleGroupHardSetsData.datasets.length > 0 ? (
          <ChartCard>
            <ChartTitle>Wöchentliche Sätze bis zum Versagen (RPE ≥ 9) pro Muskelgruppe</ChartTitle>
            <ChartContainer>
              <Bar 
                data={processedData.weeklyMuscleGroupHardSetsData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  scales: { 
                    x: { stacked: true }, 
                    y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Anzahl Sätze (RPE ≥ 9)'} } 
                  },
                  plugins: {
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                       callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed.y !== null) {
                            label += context.parsed.y + ' Sätze';
                          }
                          return label;
                        }
                      }
                    },
                    legend: {
                       position: 'bottom',
                       labels: {
                          boxWidth: 20,
                          padding: 15,
                       }
                    }
                  }
                }} 
              />
            </ChartContainer>
          </ChartCard>
        ) : (
          <ChartCard><ChartTitle>Wöchentliche Sätze bis zum Versagen (RPE ≥ 9) pro Muskelgruppe</ChartTitle><NoDataMessage>Nicht genügend Daten für Analyse der Sätze bis zum Versagen.</NoDataMessage></ChartCard>
        )}
      </ChartsGrid>

      {processedData?.trainingFrequencyData && processedData.trainingFrequencyData.length > 0 && (
        <ChartCard style={{marginTop: '30px'}}>
          <ChartTitle>Trainingsfrequenz pro Muskelgruppe (im Zeitraum)</ChartTitle>
          <Table>
            <thead>
              <tr>
                <th>Muskelgruppe</th>
                <th>Trainingstage</th>
              </tr>
            </thead>
            <tbody>
              {processedData.trainingFrequencyData.map(item => (
                <tr key={item.muscle}>
                  <td>{item.muscle}</td>
                  <td>{item.frequency}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ChartCard>
      )}

      {/* Sortierte Trainingsübersicht */}
      <ChartCard style={{marginTop: '30px'}}>
        <ChartTitle>
          {groupBy === 'weekly' ? 'Wöchentliche Trainingsübersicht' : 'Trainingseinheiten'}
          {' '}- Sortiert nach {
            sortBy === 'date' ? 'Datum' :
            sortBy === 'workouts' ? 'Trainingsanzahl' :
            sortBy === 'volume' ? 'Volumen' :
            sortBy === 'sets' ? 'Sätzen' : 'Datum'
          } ({sortOrder === 'asc' ? 'aufsteigend' : 'absteigend'})
        </ChartTitle>
        {sortedAndGroupedData && sortedAndGroupedData.length > 0 ? (
          <div style={{overflowX: 'auto'}}>
            <Table>
              <thead>
                <tr>
                  <th>{groupBy === 'weekly' ? 'Woche' : 'Datum'}</th>
                  <th>Trainings</th>
                  <th>Sätze</th>
                  <th>Volumen (kg)</th>
                  {groupBy === 'individual' && <th>Ø Volumen pro Satz</th>}
                </tr>
              </thead>
              <tbody>
                {sortedAndGroupedData.map((item, index) => (
                  <tr key={`${item.type}-${index}`}>
                    <td>{item.period}</td>
                    <td>{item.workouts}</td>
                    <td>{item.sets}</td>
                    <td>{item.volume.toFixed(1)}</td>
                    {groupBy === 'individual' && (
                      <td>{item.sets > 0 ? (item.volume / item.sets).toFixed(1) : '0.0'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <NoDataMessage>Keine Trainingsdaten für die gewählten Kriterien verfügbar.</NoDataMessage>
        )}
      </ChartCard>
    </>
  );

  const renderProgressionTab = () => {
    const selectedExerciseData = processedData?.exerciseProgressData?.[selectedExercise];
    const noDataForSelectedExercise = selectedExercise !== 'all' && (!selectedExerciseData || selectedExerciseData.labels.length === 0);
    const selectedExerciseVolumeData = processedData?.exerciseProgressData?.[selectedExercise]?.volumeData;
    const selectedExercise1RMData = processedData?.exerciseProgressData?.[selectedExercise]?.estimated1RMData;
    const selectedExerciseAvgWeightData = processedData?.exerciseProgressData?.[selectedExercise]?.avgWeightForTargetRepsData;

    return (
      <>
        <FilterContainer style={{ marginBottom: '25px', marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Input 
            type="text"
            placeholder="Übung suchen..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ marginBottom: '10px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', width: '100%', maxWidth: '400px' }}
          />
          <Select value={selectedExercise} onChange={e => setSelectedExercise(e.target.value)} style={{ width: '100%', maxWidth: '400px'}}>
            {exerciseOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </Select>
        </FilterContainer>

        {selectedExercise === 'all' && (
          <NoDataMessage>Bitte wähle eine Übung aus, um den Fortschritt anzuzeigen.</NoDataMessage>
        )}
        
        {noDataForSelectedExercise && (
             <NoDataMessage>Keine ausreichenden Trainingsdaten für {selectedExercise} im gewählten Zeitraum, um den Fortschritt darzustellen.</NoDataMessage>
        )}

        {selectedExercise !== 'all' && selectedExerciseData && selectedExerciseData.labels.length > 0 && (
          <>
            <ChartCard style={{ marginBottom: '30px' }}>
              <ChartTitle>Gewichtsentwicklung: {selectedExercise}</ChartTitle>
              <ChartContainer>
                <Line 
                  data={selectedExerciseData} 
                  options={{ 
                      responsive: true, 
                      maintainAspectRatio: false, 
                      scales: {
                        yWeight: { // First y-axis for weight
                          type: 'linear',
                          display: true,
                          position: 'left',
                          beginAtZero: false,
                          title: {
                            display: true,
                            text: 'Gewicht (kg)'
                          }
                        },
                        yRPE: { // Second y-axis for RPE
                          type: 'linear',
                          display: selectedExerciseData?.datasets.some(ds => ds.yAxisID === 'yRPE'),
                          position: 'right',
                          min: 0, // Assuming RPE scale starts at 0 or 1
                          max: 10, // Assuming RPE scale ends at 10
                          title: {
                            display: true,
                            text: 'RPE'
                          },
                          grid: {
                            drawOnChartArea: false, // Only RPE axis line, not grid lines
                          },
                        }
                      },
                      plugins: { legend: { display: true, position: 'top'} }
                  }} />
              </ChartContainer>
            </ChartCard>
            
            {selectedExerciseVolumeData && selectedExerciseVolumeData.labels.length > 0 && (
              <ChartCard style={{ marginBottom: '30px' }}>
                <ChartTitle>Gesamtvolumen: {selectedExercise}</ChartTitle>
                <ChartContainer>
                  <Line 
                    data={selectedExerciseVolumeData} 
                    options={{ 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        scales: { y: { beginAtZero: true, title: {display: true, text: 'Volumen (kg)'} } },
                        plugins: { legend: { display: true, position: 'top'} }
                    }} 
                  />
                </ChartContainer>
              </ChartCard>
            )}

            {selectedExercise1RMData && selectedExercise1RMData.labels.length > 0 && (
              <ChartCard style={{ marginBottom: '30px' }}>
                <ChartTitle>Geschätztes 1RM: {selectedExercise}</ChartTitle>
                <ChartContainer>
                  <Line 
                    data={selectedExercise1RMData} 
                    options={{ 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        scales: { y: { beginAtZero: false, title: {display: true, text: 'Geschätztes 1RM (kg)'} } },
                        plugins: { legend: { display: true, position: 'top'} }
                    }} 
                  />
                </ChartContainer>
              </ChartCard>
            )}

            {selectedExerciseAvgWeightData && selectedExerciseAvgWeightData.labels.length > 0 && (
              <ChartCard style={{ marginBottom: '30px' }}>
                <ChartTitle>Durchschnittsgewicht (8-12 Wdh.): {selectedExercise}</ChartTitle>
                <ChartContainer>
                  <Line 
                    data={selectedExerciseAvgWeightData} 
                    options={{ 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        scales: { y: { beginAtZero: false, title: {display: true, text: 'Avg. Gewicht (kg)'} } },
                        plugins: { legend: { display: true, position: 'top'} }
                    }} 
                  />
                </ChartContainer>
              </ChartCard>
            )}

            <ChartTitle style={{fontSize: '1.4rem', marginBottom: '15px'}}>Leistungsänderung: {selectedExercise}</ChartTitle>
            {selectedExerciseData.performanceChanges && selectedExerciseData.performanceChanges.length > 0 ? (
                selectedExerciseData.performanceChanges.map((pc, index) => (
                    <ExerciseProgressCard key={index} positive={pc.change !== null ? parseFloat(pc.change) > 0 : null}>
                        <ExerciseProgressHeader>
                            <ExerciseName>{pc.date}</ExerciseName>
                            {pc.change !== null ? (
                                <ProgressBadge positive={parseFloat(pc.change) > 0}>
                                    {parseFloat(pc.change) > 0 ? '▲' : '▼'} {Math.abs(pc.change)}%
                                </ProgressBadge>
                            ) : (
                                <ProgressBadge>Keine Vorherigen Daten</ProgressBadge>
                            )}
                        </ExerciseProgressHeader>
                        <p style={{margin: '5px 0', fontSize: '0.95rem'}}>Aktuelle Leistung (Volumen): {pc.currentPerformance.toFixed(0)}</p>
                        {pc.previousPerformance !== null && <p style={{margin: '5px 0', fontSize: '0.9rem', opacity: 0.8}}>Vorherige Leistung: {pc.previousPerformance.toFixed(0)}</p>}
                        {pc.maxWeight > 0 && <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#555'}}>Maximalgewicht in Session: {pc.maxWeight}kg</p>}
                    </ExerciseProgressCard>
                ))
            ) : (
                <NoDataMessage>Keine Daten zur Leistungsänderung für {selectedExercise} verfügbar.</NoDataMessage>
            )}
          </>
        )}
      </>
    );
  };

  // Render Body Measurements Tab (adapted from ProgressTracking.js)
  const renderBodyMeasurementsTab = () => {
    const sortedBodyMeasurements = [...bodyMeasurements].sort((a, b) => parseISO(b.date) - parseISO(a.date));
    
    return (
      <ChartCard> {/* Using ChartCard for consistent styling, can be renamed or a new generic card can be made */}
        <ChartTitle>Körpermessungen</ChartTitle>

        {bodyMeasurementChartData.weightData && bodyMeasurementChartData.weightData.datasets[0].data.some(d => d !== null) && (
          <ChartCard style={{ marginTop: '20px', marginBottom: '30px' }}>
            <ChartTitle style={{ fontSize: '1.1rem' }}>Körpergewicht Entwicklung</ChartTitle>
            <ChartContainer style={{ height: '250px' }}>
              <Line 
                data={bodyMeasurementChartData.weightData} 
                options={{
                  responsive: true, maintainAspectRatio: false, 
                  scales: { y: { beginAtZero: false, title: {display: true, text: 'Gewicht (kg)'} } },
                  plugins: { legend: { display: true, position: 'top' } }
                }}
              />
            </ChartContainer>
          </ChartCard>
        )}

        {bodyMeasurementChartData.circumferenceData && bodyMeasurementChartData.circumferenceData.datasets.length > 0 && (
          <ChartCard style={{ marginBottom: '30px' }}>
            <ChartTitle style={{ fontSize: '1.1rem' }}>Umfänge Entwicklung</ChartTitle>
            <ChartContainer style={{ height: '300px' }}>
              <Line 
                data={bodyMeasurementChartData.circumferenceData} 
                options={{
                  responsive: true, maintainAspectRatio: false, 
                  scales: { y: { beginAtZero: false, title: {display: true, text: 'Umfang (cm)'} } },
                  plugins: { legend: { display: true, position: 'top' } }
                }}
              />
            </ChartContainer>
          </ChartCard>
        )}

        <h3 style={{marginTop: '20px', marginBottom: '10px', fontSize: '1.1rem'}}>Neue Messung eintragen</h3>
        <FormGrid>
          <FormGroup>
            <Label htmlFor="bmDate">Datum</Label>
            <Input
              id="bmDate"
              type="date"
              value={bodyMeasurement.date}
              onChange={(e) => handleBodyMeasurementChange('date', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bmWeight">Gewicht (kg)</Label>
            <Input
              id="bmWeight"
              type="number"
              step="0.1"
              placeholder="z.B. 70.5"
              value={bodyMeasurement.weight}
              onChange={(e) => handleBodyMeasurementChange('weight', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bmBodyFat">Körperfett (%)</Label>
            <Input
              id="bmBodyFat"
              type="number"
              step="0.1"
              placeholder="z.B. 15.2"
              value={bodyMeasurement.bodyFat}
              onChange={(e) => handleBodyMeasurementChange('bodyFat', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bmChest">Brustumfang (cm)</Label>
            <Input
              id="bmChest"
              type="number"
              step="0.1"
              placeholder="z.B. 100"
              value={bodyMeasurement.chest}
              onChange={(e) => handleBodyMeasurementChange('chest', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bmWaist">Taillenumfang (cm)</Label>
            <Input
              id="bmWaist"
              type="number"
              step="0.1"
              placeholder="z.B. 80"
              value={bodyMeasurement.waist}
              onChange={(e) => handleBodyMeasurementChange('waist', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bmHips">Hüftumfang (cm)</Label>
            <Input
              id="bmHips"
              type="number"
              step="0.1"
              placeholder="z.B. 95"
              value={bodyMeasurement.hips}
              onChange={(e) => handleBodyMeasurementChange('hips', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bmBiceps">Bizeps (cm)</Label>
            <Input
              id="bmBiceps"
              type="number"
              step="0.1"
              placeholder="z.B. 35"
              value={bodyMeasurement.biceps}
              onChange={(e) => handleBodyMeasurementChange('biceps', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bmThighs">Oberschenkel (cm)</Label>
            <Input
              id="bmThighs"
              type="number"
              step="0.1"
              placeholder="z.B. 60"
              value={bodyMeasurement.thighs}
              onChange={(e) => handleBodyMeasurementChange('thighs', e.target.value)}
            />
          </FormGroup>
        </FormGrid>
        <Button onClick={handleBodyMeasurementSubmit} style={{marginBottom: '30px'}}>Messung Speichern</Button>

        <h3 style={{marginTop: '30px', marginBottom: '10px', fontSize: '1.1rem'}}>Gespeicherte Messungen</h3>
        {sortedBodyMeasurements.length > 0 ? (
          <div style={{overflowX: 'auto'}}>
          <Table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Gewicht (kg)</th>
                <th>Körperfett (%)</th>
                <th>Brust (cm)</th>
                <th>Taille (cm)</th>
                <th>Hüfte (cm)</th>
                <th>Bizeps (cm)</th>
                <th>Oberschenkel (cm)</th>
              </tr>
            </thead>
            <tbody>
              {sortedBodyMeasurements.map(measurement => (
                <tr key={measurement.id}>
                  <td>{format(parseISO(measurement.date), 'dd.MM.yyyy')}</td>
                  <td>{measurement.weight !== null ? measurement.weight.toFixed(1) : '-'}</td>
                  <td>{measurement.bodyFat !== null ? measurement.bodyFat.toFixed(1) : '-'}</td>
                  <td>{measurement.chest !== null ? measurement.chest.toFixed(1) : '-'}</td>
                  <td>{measurement.waist !== null ? measurement.waist.toFixed(1) : '-'}</td>
                  <td>{measurement.hips !== null ? measurement.hips.toFixed(1) : '-'}</td>
                  <td>{measurement.biceps !== null ? measurement.biceps.toFixed(1) : '-'}</td>
                  <td>{measurement.thighs !== null ? measurement.thighs.toFixed(1) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        ) : (
          <NoDataMessage>Noch keine Körpermessungen vorhanden.</NoDataMessage>
        )}
      </ChartCard>
    );
  };

  if (workoutHistory.length === 0 && activeTab !== 'bodyMeasurements') {
    return (
      <Container>
        <Header>
          <PageTitle>Trainingsanalyse</PageTitle>
        </Header>
        <NoDataMessage>
          Keine Workout-Daten verfügbar. Beginne mit dem Training, um deine Fortschritte zu analysieren!
        </NoDataMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <PageTitle>Trainingsanalyse</PageTitle>
      </Header>

      <FilterContainer>
        <label>Zeitraum:</label>
        <Select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
          <option value="4weeks">Letzte 4 Wochen</option>
          <option value="8weeks">Letzte 8 Wochen</option>
          <option value="12weeks">Letzte 12 Wochen</option>
          <option value="6months">Letzte 6 Monate</option>
          <option value="1year">Letztes Jahr</option>
        </Select>
        
        <label>Ansicht:</label>
        <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="individual">Einzelne Trainings</option>
          <option value="weekly">Wöchentlich gruppiert</option>
        </Select>
        
        <label>Sortierung:</label>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Nach Datum</option>
          <option value="workouts">Nach Trainingsanzahl</option>
          <option value="volume">Nach Volumen</option>
          <option value="sets">Nach Sätzen</option>
        </Select>
        
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Absteigend</option>
          <option value="asc">Aufsteigend</option>
        </Select>
      </FilterContainer>

      <TabContainer>
        <TabButton 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Übersicht
        </TabButton>
        <TabButton 
          active={activeTab === 'progression'} 
          onClick={() => setActiveTab('progression')}
        >
          Progression
        </TabButton>
        <TabButton 
          active={activeTab === 'bodyMeasurements'} 
          onClick={() => setActiveTab('bodyMeasurements')}
        >
          Körpermessungen
        </TabButton>
      </TabContainer>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'progression' && renderProgressionTab()}
      {activeTab === 'bodyMeasurements' && renderBodyMeasurementsTab()}
    </Container>
  );
};

export default Analysis; 