import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useWorkout } from '../../context/WorkoutContext';

const Container = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f3f9ff;
  border-radius: 4px;
  border-left: 3px solid #007bff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h4`
  margin: 0;
  color: #007bff;
`;

const Description = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const MethodSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ExerciseGroup = styled.div`
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
  border: 1px dashed #ddd;
  margin-bottom: 1rem;
`;

const ExerciseGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const GroupTitle = styled.h5`
  margin: 0;
  font-weight: 500;
`;

const Button = styled.button`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  background-color: ${props => props.variant === 'primary' ? '#007bff' : props.variant === 'danger' ? '#dc3545' : '#6c757d'};
  color: white;
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#0069d9' : props.variant === 'danger' ? '#c82333' : '#5a6268'};
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const ExerciseParameters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ParameterInput = styled.div`
  label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }
`;

const InfoMessage = styled.div`
  padding: 0.75rem;
  background-color: #e9f5ff;
  border-radius: 4px;
  color: #004085;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const AdvancedTrainingMethod = ({ value, onChange, exercises = [] }) => {
  const { state } = useWorkout();
  const [trainingMethod, setTrainingMethod] = useState('Standard');
  const [exerciseGroups, setExerciseGroups] = useState([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  
  // Initialize with standard method or existing data
  useEffect(() => {
    if (value && value.method && value.groups) {
      setTrainingMethod(value.method);
      setExerciseGroups(value.groups);
    } else {
      setTrainingMethod('Standard');
      setExerciseGroups([]);
    }
  }, [value]);
  
  // Update parent component when data changes
  useEffect(() => {
    if (onChange) {
      onChange({
        method: trainingMethod,
        groups: exerciseGroups
      });
    }
  }, [trainingMethod, exerciseGroups, onChange]);
  
  // Add a new exercise group
  const handleAddGroup = () => {
    setExerciseGroups([
      ...exerciseGroups,
      {
        id: uuidv4(),
        name: `Gruppe ${exerciseGroups.length + 1}`,
        exercises: []
      }
    ]);
  };
  
  // Remove an exercise group
  const handleRemoveGroup = (groupId) => {
    setExerciseGroups(exerciseGroups.filter(group => group.id !== groupId));
  };
  
  // Add an exercise to a group
  const handleAddExercise = (groupId) => {
    setExerciseGroups(exerciseGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          exercises: [
            ...group.exercises,
            {
              id: uuidv4(),
              exerciseId: '',
              name: '',
              sets: '',
              reps: '',
              weight: '',
              rest: '',
              notes: ''
            }
          ]
        };
      }
      return group;
    }));
  };
  
  // Remove an exercise from a group
  const handleRemoveExercise = (groupId, exerciseId) => {
    setExerciseGroups(exerciseGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          exercises: group.exercises.filter(ex => ex.id !== exerciseId)
        };
      }
      return group;
    }));
  };
  
  // Update group name
  const handleGroupNameChange = (groupId, name) => {
    setExerciseGroups(exerciseGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, name };
      }
      return group;
    }));
  };
  
  // Update exercise data
  const handleExerciseChange = (groupId, exerciseId, field, value) => {
    setExerciseGroups(exerciseGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          exercises: group.exercises.map(ex => {
            if (ex.id === exerciseId) {
              if (field === 'exerciseId') {
                const selectedExercise = exercises.find(e => e.id === value);
                return {
                  ...ex,
                  exerciseId: value,
                  name: selectedExercise ? selectedExercise.name : ''
                };
              }
              return { ...ex, [field]: value };
            }
            return ex;
          })
        };
      }
      return group;
    }));
  };
  
  // Get description for selected training method
  const getMethodDescription = () => {
    const methods = state.trainingMethods || [];
    const method = methods.find(m => m.name === trainingMethod);
    return method ? method.description : '';
  };
  
  // Get info message based on selected method
  const getInfoMessage = () => {
    switch (trainingMethod) {
      case 'Supersatz':
        return 'Für Supersätze solltest du eine Gruppe mit genau zwei Übungen erstellen.';
      case 'Triset':
        return 'Für Trisets solltest du eine Gruppe mit genau drei Übungen erstellen.';
      case 'Riesensatz':
        return 'Für Riesensätze solltest du eine Gruppe mit vier oder mehr Übungen erstellen.';
      case 'Dropset':
        return 'Für Dropsets gib die verschiedenen Gewichte und Wiederholungen bei derselben Übung an.';
      case 'Zirkeltraining':
        return 'Für Zirkeltraining füge mehrere Übungen in einer Gruppe hinzu und gib die Anzahl der Runden an.';
      default:
        return '';
    }
  };
  
  // Ensure trainingMethods exists before mapping
  const trainingMethods = state?.trainingMethods || [
    { id: '1', name: 'Standard', description: 'Normales Training mit Sätzen und Wiederholungen' }
  ];
  
  // Filter exercises by muscle group
  const filteredExercises = selectedMuscleGroup
    ? exercises.filter(ex => ex.muscleGroups.includes(selectedMuscleGroup))
    : exercises;
  
  return (
    <Container>
      <Header>
        <Title>Erweiterte Trainingsmethode</Title>
      </Header>
      
      <FormGroup>
        <Label>Trainingsmethode</Label>
        <MethodSelector
          value={trainingMethod}
          onChange={(e) => setTrainingMethod(e.target.value)}
        >
          {trainingMethods.map(method => (
            <option key={method.id} value={method.name}>
              {method.name}
            </option>
          ))}
        </MethodSelector>
      </FormGroup>
      
      <Description>{getMethodDescription()}</Description>
      
      {getInfoMessage() && (
        <InfoMessage>{getInfoMessage()}</InfoMessage>
      )}
      
      {trainingMethod !== 'Standard' && (
        <>
          {exerciseGroups.map(group => (
            <ExerciseGroup key={group.id}>
              <ExerciseGroupHeader>
                <FormGroup style={{ flex: 1, marginRight: '1rem', marginBottom: 0 }}>
                  <Input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleGroupNameChange(group.id, e.target.value)}
                    placeholder="Gruppenname"
                  />
                </FormGroup>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveGroup(group.id)}
                >
                  Gruppe entfernen
                </Button>
              </ExerciseGroupHeader>
              
              {group.exercises.map((exercise, index) => (
                <div key={exercise.id} style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <GroupTitle>Übung {index + 1}</GroupTitle>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveExercise(group.id, exercise.id)}
                    >
                      Entfernen
                    </Button>
                  </div>
                  
                  <FormGroup>
                    <Label>Muskelgruppe</Label>
                    <Select
                      value={selectedMuscleGroup}
                      onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                    >
                      <option value="">Alle Muskelgruppen</option>
                      <option value="Brustmuskulatur">Brustmuskulatur (Pectoralis)</option>
                      <option value="Rückenmuskulatur">Rückenmuskulatur (Latissimus, Trapezius)</option>
                      <option value="Beinmuskulatur">Beinmuskulatur (Quadrizeps, Beinbeuger)</option>
                      <option value="Schultermuskulatur">Schultermuskulatur (Deltoideus)</option>
                      <option value="Bizeps">Bizeps</option>
                      <option value="Trizeps">Trizeps</option>
                      <option value="Bauchmuskulatur">Bauchmuskulatur</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Übung auswählen</Label>
                    <Select
                      value={exercise.exerciseId}
                      onChange={(e) => handleExerciseChange(group.id, exercise.id, 'exerciseId', e.target.value)}
                    >
                      <option value="">Übung auswählen...</option>
                      {filteredExercises.map(ex => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name}
                        </option>
                      ))}
                    </Select>
                    {filteredExercises.length === 0 && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                        <em>Keine Übungen gefunden. Bitte verwenden Sie den "Übungsdatenbank zurücksetzen"-Button 
                        auf der "Trainingsplan erstellen"-Seite.</em>
                      </div>
                    )}
                  </FormGroup>
                  
                  <ExerciseParameters>
                    <ParameterInput>
                      <label>Sätze</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(group.id, exercise.id, 'sets', e.target.value)}
                      />
                    </ParameterInput>
                    
                    <ParameterInput>
                      <label>Wiederholungen</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(group.id, exercise.id, 'reps', e.target.value)}
                      />
                    </ParameterInput>
                    
                    <ParameterInput>
                      <label>Gewicht (kg)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(group.id, exercise.id, 'weight', e.target.value)}
                      />
                    </ParameterInput>
                    
                    <ParameterInput>
                      <label>Pause (Sek.)</label>
                      <input
                        type="number"
                        min="0"
                        value={exercise.rest}
                        onChange={(e) => handleExerciseChange(group.id, exercise.id, 'rest', e.target.value)}
                      />
                    </ParameterInput>
                  </ExerciseParameters>
                  
                  <FormGroup>
                    <Label>Notizen</Label>
                    <Input
                      type="text"
                      value={exercise.notes}
                      onChange={(e) => handleExerciseChange(group.id, exercise.id, 'notes', e.target.value)}
                      placeholder="Zusätzliche Anweisungen oder Hinweise"
                    />
                  </FormGroup>
                </div>
              ))}
              
              <Button
                variant="primary"
                onClick={() => handleAddExercise(group.id)}
              >
                Übung hinzufügen
              </Button>
            </ExerciseGroup>
          ))}
          
          <Button variant="primary" onClick={handleAddGroup}>
            Übungsgruppe hinzufügen
          </Button>
        </>
      )}
    </Container>
  );
};

export default AdvancedTrainingMethod; 