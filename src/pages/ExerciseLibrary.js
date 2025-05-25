import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

import { exerciseDatabase } from '../data/exerciseDatabase';
import { v4 as uuidv4 } from 'uuid';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const Controls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const SortSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const SortControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  align-items: center;
`;

const SortButton = styled(Button)`
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.grayLight};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.gray};
  }
`;

const ExercisesContainer = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const ExerciseCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.medium};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ExerciseType = styled.span`
  display: inline-block;
  background-color: ${props => `${props.theme.colors.primaryLight}40`};
  color: ${props => props.theme.colors.primaryDark};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const MuscleInvolvementSection = styled.div`
  margin: ${props => props.theme.spacing.md} 0;
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => `${props.theme.colors.primaryLight}10`};
  border-radius: ${props => props.theme.borderRadius.small};
`;

const MuscleInvolvementItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const MuscleWeight = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.weight >= 1.0 ? props.theme.colors.success : 
                    props.weight >= 0.7 ? props.theme.colors.warning : 
                    props.theme.colors.gray};
`;

const EquipmentSection = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
`;

const EquipmentTag = styled.span`
  display: inline-block;
  background-color: ${props => `${props.theme.colors.secondary}60`};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  margin-right: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Description = styled.p`
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

const VariationsInfo = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
`;

const MuscleWeightEditor = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.small};
`;

const MuscleWeightInput = styled.input`
  width: 80px;
  padding: ${props => props.theme.spacing.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  text-align: center;
`;

