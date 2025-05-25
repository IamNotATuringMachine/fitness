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
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ExercisesContainer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const ExerciseCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MuscleGroupTag = styled.span`
  display: inline-block;
  background-color: ${props => `${props.theme.colors.primaryLight}60`};
  color: ${props => props.theme.colors.primaryDark};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-right: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const FilterContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.cardBackground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
`;

const AddExerciseForm = styled.form`
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.cardBackground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
`;

const MuscleGroupSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const MuscleGroupOption = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.typography.fontSizes.xs};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.grayLight};
  color: ${props => props.selected ? props.theme.colors.white : props.theme.colors.text};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.selected ? props.theme.colors.primaryDark : props.theme.colors.border};
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const FilterTitle = styled.h3`
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FilterGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FilterTag = styled.div`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  margin-right: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.grayLight};
  color: ${props => props.selected ? props.theme.colors.white : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.large};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.selected ? props.theme.colors.primaryDark : props.theme.colors.border};
  }
`;

const EquipmentTag = styled.span`
  display: inline-block;
  background-color: ${props => `${props.theme.colors.primaryLight}99`};
  color: ${props => props.theme.colors.primaryDark};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-right: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ClearFiltersButton = styled(Button)`
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
    border-color: ${props => props.theme.colors.gray};
  }
`;

// List of common muscle groups
const muscleGroups = [
  'Brust', 'Brustmuskulatur', 'Rücken', 'Rückenmuskulatur', 'Schultern', 'Schultermuskulatur', 
  'Bizeps', 'Trizeps', 'Beine', 'Beinmuskulatur', 'Gesäß', 'Waden', 
  'Bauchmuskeln', 'Bauchmuskulatur', 'Oberschenkel', 'Beinbizeps'
];

// List of equipment types
const equipmentTypes = [
  'Körpergewicht', 'Langhantel', 'Kurzhanteln', 'Kurzhantel', 'Kabelzug', 'Maschine',
  'SZ-Stange', 'Hantelbank', 'Schrägbank', 'Negativ-Bank', 'Klimmzugstange', 'Rack', 
  'Beinstreckmaschine', 'Beinbeugermaschine', 'Wadenmaschine', 'Sitzcalves-Maschine',
  'Stufe', 'Brustpressmaschine', 'Butterfly-Maschine', 'Latzugmaschine',
  'T-Bar', 'Rudermaschine', 'Hyperextension-Bank', 'Beinpressmaschine',
  'Bank', 'Dip-Station', 'Scott-Bank', 'Hantelscheibe', 'Gewichtsscheibe',
  'Reverse Butterfly-Maschine'
];

