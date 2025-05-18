import React, { useState, useEffect } from 'react';
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

const Suggestion = styled.div`
  background-color: white;
  border-left: 4px solid #007bff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const SuggestionTitle = styled.h4`
  color: #007bff;
  margin-bottom: 8px;
`;

const SuggestionDescription = styled.p`
  margin-bottom: 10px;
  color: #495057;
`;

const ApplyButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const DismissButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const NoSuggestionsMessage = styled.p`
  color: #6c757d;
  font-style: italic;
`;

const AIAssistant = ({ workoutHistory, currentPlan, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (workoutHistory && currentPlan) {
      // Generate suggestions based on workout history and current plan
      const generatedSuggestions = generateSuggestions(workoutHistory, currentPlan);
      setSuggestions(generatedSuggestions);
    }
  }, [workoutHistory, currentPlan]);

  const generateSuggestions = (history, plan) => {
    const suggestions = [];
    
    // Check for plateaus in major lifts
    const plateaus = detectPlateaus(history);
    if (plateaus.length > 0) {
      plateaus.forEach(plateau => {
        suggestions.push({
          id: `plateau-${plateau.exercise}`,
          title: `Plateau bei ${plateau.exercise}`,
          description: `Du machst seit ${plateau.weeks} Wochen keine Fortschritte bei ${plateau.exercise}. Probiere eine der folgenden Strategien: Ändere das Volumen, variiere die Intensität oder füge eine alternative Übung hinzu.`,
          type: 'plateau',
          data: plateau
        });
      });
    }
    
    // Check for overtraining risk
    const overtrainingRisks = detectOvertrainingRisks(history, plan);
    if (overtrainingRisks.length > 0) {
      overtrainingRisks.forEach(risk => {
        suggestions.push({
          id: `overtraining-${risk.muscleGroup}`,
          title: `Übertrainingsrisiko: ${risk.muscleGroup}`,
          description: `Du trainierst die ${risk.muscleGroup} möglicherweise zu häufig (${risk.frequency}x pro Woche). Erwäge, mehr Ruhetage zwischen den Trainingseinheiten für diese Muskelgruppe einzuplanen.`,
          type: 'overtraining',
          data: risk
        });
      });
    }
    
    // Suggest progression opportunities
    const progressionOpportunities = identifyProgressionOpportunities(history, plan);
    if (progressionOpportunities.length > 0) {
      progressionOpportunities.forEach(opportunity => {
        suggestions.push({
          id: `progression-${opportunity.exercise}`,
          title: `Progressionsmöglichkeit: ${opportunity.exercise}`,
          description: `Du hast das Ziel für ${opportunity.exercise} konsistent erreicht. Zeit für eine Steigerung um ${opportunity.suggestedIncrease} ${opportunity.unit}.`,
          type: 'progression',
          data: opportunity
        });
      });
    }
    
    return suggestions;
  };
  
  const detectPlateaus = (history) => {
    // This would analyze the workout history to detect exercises where progress has stalled
    // For demo purposes, we'll return sample data
    return [
      { exercise: 'Bankdrücken', weeks: 3, currentWeight: 80, reps: 8 },
      { exercise: 'Kniebeugen', weeks: 2, currentWeight: 100, reps: 6 }
    ];
  };
  
  const detectOvertrainingRisks = (history, plan) => {
    // This would analyze both history and plan to identify potential overtraining
    // For demo purposes, we'll return sample data
    return [
      { muscleGroup: 'Brust', frequency: 4, lastTrainingDates: ['2023-06-01', '2023-06-03', '2023-06-05', '2023-06-07'] },
      { muscleGroup: 'Beine', frequency: 3, lastTrainingDates: ['2023-06-02', '2023-06-04', '2023-06-06'] }
    ];
  };
  
  const identifyProgressionOpportunities = (history, plan) => {
    // This would identify exercises where the user has been consistently meeting targets
    // For demo purposes, we'll return sample data
    return [
      { exercise: 'Klimmzüge', suggestedIncrease: 1, unit: 'Wiederholung', currentTarget: 8, consecutiveSuccesses: 3 },
      { exercise: 'Schulterdrücken', suggestedIncrease: 2.5, unit: 'kg', currentWeight: 40, consecutiveSuccesses: 4 }
    ];
  };

  const handleApply = (suggestion) => {
    onApplySuggestion(suggestion);
    
    // Remove the suggestion from the list
    setSuggestions(prevSuggestions => 
      prevSuggestions.filter(s => s.id !== suggestion.id)
    );
  };

  const handleDismiss = (suggestionId) => {
    setSuggestions(prevSuggestions => 
      prevSuggestions.filter(s => s.id !== suggestionId)
    );
  };

  return (
    <Container>
      <Title>KI-Trainingsassistent</Title>
      
      {suggestions.length > 0 ? (
        suggestions.map(suggestion => (
          <Suggestion key={suggestion.id}>
            <SuggestionTitle>{suggestion.title}</SuggestionTitle>
            <SuggestionDescription>{suggestion.description}</SuggestionDescription>
            <div>
              <ApplyButton onClick={() => handleApply(suggestion)}>Anwenden</ApplyButton>
              <DismissButton onClick={() => handleDismiss(suggestion.id)}>Ignorieren</DismissButton>
            </div>
          </Suggestion>
        ))
      ) : (
        <NoSuggestionsMessage>
          Keine Vorschläge verfügbar. Trainiere weiter und zeichne deine Fortschritte auf, um personalisierte Empfehlungen zu erhalten.
        </NoSuggestionsMessage>
      )}
    </Container>
  );
};

export default AIAssistant; 