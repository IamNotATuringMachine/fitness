import React, { useState } from 'react';
import styled from 'styled-components';
import { useNutrition } from '../../context/NutritionContext';

const Container = styled.div`
  margin: 20px 0;
`;

const Card = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const CalorieDistribution = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: ${props => props.theme.colors.background2};
  border-radius: 4px;
`;

const DistributionRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MacroPercentage = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const SuggestionCard = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: ${props => props.theme.colors.background2};
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const SuggestionTitle = styled.h4`
  margin-top: 0;
  color: ${props => props.theme.colors.primary};
`;

function NutritionGoals() {
  const { state, dispatch } = useNutrition();
  const [goals, setGoals] = useState({
    calories: state.nutritionGoals.calories,
    protein: state.nutritionGoals.protein,
    carbs: state.nutritionGoals.carbs,
    fat: state.nutritionGoals.fat
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoals(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };
  
  const saveGoals = () => {
    dispatch({ 
      type: 'UPDATE_NUTRITION_GOALS', 
      payload: goals 
    });
    
    alert('Ernährungsziele wurden gespeichert!');
  };
  
  // Calculate percentages and energy distribution
  const calculateDistribution = () => {
    const proteinCalories = goals.protein * 4; // 4 calories per gram of protein
    const carbsCalories = goals.carbs * 4; // 4 calories per gram of carbs
    const fatCalories = goals.fat * 9; // 9 calories per gram of fat
    const totalCalories = proteinCalories + carbsCalories + fatCalories;
    
    return {
      proteinPercentage: totalCalories > 0 ? Math.round((proteinCalories / totalCalories) * 100) : 0,
      carbsPercentage: totalCalories > 0 ? Math.round((carbsCalories / totalCalories) * 100) : 0,
      fatPercentage: totalCalories > 0 ? Math.round((fatCalories / totalCalories) * 100) : 0,
      totalCalories
    };
  };
  
  const distribution = calculateDistribution();
  
  const applyPreset = (preset) => {
    setGoals(preset);
  };
  
  const calculateMacrosFromCalories = (calories, proteinPercent, carbsPercent, fatPercent) => {
    return {
      calories,
      protein: Math.round((calories * (proteinPercent / 100)) / 4), // 4 calories per gram of protein
      carbs: Math.round((calories * (carbsPercent / 100)) / 4), // 4 calories per gram of carbs
      fat: Math.round((calories * (fatPercent / 100)) / 9) // 9 calories per gram of fat
    };
  };
  
  const presets = [
    {
      name: 'Muskelaufbau',
      description: 'Höhere Kalorien und Proteinzufuhr für Muskelwachstum',
      goals: calculateMacrosFromCalories(3000, 30, 45, 25)
    },
    {
      name: 'Fettabbau',
      description: 'Kaloriendefizit mit höherem Proteinanteil',
      goals: calculateMacrosFromCalories(2000, 40, 30, 30)
    },
    {
      name: 'Ausgewogen',
      description: 'Ausgewogene Makroverteilung für allgemeine Gesundheit',
      goals: calculateMacrosFromCalories(2500, 25, 50, 25)
    },
    {
      name: 'Ketogen',
      description: 'Sehr wenig Kohlenhydrate, hoher Fettanteil',
      goals: calculateMacrosFromCalories(2200, 25, 5, 70)
    },
    {
      name: 'Vegetarisch/Vegan',
      description: 'Optimiert für pflanzliche Ernährung',
      goals: calculateMacrosFromCalories(2400, 20, 60, 20)
    }
  ];
  
  return (
    <Container>
      <h2>Ernährungsziele festlegen</h2>
      
      <Card>
        <h3>Deine täglichen Ziele</h3>
        
        <FormGroup>
          <Label>Kalorien (kcal)</Label>
          <Input 
            type="number" 
            name="calories"
            value={goals.calories} 
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Protein (g)</Label>
          <Input 
            type="number" 
            name="protein"
            value={goals.protein} 
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Kohlenhydrate (g)</Label>
          <Input 
            type="number" 
            name="carbs"
            value={goals.carbs} 
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Fett (g)</Label>
          <Input 
            type="number" 
            name="fat"
            value={goals.fat} 
            onChange={handleInputChange}
          />
        </FormGroup>
        
        <Button onClick={saveGoals}>Ziele speichern</Button>
        
        <CalorieDistribution>
          <h4>Makronährstoffverteilung</h4>
          
          <DistributionRow>
            <div>Protein:</div>
            <MacroPercentage>{distribution.proteinPercentage}%</MacroPercentage>
          </DistributionRow>
          
          <DistributionRow>
            <div>Kohlenhydrate:</div>
            <MacroPercentage>{distribution.carbsPercentage}%</MacroPercentage>
          </DistributionRow>
          
          <DistributionRow>
            <div>Fett:</div>
            <MacroPercentage>{distribution.fatPercentage}%</MacroPercentage>
          </DistributionRow>
          
          <DistributionRow>
            <div>Berechnete Kalorien:</div>
            <MacroPercentage>{distribution.totalCalories} kcal</MacroPercentage>
          </DistributionRow>
          
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            {Math.abs(goals.calories - distribution.totalCalories) > 50 && (
              <div style={{ color: 'orange' }}>
                Hinweis: Die berechneten Kalorien weichen von deinem Ziel ab. 
                Möglicherweise musst du die Makronährstoffe anpassen.
              </div>
            )}
          </div>
        </CalorieDistribution>
      </Card>
      
      <h3>Vorschläge für Ziele</h3>
      <p>Wähle einen vordefinierten Plan als Ausgangspunkt:</p>
      
      {presets.map((preset, index) => (
        <SuggestionCard key={index} onClick={() => applyPreset(preset.goals)}>
          <SuggestionTitle>{preset.name}</SuggestionTitle>
          <p>{preset.description}</p>
          <div>
            {preset.goals.calories} kcal | P: {preset.goals.protein}g | K: {preset.goals.carbs}g | F: {preset.goals.fat}g
          </div>
        </SuggestionCard>
      ))}
    </Container>
  );
}

export default NutritionGoals; 