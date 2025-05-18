import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  color: #343a40;
  margin-bottom: 15px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ExerciseCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ExerciseName = styled.h4`
  color: #343a40;
  margin-bottom: 10px;
`;

const EffectivenessBar = styled.div`
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.value}%;
    background-color: ${props => {
      if (props.value > 80) return '#28a745';
      if (props.value > 60) return '#ffc107';
      return '#dc3545';
    }};
  }
`;

const EffectivenessLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 15px;
`;

const MuscleGroups = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const MuscleGroup = styled.span`
  background-color: #e9ecef;
  color: #495057;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const AlternativesTitle = styled.h5`
  color: #343a40;
  margin: 15px 0 10px;
`;

const AlternativesList = styled.div`
  margin-left: 10px;
`;

const AlternativeItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const AlternativeName = styled.span`
  margin-left: 10px;
`;

const ReplaceButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: auto;
  cursor: pointer;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const NoResultsMessage = styled.p`
  color: #6c757d;
  font-style: italic;
  text-align: center;
  margin-top: 20px;
`;

const ExerciseAlternatives = ({ onReplaceExercise }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: 'Klassisches Bankdrücken',
      effectiveness: 85,
      primaryMuscles: ['Brust', 'Trizeps', 'Vordere Schulter'],
      alternatives: [
        { id: 101, name: 'Kurzhantel-Bankdrücken', reason: 'Bessere Bewegungsfreiheit für die Schultergelenke' },
        { id: 102, name: 'Schrägbankdrücken', reason: 'Stärkere Fokussierung auf die obere Brustmuskulatur' },
        { id: 103, name: 'Push-Ups', reason: 'Weniger Belastung für die Schultern, kein Equipment nötig' }
      ]
    },
    {
      id: 2,
      name: 'Langhantel-Kniebeugen',
      effectiveness: 90,
      primaryMuscles: ['Quadrizeps', 'Gesäßmuskulatur', 'Unterer Rücken'],
      alternatives: [
        { id: 201, name: 'Goblet Squats', reason: 'Weniger Belastung für den unteren Rücken' },
        { id: 202, name: 'Split Squats', reason: 'Mehr Balance und Stabilität, einseitige Belastung' },
        { id: 203, name: 'Beinpresse', reason: 'Kontrollierte Bewegung, weniger technisch anspruchsvoll' }
      ]
    },
    {
      id: 3,
      name: 'Klimmzüge',
      effectiveness: 88,
      primaryMuscles: ['Latissimus', 'Bizeps', 'Oberer Rücken'],
      alternatives: [
        { id: 301, name: 'Lat-Pulldown', reason: 'Kontrolliertere Bewegung, anpassbare Gewichte' },
        { id: 302, name: 'Rudern am Kabelzug', reason: 'Fokus auf mittleren Rücken, weniger Bizeps-Beteiligung' },
        { id: 303, name: 'Assisted Pull-Ups', reason: 'Ähnliche Bewegung, aber mit Unterstützung' }
      ]
    }
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReplaceExercise = (originalExerciseId, alternativeId, alternativeName) => {
    // Find the original exercise and the selected alternative
    const originalExercise = exercises.find(ex => ex.id === originalExerciseId);
    const alternativeExercise = originalExercise.alternatives.find(alt => alt.id === alternativeId);
    
    if (onReplaceExercise && originalExercise && alternativeExercise) {
      onReplaceExercise(originalExerciseId, alternativeId, alternativeName);
    }
  };

  // Filter exercises based on search term
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container>
      <Title>Übungsbewertung & Alternativen</Title>
      
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Suche nach Übung oder Muskelgruppe..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchContainer>
      
      {filteredExercises.length > 0 ? (
        filteredExercises.map(exercise => (
          <ExerciseCard key={exercise.id}>
            <ExerciseName>{exercise.name}</ExerciseName>
            
            <EffectivenessLabel>
              <span>Effektivität</span>
              <span>{exercise.effectiveness}%</span>
            </EffectivenessLabel>
            <EffectivenessBar value={exercise.effectiveness} />
            
            <MuscleGroups>
              {exercise.primaryMuscles.map(muscle => (
                <MuscleGroup key={muscle}>{muscle}</MuscleGroup>
              ))}
            </MuscleGroups>
            
            <AlternativesTitle>Alternativen</AlternativesTitle>
            <AlternativesList>
              {exercise.alternatives.map(alternative => (
                <AlternativeItem key={alternative.id}>
                  <AlternativeName>{alternative.name}</AlternativeName>
                  <ReplaceButton 
                    onClick={() => handleReplaceExercise(exercise.id, alternative.id, alternative.name)}
                  >
                    Ersetzen
                  </ReplaceButton>
                </AlternativeItem>
              ))}
            </AlternativesList>
          </ExerciseCard>
        ))
      ) : (
        <NoResultsMessage>
          Keine Übungen gefunden. Versuche einen anderen Suchbegriff.
        </NoResultsMessage>
      )}
    </Container>
  );
};

export default ExerciseAlternatives; 