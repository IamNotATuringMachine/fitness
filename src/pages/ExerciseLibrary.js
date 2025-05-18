import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';
import { v4 as uuidv4 } from 'uuid';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ExercisesContainer = styled.div`
  margin-top: 1.5rem;
`;

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ExerciseCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MuscleGroupTag = styled.span`
  display: inline-block;
  background-color: #e0f7fa;
  color: #00838f;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const AddExerciseForm = styled.form`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const MuscleGroupSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const MuscleGroupOption = styled.div`
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background-color: ${props => props.selected ? '#007bff' : '#e9ecef'};
  color: ${props => props.selected ? 'white' : '#495057'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? '#0069d9' : '#dee2e6'};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const FilterTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 1rem;
`;

const FilterTag = styled.div`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.selected ? '#007bff' : '#e9ecef'};
  color: ${props => props.selected ? 'white' : '#495057'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? '#0069d9' : '#dee2e6'};
  }
`;

const EquipmentTag = styled.span`
  display: inline-block;
  background-color: #e6f7ff;
  color: #0050b3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const DifficultyTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: ${props => {
    switch (props.level) {
      case 'Leicht': return '#e6f7e6';
      case 'Mittel': return '#fff7e6';
      case 'Schwer': return '#ffe6e6';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'Leicht': return '#52c41a';
      case 'Mittel': return '#fa8c16';
      case 'Schwer': return '#f5222d';
      default: return '#666';
    }
  }};
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-right: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ClearFiltersButton = styled(Button)`
  background-color: #f8f9fa;
  color: #6c757d;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #e9ecef;
    border-color: #ced4da;
  }