// Liste der neuen Übungen
const newExercises = [
  {
    name: 'Bankdrücken mit der Langhantel',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Langhantel', 'Hantelbank']
  },
  {
    name: 'Schrägbankdrücken mit der Langhantel',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Langhantel', 'Schrägbank']
  },
  {
    name: 'Negativbankdrücken mit der Langhantel',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Langhantel', 'Negativ-Bank']
  },
  {
    name: 'Kurzhantel-Bankdrücken',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Kurzhanteln', 'Hantelbank']
  },
  {
    name: 'Kurzhantel-Schrägbankdrücken',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Kurzhanteln', 'Schrägbank']
  },
  {
    name: 'Kurzhantel-Negativbankdrücken',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Kurzhanteln', 'Negativ-Bank']
  },
  {
    name: 'Fliegende Bewegung auf der Flachbank',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Kurzhanteln', 'Hantelbank']
  },
  {
    name: 'Fliegende Bewegung auf der Schrägbank',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Kurzhanteln', 'Schrägbank']
  },
  {
    name: 'Cable Crossovers / Fliegende am Kabelzug',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Kabelzug']
  },
  {
    name: 'Dips',
    muscleGroups: ['Brustmuskulatur', 'Trizeps', 'Schultern'],
    equipment: ['Dip-Station']
  },
  {
    name: 'Brustpresse an der Maschine',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Brustpressmaschine']
  },
  {
    name: 'Butterfly / Peck Deck Maschine',
    muscleGroups: ['Brustmuskulatur'],
    equipment: ['Butterfly-Maschine']
  },
  {
    name: 'Latzug zur Brust',
    muscleGroups: ['Rückenmuskulatur'],
    equipment: ['Latzugmaschine']
  },
  {
    name: 'Langhantelrudern vorgebeugt',
    muscleGroups: ['Rückenmuskulatur'],
    equipment: ['Langhantel']
  },
  {
    name: 'Kurzhantelrudern einarmig',
    muscleGroups: ['Rückenmuskulatur'],
    equipment: ['Kurzhantel', 'Bank']
  },
  {
    name: 'T-Bar Rudern',
    muscleGroups: ['Rückenmuskulatur'],
    equipment: ['T-Bar']
  },
  {
    name: 'Rudern am Kabelzug sitzend',
    muscleGroups: ['Rückenmuskulatur'],
    equipment: ['Kabelzug']
  },
  {
    name: 'Rudern an der Maschine',
    muscleGroups: ['Rückenmuskulatur'],
    equipment: ['Rudermaschine']
  },
  {
    name: 'Überzüge mit Kurzhantel oder am Kabel',
    muscleGroups: ['Rückenmuskulatur'],
    equipment: ['Kurzhantel', 'Kabelzug']
  },
  {
    name: 'Hyperextensions / Rückenstrecker',
    muscleGroups: ['Rückenmuskulatur'],
    equipment: ['Hyperextension-Bank']
  },
  {
    name: 'Good Mornings',
    muscleGroups: ['Rückenmuskulatur', 'Beinmuskulatur'],
    equipment: ['Langhantel']
  },
  {
    name: 'Frontkniebeugen mit der Langhantel',
    muscleGroups: ['Beinmuskulatur'],
    equipment: ['Langhantel']
  },
  {
    name: 'Beinpresse',
    muscleGroups: ['Beinmuskulatur'],
    equipment: ['Beinpressmaschine']
  },
  {
    name: 'Bulgarian Split Squats',
    muscleGroups: ['Beinmuskulatur'],
    equipment: ['Bank', 'Kurzhanteln']
  },
  {
    name: 'Rumänisches Kreuzheben',
    muscleGroups: ['Beinmuskulatur'],
    equipment: ['Langhantel']
  },
  {
    name: 'Gestrecktes Kreuzheben',
    muscleGroups: ['Beinmuskulatur'],
    equipment: ['Langhantel']
  },
  {
    name: 'Hüftheben / Glute Bridges',
    muscleGroups: ['Beinmuskulatur'],
    equipment: ['Langhantel', 'Bank']
  },
  {
    name: 'Hip Thrusts',
    muscleGroups: ['Beinmuskulatur'],
    equipment: ['Langhantel', 'Bank']
  },
  {
    name: 'Wadenheben sitzend',
    muscleGroups: ['Beinmuskulatur'],
    equipment: ['Sitzcalves-Maschine']
  },
  {
    name: 'Schulterdrücken mit Kurzhanteln',
    muscleGroups: ['Schultermuskulatur'],
    equipment: ['Kurzhanteln']
  },
  {
    name: 'Arnold Press',
    muscleGroups: ['Schultermuskulatur'],
    equipment: ['Kurzhanteln']
  },
  {
    name: 'Seitheben mit Kurzhanteln',
    muscleGroups: ['Schultermuskulatur'],
    equipment: ['Kurzhanteln']
  },
  {
    name: 'Seitheben am Kabelzug',
    muscleGroups: ['Schultermuskulatur'],
    equipment: ['Kabelzug']
  },
  {
    name: 'Vorgebeugtes Seitheben mit Kurzhanteln',
    muscleGroups: ['Schultermuskulatur'],
    equipment: ['Kurzhanteln']
  },
  {
    name: 'Reverse Butterfly / Reverse Peck Deck',
    muscleGroups: ['Schultermuskulatur'],
    equipment: ['Reverse Butterfly-Maschine']
  },
  {
    name: 'Frontheben mit Kurzhanteln oder Hantelscheibe',
    muscleGroups: ['Schultermuskulatur'],
    equipment: ['Kurzhanteln', 'Hantelscheibe']
  },
  {
    name: 'Aufrechtes Rudern',
    muscleGroups: ['Schultermuskulatur'],
    equipment: ['Langhantel', 'Kurzhanteln']
  },
  {
    name: 'Langhantel-Curls',
    muscleGroups: ['Bizeps'],
    equipment: ['Langhantel']
  },
  {
    name: 'Hammercurls',
    muscleGroups: ['Bizeps'],
    equipment: ['Kurzhanteln']
  },
  {
    name: 'Konzentrationscurls',
    muscleGroups: ['Bizeps'],
    equipment: ['Kurzhantel']
  },
  {
    name: 'Scottcurls / Preacher Curls',
    muscleGroups: ['Bizeps'],
    equipment: ['Scott-Bank', 'Langhantel', 'Kurzhanteln']
  },
  {
    name: 'Bizepscurls am Kabelzug',
    muscleGroups: ['Bizeps'],
    equipment: ['Kabelzug']
  },
  {
    name: 'Reverse Curls',
    muscleGroups: ['Bizeps'],
    equipment: ['Langhantel', 'SZ-Stange']
  },
  {
    name: 'Enges Bankdrücken',
    muscleGroups: ['Trizeps'],
    equipment: ['Langhantel', 'Hantelbank']
  },
  {
    name: 'Stirndrücken / French Press',
    muscleGroups: ['Trizeps'],
    equipment: ['Langhantel', 'SZ-Stange', 'Kurzhanteln']
  },
  {
    name: 'Überkopf-Trizepsdrücken mit Kurzhantel',
    muscleGroups: ['Trizeps'],
    equipment: ['Kurzhantel']
  },
  {
    name: 'Kickbacks mit Kurzhanteln',
    muscleGroups: ['Trizeps'],
    equipment: ['Kurzhanteln']
  },
  {
    name: 'Crunches',
    muscleGroups: ['Bauchmuskulatur'],
    equipment: ['Körpergewicht']
  },
  {
    name: 'Beinheben',
    muscleGroups: ['Bauchmuskulatur'],
    equipment: ['Körpergewicht', 'Klimmzugstange']
  },
  {
    name: 'Plank / Unterarmstütz',
    muscleGroups: ['Bauchmuskulatur'],
    equipment: ['Körpergewicht']
  },
  {
    name: 'Russian Twists',
    muscleGroups: ['Bauchmuskulatur'],
    equipment: ['Körpergewicht', 'Gewichtsscheibe']
  },
  {
    name: 'Kabel-Crunches',
    muscleGroups: ['Bauchmuskulatur'],
    equipment: ['Kabelzug']
  },
  {
    name: 'Wood Chops / Holzfäller am Kabelzug',
    muscleGroups: ['Bauchmuskulatur'],
    equipment: ['Kabelzug']
  }
];

