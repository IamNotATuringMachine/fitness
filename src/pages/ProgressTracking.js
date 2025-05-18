import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useWorkout } from '../context/WorkoutContext';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {  Chart as ChartJS,  CategoryScale,  LinearScale,  PointElement,  LineElement,  Title as ChartTitle,  Tooltip,  Legend} from 'chart.js';
import { Card } from '../components/ui/Card';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

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

const StyledCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #3d8b40;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 500;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-top: 20px;
`;

const Message = styled.p`
  text-align: center;
  color: #666;
  font-style: italic;
`;

// New action types for tracking
// To be added to WorkoutContext
const TRACK_WORKOUT = 'TRACK_WORKOUT';
const TRACK_BODY_MEASUREMENT = 'TRACK_BODY_MEASUREMENT';

const ProgressTracking = () => {
  const { state, dispatch } = useWorkout();
  const [activeTab, setActiveTab] = useState('workout');
  
  // Workout Tracking
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [workoutDate, setWorkoutDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [exerciseRecords, setExerciseRecords] = useState([]);
  
  // Body Measurements
  const [bodyMeasurement, setBodyMeasurement] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
  });
  
  // Selected exercise for charts
  const [selectedExercise, setSelectedExercise] = useState('');
  
  // Effects
  useEffect(() => {
    if (selectedPlan) {
      const plan = state.workoutPlans.find(p => p.id === selectedPlan);
      if (plan && plan.days.length > 0) {
        setSelectedDay(plan.days[0].id);
      }
    } else {
      setSelectedDay('');
      setExerciseRecords([]);
    }
  }, [selectedPlan, state.workoutPlans]);
  
  useEffect(() => {
    if (selectedDay) {
      const plan = state.workoutPlans.find(p => p.id === selectedPlan);
      if (plan) {
        const day = plan.days.find(d => d.id === selectedDay);
        if (day) {
          // Standard exercises
          const standardExercises = day.exercises.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            completed: false,
            actualSets: '',
            actualReps: '',
            actualWeight: '',
            notes: '',
            isAdvanced: false
          }));
          
          // Advanced method exercises
          let advancedExercises = [];
          if (day.advancedMethods && day.advancedMethods.length > 0) {
            day.advancedMethods.forEach(method => {
              if (method.groups && method.groups.length > 0) {
                method.groups.forEach(group => {
                  if (group.exercises && group.exercises.length > 0) {
                    const groupExercises = group.exercises.map(ex => ({
                      id: ex.id,
                      exerciseId: ex.exerciseId,
                      name: ex.name,
                      sets: ex.sets,
                      reps: ex.reps,
                      weight: ex.weight,
                      completed: false,
                      actualSets: '',
                      actualReps: '',
                      actualWeight: '',
                      notes: '',
                      isAdvanced: true,
                      methodId: method.id,
                      methodName: method.method,
                      groupId: group.id,
                      groupName: group.name
                    }));
                    advancedExercises = [...advancedExercises, ...groupExercises];
                  }
                });
              }
            });
          }
          
          setExerciseRecords([...standardExercises, ...advancedExercises]);
        }
      }
    } else {
      setExerciseRecords([]);
    }
  }, [selectedDay, selectedPlan, state.workoutPlans]);
  
  // Tab handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Workout tracking handlers
  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
  };
  
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };
  
  const handleDateChange = (e) => {
    setWorkoutDate(e.target.value);
  };
  
  const handleExerciseRecordChange = (id, field, value) => {
    setExerciseRecords(
      exerciseRecords.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };
  
  const handleWorkoutSubmit = () => {
    const completedExercises = exerciseRecords.filter(record => record.completed);
    
    // Group advanced method exercises
    const advancedMethods = [];
    const standardExercises = [];
    
    completedExercises.forEach(record => {
      if (record.isAdvanced) {
        // Find existing method or create new one
        let method = advancedMethods.find(m => m.id === record.methodId);
        if (!method) {
          method = {
            id: record.methodId,
            method: record.methodName,
            groups: []
          };
          advancedMethods.push(method);
        }
        
        // Find existing group or create new one
        let group = method.groups.find(g => g.id === record.groupId);
        if (!group) {
          group = {
            id: record.groupId,
            name: record.groupName,
            exercises: []
          };
          method.groups.push(group);
        }
        
        // Add exercise to group
        group.exercises.push({
          id: record.id,
          exerciseId: record.exerciseId,
          name: record.name,
          sets: parseInt(record.actualSets || record.sets, 10),
          reps: parseInt(record.actualReps || record.reps, 10),
          weight: parseFloat(record.actualWeight || record.weight),
          notes: record.notes
        });
      } else {
        // Standard exercise
        standardExercises.push({
          id: record.id,
          name: record.name,
          sets: parseInt(record.actualSets || record.sets, 10),
          reps: parseInt(record.actualReps || record.reps, 10),
          weight: parseFloat(record.actualWeight || record.weight),
          notes: record.notes
        });
      }
    });
    
    const workoutRecord = {
      id: uuidv4(),
      date: workoutDate,
      planId: selectedPlan,
      dayId: selectedDay,
      exercises: standardExercises,
      advancedMethods: advancedMethods
    };
    
    dispatch({
      type: TRACK_WORKOUT,
      payload: workoutRecord,
    });
    
    // Reset form
    setExerciseRecords(
      exerciseRecords.map(record => ({
        ...record,
        completed: false,
        actualSets: '',
        actualReps: '',
        actualWeight: '',
        notes: '',
      }))
    );
  };
  
  // Body measurement handlers
  const handleBodyMeasurementChange = (field, value) => {
    setBodyMeasurement({
      ...bodyMeasurement,
      [field]: value,
    });
  };
  
  const handleBodyMeasurementSubmit = () => {
    const measurementRecord = {
      id: uuidv4(),
      date: bodyMeasurement.date,
      ...bodyMeasurement,
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
  };
  
  // Chart functions
  const getChartData = () => {
    const workoutHistory = state.workoutHistory || [];
    
    if (!selectedExercise || workoutHistory.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Gewicht (kg)',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };
    }
    
    // Find all recorded instances of the selected exercise
    const exerciseData = [];
    
    workoutHistory.forEach(workout => {
      // Check if workout.exercises exists before using it
      if (workout && workout.exercises) {
        const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
        if (exercise) {
          exerciseData.push({
            date: workout.date,
            weight: exercise.weight,
          });
        }
      }
    });
    
    // Sort by date
    exerciseData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: exerciseData.map(data => data.date),
      datasets: [
        {
          label: 'Gewicht (kg)',
          data: exerciseData.map(data => data.weight),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  };
  
  // Render workout history tab
  const renderWorkoutHistoryTab = () => {
    const workoutHistory = state.workoutHistory || [];
    
    if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) {
      return <Message>Noch keine Trainingsdaten vorhanden</Message>;
    }
    
    // Get unique exercise names from history
    const exerciseNames = new Set();
    workoutHistory.forEach(workout => {
      if (workout && workout.exercises && Array.isArray(workout.exercises)) {
        workout.exercises.forEach(exercise => {
          if (exercise && exercise.name) {
            exerciseNames.add(exercise.name);
          }
        });
      }
    });
    
    return (
      <>
        <FormGroup>
          <Label>Übung auswählen</Label>
          <Select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="">Übung auswählen...</option>
            {Array.from(exerciseNames).map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        {selectedExercise && (
          <ChartContainer>
            <Line
              data={getChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: 'Gewicht (kg)',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Datum',
                    },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    text: `Fortschritt: ${selectedExercise}`,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Gewicht: ${context.parsed.y} kg`;
                      }
                    }
                  }
                },
              }}
            />
          </ChartContainer>
        )}
        
        <Table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Trainingsplan</th>
              <th>Trainingstag</th>
              <th>Übungen</th>
            </tr>
          </thead>
          <tbody>
            {workoutHistory.map(workout => {
              if (!workout) return null;
              
              const plan = state.workoutPlans?.find(p => p?.id === workout.planId);
              const day = plan?.days?.find(d => d?.id === workout.dayId);
              const exerciseCount = workout.exercises && Array.isArray(workout.exercises) ? workout.exercises.length : 0;
              
              return (
                <tr key={workout.id || `workout-${Math.random()}`}>
                  <td>{workout.date || 'Unbekannt'}</td>
                  <td>{plan?.name || 'Gelöschter Plan'}</td>
                  <td>{day?.name || 'Gelöschter Tag'}</td>
                  <td>{exerciseCount} Übungen</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  };
  
  // Render body measurements tab
  const renderBodyMeasurementsTab = () => {
    const bodyMeasurements = state.bodyMeasurements || [];
    
    return (
      <>
        <Card>
          <Card.Body>
            <h3>Neue Körpermessung eintragen</h3>
            <FormGrid>
              <FormGroup>
                <Label>Datum</Label>
                <Input
                  type="date"
                  value={bodyMeasurement.date}
                  onChange={(e) => handleBodyMeasurementChange('date', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Gewicht (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bodyMeasurement.weight}
                  onChange={(e) => handleBodyMeasurementChange('weight', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Körperfett (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bodyMeasurement.bodyFat}
                  onChange={(e) => handleBodyMeasurementChange('bodyFat', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Brustumfang (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bodyMeasurement.chest}
                  onChange={(e) => handleBodyMeasurementChange('chest', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Taillenumfang (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bodyMeasurement.waist}
                  onChange={(e) => handleBodyMeasurementChange('waist', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Hüftumfang (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bodyMeasurement.hips}
                  onChange={(e) => handleBodyMeasurementChange('hips', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Bizeps (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bodyMeasurement.biceps}
                  onChange={(e) => handleBodyMeasurementChange('biceps', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Oberschenkel (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bodyMeasurement.thighs}
                  onChange={(e) => handleBodyMeasurementChange('thighs', e.target.value)}
                />
              </FormGroup>
            </FormGrid>
            <Button onClick={handleBodyMeasurementSubmit}>Speichern</Button>
          </Card.Body>
        </Card>
        
        {bodyMeasurements.length > 0 ? (
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
              {bodyMeasurements.map(measurement => (
                <tr key={measurement.id}>
                  <td>{measurement.date}</td>
                  <td>{measurement.weight}</td>
                  <td>{measurement.bodyFat}</td>
                  <td>{measurement.chest}</td>
                  <td>{measurement.waist}</td>
                  <td>{measurement.hips}</td>
                  <td>{measurement.biceps}</td>
                  <td>{measurement.thighs}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Message>Noch keine Körpermessungen vorhanden</Message>
        )}
      </>
    );
  };
  
  // Render workout tracking tab
  const renderWorkoutTrackingTab = () => {
    return (
      <Card>
        <Card.Body>
          <FormGroup>
            <Label>Trainingsplan auswählen</Label>
            <Select
              value={selectedPlan}
              onChange={handlePlanChange}
            >
              <option value="">Plan auswählen...</option>
              {state.workoutPlans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          {selectedPlan && (
            <FormGroup>
              <Label>Trainingstag auswählen</Label>
              <Select
                value={selectedDay}
                onChange={handleDayChange}
              >
                <option value="">Tag auswählen...</option>
                {selectedPlan && state.workoutPlans.find(p => p.id === selectedPlan)?.days.map(day => (
                  <option key={day.id} value={day.id}>
                    {day.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
          )}
          
          <FormGroup>
            <Label>Datum</Label>
            <Input
              type="date"
              value={workoutDate}
              onChange={handleDateChange}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </FormGroup>
          
          {selectedDay && exerciseRecords.length > 0 && (
            <>
              <h3 style={{ marginTop: '1.5rem' }}>Übungen</h3>
              
              <Table>
                <thead>
                  <tr>
                    <th>Übung</th>
                    <th>Geplant</th>
                    <th>Tatsächlich</th>
                    <th>Notizen</th>
                    <th>Erledigt</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseRecords.map((record, index) => {
                    // Group header for advanced methods
                    const showGroupHeader = record.isAdvanced && 
                      (index === 0 || 
                       exerciseRecords[index - 1].groupId !== record.groupId || 
                       exerciseRecords[index - 1].methodId !== record.methodId);
                    
                    return (
                      <React.Fragment key={record.id}>
                        {showGroupHeader && (
                          <tr style={{ backgroundColor: '#f0f7ff' }}>
                            <td colSpan="5" style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                              {record.methodName}: {record.groupName}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td>{record.name}</td>
                          <td>
                            {record.sets} Sätze × {record.reps} Wdh
                            {record.weight ? ` @ ${record.weight} kg` : ''}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <Input
                                type="number"
                                placeholder="Sätze"
                                value={record.actualSets}
                                onChange={(e) => handleExerciseRecordChange(record.id, 'actualSets', e.target.value)}
                                style={{ width: '70px' }}
                                disabled={!record.completed}
                              />
                              <Input
                                type="number"
                                placeholder="Wdh"
                                value={record.actualReps}
                                onChange={(e) => handleExerciseRecordChange(record.id, 'actualReps', e.target.value)}
                                style={{ width: '70px' }}
                                disabled={!record.completed}
                              />
                              <Input
                                type="number"
                                placeholder="kg"
                                step="0.5"
                                value={record.actualWeight}
                                onChange={(e) => handleExerciseRecordChange(record.id, 'actualWeight', e.target.value)}
                                style={{ width: '70px' }}
                                disabled={!record.completed}
                              />
                            </div>
                          </td>
                          <td>
                            <Input
                              type="text"
                              placeholder="Notizen"
                              value={record.notes}
                              onChange={(e) => handleExerciseRecordChange(record.id, 'notes', e.target.value)}
                              disabled={!record.completed}
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={record.completed}
                              onChange={(e) => handleExerciseRecordChange(record.id, 'completed', e.target.checked)}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </Table>
              
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <Button onClick={handleWorkoutSubmit}>
                  Training protokollieren
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    );
  };
  
  return (
    <Container>
      <Header>
        <PageTitle>Fortschrittsverfolgung</PageTitle>
      </Header>
      
      <TabContainer>
        <TabButton
          active={activeTab === 'workout'}
          onClick={() => handleTabChange('workout')}
        >
          Training protokollieren
        </TabButton>
        <TabButton
          active={activeTab === 'history'}
          onClick={() => handleTabChange('history')}
        >
          Trainingshistorie
        </TabButton>
        <TabButton
          active={activeTab === 'body'}
          onClick={() => handleTabChange('body')}
        >
          Körpermessungen
        </TabButton>
      </TabContainer>
      
      {activeTab === 'workout' && renderWorkoutTrackingTab()}
      {activeTab === 'history' && renderWorkoutHistoryTab()}
      {activeTab === 'body' && renderBodyMeasurementsTab()}
    </Container>
  );
};

export default ProgressTracking; 