`;

// List of common muscle groups
const muscleGroups = [
  'Brust', 'Rücken', 'Schultern', 'Bizeps', 'Trizeps', 
  'Beine', 'Gesäß', 'Waden', 'Bauchmuskeln', 'Oberschenkel', 'Beinbizeps'
];

// List of equipment types
const equipmentTypes = [
  'Körpergewicht', 'Langhantel', 'Kurzhanteln', 'Kabelzug', 'Maschine',
  'SZ-Stange', 'Hantelbank', 'Klimmzugstange', 'Rack', 'Beinstreckmaschine',
  'Beinbeugermaschine', 'Wadenmaschine', 'Stufe'
];

// Difficulty levels
const difficultyLevels = ['Leicht', 'Mittel', 'Schwer'];

const ExerciseLibrary = () => {
  const { state, dispatch } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  
  // New exercise state
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscleGroups: [],
    equipment: [],
    difficulty: 'Mittel'
  });
  
  // Filtered exercises
  const [filteredExercises, setFilteredExercises] = useState(state.exercises);
  
  // Apply filters when any filter or search changes
  useEffect(() => {
    let filtered = state.exercises;
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some(group => 
          group.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply muscle group filter
    if (selectedMuscleGroups.length > 0) {
      filtered = filtered.filter(exercise => 
        selectedMuscleGroups.some(group => 
          exercise.muscleGroups.includes(group)
        )
      );
    }
    
    // Apply equipment filter
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter(exercise => 
        selectedEquipment.some(eq => 
          exercise.equipment && exercise.equipment.includes(eq)
        )
      );
    }
    
    // Apply difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(exercise => 
        exercise.difficulty === selectedDifficulty
      );
    }
    
    setFilteredExercises(filtered);
  }, [state.exercises, searchTerm, selectedMuscleGroups, selectedEquipment, selectedDifficulty]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    setNewExercise({
      ...newExercise,
      [e.target.name]: e.target.value
    });
  };
  
  // Toggle muscle group selection for new exercise
  const toggleMuscleGroup = (group) => {
    setNewExercise(prev => {
      if (prev.muscleGroups.includes(group)) {
        return {
          ...prev,
          muscleGroups: prev.muscleGroups.filter(g => g !== group)
        };
      } else {
        return {
          ...prev,
          muscleGroups: [...prev.muscleGroups, group]
        };
      }
    });
  };
  
  // Toggle equipment selection for new exercise
  const toggleEquipment = (equipment) => {
    setNewExercise(prev => {
      if (prev.equipment.includes(equipment)) {
        return {
          ...prev,
          equipment: prev.equipment.filter(e => e !== equipment)
        };
      } else {
        return {
          ...prev,
          equipment: [...prev.equipment, equipment]
        };
      }
    });
  };
  
  // Toggle muscle group filter
  const toggleMuscleGroupFilter = (group) => {
    setSelectedMuscleGroups(prev => {
      if (prev.includes(group)) {
        return prev.filter(g => g !== group);
      } else {
        return [...prev, group];
      }
    });
  };
  
  // Toggle equipment filter
  const toggleEquipmentFilter = (equipment) => {
    setSelectedEquipment(prev => {
      if (prev.includes(equipment)) {
        return prev.filter(e => e !== equipment);
      } else {
        return [...prev, equipment];
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMuscleGroups([]);
    setSelectedEquipment([]);
    setSelectedDifficulty('');
  };
  
  // Add new exercise
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newExercise.name.trim()) {
      alert('Bitte gib einen Namen für die Übung ein.');
      return;
    }
    
    if (newExercise.muscleGroups.length === 0) {
      alert('Bitte wähle mindestens eine Muskelgruppe aus.');
      return;
    }
    
    if (newExercise.equipment.length === 0) {
      alert('Bitte wähle mindestens eine Ausrüstung aus.');
      return;
    }
    
    const exercise = {
      id: uuidv4(),
      name: newExercise.name.trim(),
      muscleGroups: newExercise.muscleGroups,
      equipment: newExercise.equipment,
      difficulty: newExercise.difficulty
    };
    
    dispatch({
      type: 'ADD_EXERCISE',
      payload: exercise
    });
    
    // Reset form
    setNewExercise({
      name: '',
      muscleGroups: [],
      equipment: [],
      difficulty: 'Mittel'
    });
    
    setShowAddForm(false);
  };
  
  return (
    <div>
      <PageHeader>
        <h1>Übungsbibliothek</h1>
        <div>
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            style={{ marginRight: '0.5rem' }}
          >
            {showFilters ? 'Filter ausblenden' : 'Filter anzeigen'}
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Abbrechen' : 'Neue Übung hinzufügen'}
          </Button>
        </div>
      </PageHeader>
      
      {showFilters && (
        <FilterSection>
          <FilterTitle>Filter</FilterTitle>
          
          <FilterContainer>
            <SearchInput 
              type="text" 
              placeholder="Nach Übungen oder Muskelgruppen suchen..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ClearFiltersButton onClick={clearFilters}>
              Filter zurücksetzen
            </ClearFiltersButton>
          </FilterContainer>
          
          <FilterGroup>
            <Label>Nach Muskelgruppe filtern</Label>
            <div style={{ marginTop: '0.5rem' }}>
              {muscleGroups.map(group => (
                <FilterTag 
                  key={group}
                  selected={selectedMuscleGroups.includes(group)}
                  onClick={() => toggleMuscleGroupFilter(group)}
                >
                  {group}
                </FilterTag>
              ))}
            </div>
          </FilterGroup>
          
          <FilterGroup>
            <Label>Nach Ausrüstung filtern</Label>
            <div style={{ marginTop: '0.5rem' }}>
              {equipmentTypes.map(equipment => (
                <FilterTag 
                  key={equipment}
                  selected={selectedEquipment.includes(equipment)}
                  onClick={() => toggleEquipmentFilter(equipment)}
                >
                  {equipment}
                </FilterTag>
              ))}
            </div>
          </FilterGroup>
          
          <FilterGroup>
            <Label>Nach Schwierigkeit filtern</Label>
            <Select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">Alle Schwierigkeitsgrade</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>
          </FilterGroup>
        </FilterSection>
      )}
      
      {showAddForm && (
        <AddExerciseForm onSubmit={handleSubmit}>
          <h3>Neue Übung hinzufügen</h3>
          <FormGroup>
            <Label htmlFor="name">Übungsname</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={newExercise.name}
              onChange={handleInputChange}
              placeholder="z.B. Bankdrücken"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Primäre Muskelgruppen</Label>
            <MuscleGroupSelector>
              {muscleGroups.map(group => (
                <MuscleGroupOption 
                  key={group}
                  selected={newExercise.muscleGroups.includes(group)}
                  onClick={() => toggleMuscleGroup(group)}
                >
                  {group}
                </MuscleGroupOption>
              ))}
            </MuscleGroupSelector>
          </FormGroup>
          
          <FormGroup>
            <Label>Benötigte Ausrüstung</Label>
            <MuscleGroupSelector>
              {equipmentTypes.map(equipment => (
                <MuscleGroupOption 
                  key={equipment}
                  selected={newExercise.equipment.includes(equipment)}
                  onClick={() => toggleEquipment(equipment)}
                >
                  {equipment}
                </MuscleGroupOption>
              ))}
            </MuscleGroupSelector>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="difficulty">Schwierigkeitsgrad</Label>
            <Select 
              id="difficulty" 
              name="difficulty" 
              value={newExercise.difficulty}
              onChange={handleInputChange}
            >
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Select>
          </FormGroup>
          
          <Button type="submit">Übung speichern</Button>
        </AddExerciseForm>
      )}
      
      <ExercisesContainer>
        <h2>Verfügbare Übungen ({filteredExercises.length})</h2>
        {filteredExercises.length > 0 ? (
          <ExerciseGrid>
            {filteredExercises.map(exercise => (
              <ExerciseCard key={exercise.id}>
                <Card.Header>{exercise.name}</Card.Header>
                <Card.Body>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Muskelgruppen:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      {exercise.muscleGroups.map(group => (
                        <MuscleGroupTag key={group}>{group}</MuscleGroupTag>
                      ))}
                    </div>
                  </div>
                  
                  {exercise.equipment && exercise.equipment.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Ausrüstung:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {exercise.equipment.map(eq => (
                          <EquipmentTag key={eq}>{eq}</EquipmentTag>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {exercise.difficulty && (
                    <div>
                      <strong>Schwierigkeit:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        <DifficultyTag level={exercise.difficulty}>
                          {exercise.difficulty}
                        </DifficultyTag>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </ExerciseCard>
            ))}
          </ExerciseGrid>
        ) : (
          <Card>
            <Card.Body>
              <p>Keine Übungen gefunden. {searchTerm && `Keine Ergebnisse für "${searchTerm}".`}</p>
            </Card.Body>
          </Card>
        )}
      </ExercisesContainer>
    </div>
  );
};

export default ExerciseLibrary; 