const ExerciseLibrary = () => {
  const { state, dispatch } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  
  // New exercise state
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscleGroups: [],
    equipment: []
  });
  
  // Filtered exercises
  const [filteredExercises, setFilteredExercises] = useState(state.exercises);
  
  // Importiere neue Übungen
  const importNewExercises = () => {
    // Prüfen, welche Übungen bereits existieren (anhand des Namens)
    const existingExerciseNames = state.exercises.map(ex => ex.name);
    const exercisesToAdd = newExercises.filter(ex => !existingExerciseNames.includes(ex.name));
    
    // Hinzufügen der neuen Übungen
    if (exercisesToAdd.length > 0) {
      // Ein Array mit allen Übungen erstellen, die hinzugefügt werden sollen
      const exercisesToDispatch = exercisesToAdd.map(exercise => ({
        id: uuidv4(),
        ...exercise
      }));
      
      // Übungen einzeln hinzufügen
      exercisesToDispatch.forEach(exercise => {
        dispatch({
          type: 'ADD_EXERCISE',
          payload: exercise
        });
      });
      
      // Feedback für den Benutzer mit Vorschlag, die Seite bei Problemen zu aktualisieren
      alert(`${exercisesToAdd.length} neue Übungen wurden hinzugefügt! Wenn die Übungen nicht angezeigt werden, aktualisieren Sie bitte die Seite.`);
      
      // Anzeigen der neuen Übungen in Konsole (hilft bei Debugging)
      console.log("Neu hinzugefügte Übungen:", exercisesToDispatch);
      
      // Nach dem Import Filter zurücksetzen, um alle Übungen anzuzeigen
      clearFilters();
    } else {
      alert("Es wurden keine neuen Übungen gefunden, die importiert werden könnten.");
    }
  };
  
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
    
    setFilteredExercises(filtered);
  }, [state.exercises, searchTerm, selectedMuscleGroups, selectedEquipment]);
  
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
      equipment: newExercise.equipment
    };
    
    dispatch({
      type: 'ADD_EXERCISE',
      payload: exercise
    });
    
    // Reset form
    setNewExercise({
      name: '',
      muscleGroups: [],
      equipment: []
    });
    
    setShowAddForm(false);
  };
  
  return (
    <div>
      <PageHeader>
        <h1>Übungsbibliothek</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button onClick={importNewExercises}>
            Übungen importieren
          </Button>
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
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
                    <div>
                      <strong>Ausrüstung:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {exercise.equipment.map(eq => (
                          <EquipmentTag key={eq}>{eq}</EquipmentTag>
                        ))}
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