const AddMuscleSection = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.small};
`;

const AddMuscleRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: ${props => props.theme.spacing.sm};
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

const ResultsCounter = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingExercise, setEditingExercise] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: 'Brust',
    type: 'Verbundübung',
    muscleInvolvement: {},
    equipment: [],
    description: '',
    isVariation: false,
    parentExercise: ''
  });

  // Convert the detailed exercise database to a flat list
  useEffect(() => {
    const flatExercises = [];
    Object.entries(exerciseDatabase).forEach(([category, categoryExercises]) => {
      categoryExercises.forEach(exercise => {
        // Add main exercise
        flatExercises.push({
          id: uuidv4(),
          name: exercise.übung_name,
          category: category,
          type: exercise.übungstyp,
          muscleInvolvement: exercise.gewichtete_muskelbeteiligung_pro_satz,
          equipment: exercise.equipment,
          description: exercise.beschreibung,
          variations: exercise.variationen || []
        });

        // Add variations as separate exercises
        if (exercise.variationen) {
          exercise.variationen.forEach(variation => {
            flatExercises.push({
              id: uuidv4(),
              name: variation.name,
              category: category,
              type: variation.übungstyp,
              muscleInvolvement: variation.gewichtete_muskelbeteiligung_pro_satz,
              equipment: variation.equipment,
              description: variation.beschreibung,
              isVariation: true,
              parentExercise: exercise.übung_name
            });
          });
        }
      });
    });
    setExercises(flatExercises);
  }, []);

  // Filter and sort exercises
  const filteredAndSortedExercises = React.useMemo(() => {
    let filtered = exercises.filter(exercise => {
      const matchesSearch = searchTerm === '' || 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.keys(exercise.muscleInvolvement || {}).some(muscle => 
          muscle.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (exercise.equipment || []).some(eq => 
          eq.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return matchesSearch;
    });

    // Sort exercises
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case 'primaryMuscle':
          const aPrimary = Object.entries(a.muscleInvolvement || {})
            .reduce((max, [muscle, weight]) => weight > max.weight ? { muscle, weight } : max, { muscle: '', weight: 0 });
          const bPrimary = Object.entries(b.muscleInvolvement || {})
            .reduce((max, [muscle, weight]) => weight > max.weight ? { muscle, weight } : max, { muscle: '', weight: 0 });
          aValue = aPrimary.muscle.toLowerCase();
          bValue = bPrimary.muscle.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [exercises, searchTerm, sortBy, sortOrder]);

  const handleExerciseClick = (exercise) => {
    setEditingExercise({ ...exercise });
    setShowEditModal(true);
  };

  const handleSaveExercise = () => {
    if (!editingExercise) return;

    // Update exercises array
    setExercises(prev => prev.map(ex => 
      ex.id === editingExercise.id ? editingExercise : ex
    ));

    setShowEditModal(false);
    setEditingExercise(null);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingExercise(null);
  };

  const updateMuscleWeight = (muscle, weight) => {
    setEditingExercise(prev => ({
      ...prev,
      muscleInvolvement: {
        ...prev.muscleInvolvement,
        [muscle]: parseFloat(weight) || 0
      }
    }));
  };

  const removeMuscle = (muscle) => {
    setEditingExercise(prev => {
      const newMuscleInvolvement = { ...prev.muscleInvolvement };
      delete newMuscleInvolvement[muscle];
      return {
        ...prev,
        muscleInvolvement: newMuscleInvolvement
      };
    });
  };

  const addNewMuscle = (muscle, weight) => {
    if (muscle && weight && !editingExercise.muscleInvolvement[muscle]) {
      updateMuscleWeight(muscle, weight);
    }
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleCreateExercise = () => {
    if (!newExercise.name.trim()) {
      alert('Bitte gib einen Namen für die Übung ein.');
      return;
    }

    if (Object.keys(newExercise.muscleInvolvement).length === 0) {
      alert('Bitte füge mindestens eine Muskelgruppe mit Gewichtung hinzu.');
      return;
    }

    if (newExercise.isVariation && !newExercise.parentExercise) {
      alert('Bitte wähle eine Hauptübung für diese Variation aus.');
      return;
    }

    const exercise = {
      id: uuidv4(),
      name: newExercise.name.trim(),
      category: newExercise.category,
      type: newExercise.type,
      muscleInvolvement: newExercise.muscleInvolvement,
      equipment: newExercise.equipment,
      description: newExercise.description,
      isVariation: newExercise.isVariation,
      parentExercise: newExercise.isVariation ? newExercise.parentExercise : undefined,
      variations: newExercise.isVariation ? undefined : []
    };

    setExercises(prev => [...prev, exercise]);
    
    // Reset form
    setNewExercise({
      name: '',
      category: 'Brust',
      type: 'Verbundübung',
      muscleInvolvement: {},
      equipment: [],
      description: '',
      isVariation: false,
      parentExercise: ''
    });

    setShowCreateModal(false);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewExercise({
      name: '',
      category: 'Brust',
      type: 'Verbundübung',
      muscleInvolvement: {},
      equipment: [],
      description: '',
      isVariation: false,
      parentExercise: ''
    });
  };

  const updateNewExerciseMuscleWeight = (muscle, weight) => {
    setNewExercise(prev => ({
      ...prev,
      muscleInvolvement: {
        ...prev.muscleInvolvement,
        [muscle]: parseFloat(weight) || 0
      }
    }));
  };

  const removeNewExerciseMuscle = (muscle) => {
    setNewExercise(prev => {
      const newMuscleInvolvement = { ...prev.muscleInvolvement };
      delete newMuscleInvolvement[muscle];
      return {
        ...prev,
        muscleInvolvement: newMuscleInvolvement
      };
    });
  };

  const addNewExerciseMuscle = (muscle, weight) => {
    if (muscle && weight && !newExercise.muscleInvolvement[muscle]) {
      updateNewExerciseMuscleWeight(muscle, weight);
    }
  };

  // Get main exercises for variation selection
  const mainExercises = exercises.filter(ex => !ex.isVariation);

  const categories = ['Brust', 'Rücken', 'Schultern', 'Bizeps', 'Trizeps', 'Beine', 'Bauch_Rumpf'];
  const exerciseTypes = ['Verbundübung', 'Isolationsübung', 'Verbundübung (Körpergewicht)', 'Verbundübung (maschinenbasiert)', 'Isolationsübung'];

  return (
    <div>
            <PageHeader>
        <h1>Übungsbibliothek</h1>
        <Controls>
          <Button onClick={() => setShowCreateModal(true)}>
            Neue Übung hinzufügen
          </Button>
        </Controls>
      </PageHeader>

      <SortSection>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Suche & Sortierung</h3>
        <div style={{ marginBottom: '1rem' }}>
          <SearchInput 
            type="text" 
            placeholder="Suche..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <SortControls>
          <SortButton 
            active={sortBy === 'name'}
            onClick={() => handleSort('name')}
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </SortButton>
          <SortButton 
            active={sortBy === 'category'}
            onClick={() => handleSort('category')}
          >
            Kategorie {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
          </SortButton>
          <SortButton 
            active={sortBy === 'type'}
            onClick={() => handleSort('type')}
          >
            Übungstyp {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
          </SortButton>
          <SortButton 
            active={sortBy === 'primaryMuscle'}
            onClick={() => handleSort('primaryMuscle')}
          >
            Hauptmuskel {sortBy === 'primaryMuscle' && (sortOrder === 'asc' ? '↑' : '↓')}
          </SortButton>
        </SortControls>
      </SortSection>

      <ExercisesContainer>
        <ResultsCounter>
          {filteredAndSortedExercises.length} Übungen gefunden
        </ResultsCounter>
        
        {filteredAndSortedExercises.length > 0 ? (
          <ExerciseGrid>
            {filteredAndSortedExercises.map(exercise => (
              <ExerciseCard key={exercise.id} onClick={() => handleExerciseClick(exercise)}>
                <Card.Header>
                  {exercise.name}
                  {exercise.isVariation && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                      Variation von: {exercise.parentExercise}
                    </div>
                  )}
                </Card.Header>
                <Card.Body>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Kategorie:</strong> {exercise.category}
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Übungstyp:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      <ExerciseType>{exercise.type}</ExerciseType>
                    </div>
                  </div>

                  <MuscleInvolvementSection>
                    <strong>Muskelbeteiligung pro Satz:</strong>
                    {Object.entries(exercise.muscleInvolvement || {}).map(([muscle, weight]) => (
                      <MuscleInvolvementItem key={muscle}>
                        <span>{muscle}</span>
                        <MuscleWeight weight={weight}>
                          {(weight * 100).toFixed(0)}%
                        </MuscleWeight>
                      </MuscleInvolvementItem>
                    ))}
                  </MuscleInvolvementSection>

                  {exercise.equipment && exercise.equipment.length > 0 && (
                    <EquipmentSection>
                      <strong>Ausrüstung:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {exercise.equipment.map(eq => (
                          <EquipmentTag key={eq}>{eq}</EquipmentTag>
                        ))}
                      </div>
                    </EquipmentSection>
                  )}

                  {exercise.description && (
                    <Description>{exercise.description}</Description>
                  )}

                  {exercise.variations && exercise.variations.length > 0 && (
                    <VariationsInfo>
                      {exercise.variations.length} Variationen verfügbar
                    </VariationsInfo>
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

      {/* Edit Modal */}
      {showEditModal && editingExercise && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Übung bearbeiten</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>

            <FormGroup>
              <Label>Übungsname</Label>
              <Input 
                type="text" 
                value={editingExercise.name}
                onChange={(e) => setEditingExercise(prev => ({ ...prev, name: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Übungstyp</Label>
              <Input 
                type="text" 
                value={editingExercise.type}
                onChange={(e) => setEditingExercise(prev => ({ ...prev, type: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Beschreibung</Label>
              <TextArea 
                value={editingExercise.description || ''}
                onChange={(e) => setEditingExercise(prev => ({ ...prev, description: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Muskelbeteiligung pro Satz (0.0 - 1.0)</Label>
              {Object.entries(editingExercise.muscleInvolvement || {}).map(([muscle, weight]) => (
                <MuscleWeightEditor key={muscle}>
                  <span>{muscle}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <MuscleWeightInput 
                      type="number" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={weight}
                      onChange={(e) => updateMuscleWeight(muscle, e.target.value)}
                    />
                    <Button 
                      onClick={() => removeMuscle(muscle)}
                      style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: '#dc3545' }}
                    >
                      ×
                    </Button>
                  </div>
                </MuscleWeightEditor>
              ))}
              
              <AddMuscleSection>
                <h4 style={{ marginTop: 0 }}>Neue Muskelgruppe hinzufügen</h4>
                <AddMuscleRow>
                  <Input 
                    type="text" 
                    placeholder="Muskelgruppe"
                    id="newMuscle"
                    style={{ flex: 1 }}
                  />
                  <MuscleWeightInput 
                    type="number" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    placeholder="0.0"
                    id="newWeight"
                  />
                  <Button 
                    onClick={() => {
                      const muscle = document.getElementById('newMuscle').value;
                      const weight = document.getElementById('newWeight').value;
                      if (muscle && weight) {
                        addNewMuscle(muscle, weight);
                        document.getElementById('newMuscle').value = '';
                        document.getElementById('newWeight').value = '';
                      }
                    }}
                  >
                    Hinzufügen
                  </Button>
                </AddMuscleRow>
              </AddMuscleSection>
            </FormGroup>

            <FormGroup>
              <Label>Ausrüstung (kommagetrennt)</Label>
              <Input 
                type="text" 
                value={(editingExercise.equipment || []).join(', ')}
                onChange={(e) => setEditingExercise(prev => ({ 
                  ...prev, 
                  equipment: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
              />
            </FormGroup>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <Button onClick={handleCloseModal} style={{ backgroundColor: '#6c757d' }}>
                Abbrechen
              </Button>
              <Button onClick={handleSaveExercise}>
                Speichern
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <ModalOverlay onClick={handleCloseCreateModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Neue Übung erstellen</ModalTitle>
              <CloseButton onClick={handleCloseCreateModal}>&times;</CloseButton>
            </ModalHeader>

            <FormGroup>
              <Label>Übungsname</Label>
              <Input 
                type="text" 
                value={newExercise.name}
                onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. Bankdrücken (Kurzhantel)"
              />
            </FormGroup>

            <FormGroup>
              <Label>Kategorie</Label>
              <select 
                value={newExercise.category}
                onChange={(e) => setNewExercise(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup>
              <Label>Übungstyp</Label>
              <select 
                value={newExercise.type}
                onChange={(e) => setNewExercise(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                {exerciseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={newExercise.isVariation}
                  onChange={(e) => setNewExercise(prev => ({ 
                    ...prev, 
                    isVariation: e.target.checked,
                    parentExercise: e.target.checked ? prev.parentExercise : ''
                  }))}
                />
                <Label style={{ margin: 0, cursor: 'pointer' }}>
                  Dies ist eine Variation einer bestehenden Übung
                </Label>
              </div>
            </FormGroup>

            {newExercise.isVariation && (
              <FormGroup>
                <Label>Hauptübung auswählen</Label>
                <select 
                  value={newExercise.parentExercise}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, parentExercise: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">-- Hauptübung wählen --</option>
                  {mainExercises.map(ex => (
                    <option key={ex.id} value={ex.name}>{ex.name}</option>
                  ))}
                </select>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Beschreibung</Label>
              <TextArea 
                value={newExercise.description}
                onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beschreibung der Übung..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Muskelbeteiligung pro Satz (0.0 - 1.0)</Label>
              {Object.entries(newExercise.muscleInvolvement).map(([muscle, weight]) => (
                <MuscleWeightEditor key={muscle}>
                  <span>{muscle}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <MuscleWeightInput 
                      type="number" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={weight}
                      onChange={(e) => updateNewExerciseMuscleWeight(muscle, e.target.value)}
                    />
                    <Button 
                      onClick={() => removeNewExerciseMuscle(muscle)}
                      style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: '#dc3545' }}
                    >
                      ×
                    </Button>
                  </div>
                </MuscleWeightEditor>
              ))}
              
              <AddMuscleSection>
                <h4 style={{ marginTop: 0 }}>Muskelgruppe hinzufügen</h4>
                <AddMuscleRow>
                  <Input 
                    type="text" 
                    placeholder="Muskelgruppe (z.B. Brust)"
                    id="newCreateMuscle"
                    style={{ flex: 1 }}
                  />
                  <MuscleWeightInput 
                    type="number" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    placeholder="1.0"
                    id="newCreateWeight"
                  />
                  <Button 
                    onClick={() => {
                      const muscle = document.getElementById('newCreateMuscle').value;
                      const weight = document.getElementById('newCreateWeight').value;
                      if (muscle && weight) {
                        addNewExerciseMuscle(muscle, weight);
                        document.getElementById('newCreateMuscle').value = '';
                        document.getElementById('newCreateWeight').value = '';
                      }
                    }}
                  >
                    Hinzufügen
                  </Button>
                </AddMuscleRow>
              </AddMuscleSection>
            </FormGroup>

            <FormGroup>
              <Label>Ausrüstung (kommagetrennt)</Label>
              <Input 
                type="text" 
                value={(newExercise.equipment || []).join(', ')}
                onChange={(e) => setNewExercise(prev => ({ 
                  ...prev, 
                  equipment: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
                placeholder="z.B. Langhantel, Hantelbank"
              />
            </FormGroup>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <Button onClick={handleCloseCreateModal} style={{ backgroundColor: '#6c757d' }}>
                Abbrechen
              </Button>
              <Button onClick={handleCreateExercise}>
                Übung erstellen
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default ExerciseLibrary; 