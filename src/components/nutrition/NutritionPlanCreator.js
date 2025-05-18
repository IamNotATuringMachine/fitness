import React, { useState } from 'react';
import styled from 'styled-components';
import { useNutrition } from '../../context/NutritionContext';
import { v4 as uuidv4 } from 'uuid';

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

const Select = styled.select`
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

const MealContainer = styled.div`
  margin-bottom: 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  padding: 15px;
`;

const MealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FoodItemRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.danger ? props.theme.colors.error : props.theme.colors.text};
  font-size: 1rem;
  
  &:hover {
    color: ${props => props.danger ? props.theme.colors.errorDark : props.theme.colors.primary};
  }
`;

const MacroSummary = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding: 15px;
  background-color: ${props => props.theme.colors.background2};
  border-radius: 4px;
`;

const MacroItem = styled.div`
  text-align: center;
`;

const MacroValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const MacroLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

function NutritionPlanCreator() {
  const { state, dispatch } = useNutrition();
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [meals, setMeals] = useState([
    {
      id: uuidv4(),
      name: 'Frühstück',
      time: '08:00',
      foods: []
    }
  ]);
  
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(100);
  
  const addMeal = () => {
    setMeals([...meals, {
      id: uuidv4(),
      name: `Mahlzeit ${meals.length + 1}`,
      time: '',
      foods: []
    }]);
  };
  
  const updateMeal = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: value
    };
    setMeals(updatedMeals);
  };
  
  const removeMeal = (index) => {
    if (meals.length > 1) {
      const updatedMeals = [...meals];
      updatedMeals.splice(index, 1);
      setMeals(updatedMeals);
      if (currentMealIndex >= updatedMeals.length) {
        setCurrentMealIndex(updatedMeals.length - 1);
      }
    }
  };
  
  const addFoodToMeal = () => {
    if (!selectedFoodId || selectedAmount <= 0) return;
    
    const foodItem = state.foodItems.find(item => item.id === selectedFoodId);
    if (!foodItem) return;
    
    const scaleFactor = selectedAmount / 100; // Assuming base portion is 100g
    
    const foodEntry = {
      id: uuidv4(),
      foodId: foodItem.id,
      name: foodItem.name,
      amount: selectedAmount,
      calories: Math.round(foodItem.calories * scaleFactor),
      protein: Math.round(foodItem.protein * scaleFactor * 10) / 10,
      carbs: Math.round(foodItem.carbs * scaleFactor * 10) / 10,
      fat: Math.round(foodItem.fat * scaleFactor * 10) / 10
    };
    
    const updatedMeals = [...meals];
    updatedMeals[currentMealIndex].foods = [...updatedMeals[currentMealIndex].foods, foodEntry];
    setMeals(updatedMeals);
    
    // Reset selection
    setSelectedFoodId('');
    setSelectedAmount(100);
  };
  
  const removeFoodFromMeal = (mealIndex, foodIndex) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].foods.splice(foodIndex, 1);
    setMeals(updatedMeals);
  };
  
  const calculateTotalMacros = () => {
    return meals.reduce((totals, meal) => {
      meal.foods.forEach(food => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
      });
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };
  
  const savePlan = () => {
    if (!planName) {
      alert('Bitte geben Sie einen Namen für den Ernährungsplan ein.');
      return;
    }
    
    const newPlan = {
      id: uuidv4(),
      name: planName,
      description: planDescription,
      meals: meals,
      createdAt: new Date().toISOString(),
      totalMacros: calculateTotalMacros()
    };
    
    dispatch({ type: 'ADD_NUTRITION_PLAN', payload: newPlan });
    
    // Reset form
    setPlanName('');
    setPlanDescription('');
    setMeals([
      {
        id: uuidv4(),
        name: 'Frühstück',
        time: '08:00',
        foods: []
      }
    ]);
    setCurrentMealIndex(0);
    
    alert('Ernährungsplan erfolgreich gespeichert!');
  };
  
  const totals = calculateTotalMacros();
  
  return (
    <Container>
      <h2>Erstelle einen Ernährungsplan</h2>
      
      <Card>
        <FormGroup>
          <Label>Name des Plans</Label>
          <Input 
            type="text" 
            value={planName} 
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="z.B. Aufbauplan, Diät-Plan, etc."
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Beschreibung</Label>
          <Input 
            type="text" 
            value={planDescription} 
            onChange={(e) => setPlanDescription(e.target.value)}
            placeholder="Beschreibe den Zweck des Plans"
          />
        </FormGroup>
        
        <h3>Mahlzeiten</h3>
        
        <div>
          {meals.map((meal, index) => (
            <MealContainer key={meal.id}>
              <MealHeader>
                <h4>{meal.name}</h4>
                <IconButton danger onClick={() => removeMeal(index)}>✕</IconButton>
              </MealHeader>
              
              <FormGroup>
                <Label>Name der Mahlzeit</Label>
                <Input 
                  type="text" 
                  value={meal.name} 
                  onChange={(e) => updateMeal(index, 'name', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Uhrzeit</Label>
                <Input 
                  type="time" 
                  value={meal.time} 
                  onChange={(e) => updateMeal(index, 'time', e.target.value)}
                />
              </FormGroup>
              
              {index === currentMealIndex && (
                <div>
                  <h5>Lebensmittel hinzufügen</h5>
                  <FoodItemRow>
                    <div style={{ flex: 2 }}>
                      <Select 
                        value={selectedFoodId} 
                        onChange={(e) => setSelectedFoodId(e.target.value)}
                      >
                        <option value="">-- Lebensmittel auswählen --</option>
                        {state.foodItems.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.calories} kcal / {item.portion})
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Input 
                        type="number" 
                        value={selectedAmount} 
                        onChange={(e) => setSelectedAmount(Number(e.target.value))}
                        placeholder="Menge (g)"
                      />
                    </div>
                    <Button onClick={addFoodToMeal}>Hinzufügen</Button>
                  </FoodItemRow>
                </div>
              )}
              
              {meal.foods.length > 0 && (
                <div>
                  <h5>Enthaltene Lebensmittel</h5>
                  {meal.foods.map((food, foodIndex) => (
                    <FoodItemRow key={food.id}>
                      <div style={{ flex: 2 }}>{food.name}</div>
                      <div style={{ flex: 1 }}>{food.amount}g</div>
                      <div style={{ flex: 1 }}>{food.calories} kcal</div>
                      <IconButton danger onClick={() => removeFoodFromMeal(index, foodIndex)}>✕</IconButton>
                    </FoodItemRow>
                  ))}
                </div>
              )}
              
              <Button onClick={() => setCurrentMealIndex(index)}>
                {index === currentMealIndex ? 'Bearbeiten' : 'Auswählen'}
              </Button>
            </MealContainer>
          ))}
          
          <Button onClick={addMeal}>+ Neue Mahlzeit</Button>
        </div>
        
        <MacroSummary>
          <MacroItem>
            <MacroValue>{totals.calories}</MacroValue>
            <MacroLabel>Kalorien</MacroLabel>
          </MacroItem>
          <MacroItem>
            <MacroValue>{totals.protein}g</MacroValue>
            <MacroLabel>Protein</MacroLabel>
          </MacroItem>
          <MacroItem>
            <MacroValue>{totals.carbs}g</MacroValue>
            <MacroLabel>Kohlenhydrate</MacroLabel>
          </MacroItem>
          <MacroItem>
            <MacroValue>{totals.fat}g</MacroValue>
            <MacroLabel>Fett</MacroLabel>
          </MacroItem>
        </MacroSummary>
        
        <Button onClick={savePlan} style={{ marginTop: '20px' }}>Ernährungsplan speichern</Button>
      </Card>
    </Container>
  );
}

export default NutritionPlanCreator; 