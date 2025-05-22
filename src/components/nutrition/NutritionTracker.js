import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNutrition } from '../../context/NutritionContext';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Button, Spinner } from '../../components/ui';

// Create a ButtonSecondary as a styled extension of Button
const ButtonSecondary = styled(Button).attrs({ variant: 'secondary' })`
  /* Any additional custom styles for ButtonSecondary can go here */
`;

const Container = styled.div`
  margin: 20px 0;
`;

const TrackerCard = styled.div`
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

const ProgressContainer = styled.div`
  margin: 20px 0;
`;

const ProgressBar = styled.div`
  height: 20px;
  background-color: ${props => props.theme.colors.background2};
  border-radius: 10px;
  margin-bottom: 5px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => Math.min(100, props.percentage)}%;
  background-color: ${props => props.percentage > 100 
    ? props.theme.colors.error 
    : props.theme.colors.primary};
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const FoodList = styled.div`
  margin-top: 20px;
`;

const FoodItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const FoodDetails = styled.div`
  flex: 1;
`;

const FoodName = styled.div`
  font-weight: bold;
`;

const FoodMacros = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const FoodActions = styled.div`
  display: flex;
  gap: 5px;
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

const DateSelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const DateButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
`;

const CurrentDate = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 15px;
`;

const MacroSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  padding: 15px;
  background-color: ${props => props.theme.colors.background2};
  border-radius: 4px;
`;

const MacroItem = styled.div`
  text-align: center;
  min-width: 80px;
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

function NutritionTracker() {
  const { state, dispatch } = useNutrition();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedMeal, setSelectedMeal] = useState('Frühstück');
  const [dailyLog, setDailyLog] = useState(null);
  
  // Format the date for display and as a key for storage
  const dateFormatted = format(selectedDate, 'yyyy-MM-dd');
  const displayDate = format(selectedDate, 'dd. MMMM yyyy');
  
  // Find existing log for the selected date or create a new one
  useEffect(() => {
    const existingLog = state.dailyLogs.find(log => log.date === dateFormatted);
    
    if (existingLog) {
      setDailyLog(existingLog);
    } else {
      setDailyLog({
        id: uuidv4(),
        date: dateFormatted,
        meals: {
          'Frühstück': [],
          'Mittagessen': [],
          'Abendessen': [],
          'Snacks': []
        },
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      });
    }
  }, [state.dailyLogs, dateFormatted]);
  
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  const addFoodToLog = () => {
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
      fat: Math.round(foodItem.fat * scaleFactor * 10) / 10,
      time: format(new Date(), 'HH:mm')
    };
    
    // Create updated log
    const updatedLog = { ...dailyLog };
    
    // Create the meal category if it doesn't exist
    if (!updatedLog.meals[selectedMeal]) {
      updatedLog.meals[selectedMeal] = [];
    }
    
    // Add food to the selected meal
    updatedLog.meals[selectedMeal] = [...updatedLog.meals[selectedMeal], foodEntry];
    
    // Recalculate totals
    updatedLog.totals = calculateTotals(updatedLog);
    
    // Save updated log
    if (state.dailyLogs.some(log => log.id === updatedLog.id)) {
      dispatch({ type: 'UPDATE_DAILY_LOG', payload: updatedLog });
    } else {
      dispatch({ type: 'ADD_DAILY_LOG', payload: updatedLog });
    }
    
    // Reset form
    setSelectedFoodId('');
    setSelectedAmount(100);
  };
  
  const removeFood = (mealName, foodId) => {
    // Create a copy of the current log
    const updatedLog = { ...dailyLog };
    
    // Remove the food item from the specified meal
    updatedLog.meals[mealName] = updatedLog.meals[mealName].filter(food => food.id !== foodId);
    
    // Recalculate totals
    updatedLog.totals = calculateTotals(updatedLog);
    
    // Update the log
    dispatch({ type: 'UPDATE_DAILY_LOG', payload: updatedLog });
  };
  
  const calculateTotals = (log) => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    Object.values(log.meals).forEach(mealFoods => {
      mealFoods.forEach(food => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
      });
    });
    
    return totals;
  };
  
  // Calculate percentage of goals met
  const calculatePercentage = (current, goal) => {
    if (!goal) return 0;
    return (current / goal) * 100;
  };
  
  if (!dailyLog) return <Spinner centered size="60px" />;
  
  return (
    <Container>
      <h2>Ernährungstracker</h2>
      
      <DateSelector>
        <DateButton onClick={() => changeDate(-1)}>«</DateButton>
        <CurrentDate>{displayDate}</CurrentDate>
        <DateButton onClick={() => changeDate(1)}>»</DateButton>
        <ButtonSecondary onClick={goToToday}>Heute</ButtonSecondary>
      </DateSelector>
      
      <TrackerCard>
        <h3>Lebensmittel hinzufügen</h3>
        
        <FormGroup>
          <Label>Mahlzeit</Label>
          <Select 
            value={selectedMeal} 
            onChange={(e) => setSelectedMeal(e.target.value)}
          >
            <option value="Frühstück">Frühstück</option>
            <option value="Mittagessen">Mittagessen</option>
            <option value="Abendessen">Abendessen</option>
            <option value="Snacks">Snacks</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Lebensmittel</Label>
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
        </FormGroup>
        
        <FormGroup>
          <Label>Menge (g)</Label>
          <Input 
            type="number" 
            value={selectedAmount} 
            onChange={(e) => setSelectedAmount(Number(e.target.value))}
          />
        </FormGroup>
        
        <Button onClick={addFoodToLog}>Hinzufügen</Button>
      </TrackerCard>
      
      <TrackerCard>
        <h3>Heutiger Fortschritt</h3>
        
        <ProgressContainer>
          <Label>Kalorien</Label>
          <ProgressBar>
            <ProgressFill 
              percentage={calculatePercentage(dailyLog.totals.calories, state.nutritionGoals.calories)} 
            />
          </ProgressBar>
          <ProgressLabel>
            <span>{dailyLog.totals.calories} kcal</span>
            <span>{state.nutritionGoals.calories} kcal</span>
          </ProgressLabel>
        </ProgressContainer>
        
        <ProgressContainer>
          <Label>Protein</Label>
          <ProgressBar>
            <ProgressFill 
              percentage={calculatePercentage(dailyLog.totals.protein, state.nutritionGoals.protein)} 
            />
          </ProgressBar>
          <ProgressLabel>
            <span>{dailyLog.totals.protein} g</span>
            <span>{state.nutritionGoals.protein} g</span>
          </ProgressLabel>
        </ProgressContainer>
        
        <ProgressContainer>
          <Label>Kohlenhydrate</Label>
          <ProgressBar>
            <ProgressFill 
              percentage={calculatePercentage(dailyLog.totals.carbs, state.nutritionGoals.carbs)} 
            />
          </ProgressBar>
          <ProgressLabel>
            <span>{dailyLog.totals.carbs} g</span>
            <span>{state.nutritionGoals.carbs} g</span>
          </ProgressLabel>
        </ProgressContainer>
        
        <ProgressContainer>
          <Label>Fett</Label>
          <ProgressBar>
            <ProgressFill 
              percentage={calculatePercentage(dailyLog.totals.fat, state.nutritionGoals.fat)} 
            />
          </ProgressBar>
          <ProgressLabel>
            <span>{dailyLog.totals.fat} g</span>
            <span>{state.nutritionGoals.fat} g</span>
          </ProgressLabel>
        </ProgressContainer>
        
        <MacroSummary>
          <MacroItem>
            <MacroValue>{dailyLog.totals.calories}</MacroValue>
            <MacroLabel>Kalorien</MacroLabel>
          </MacroItem>
          <MacroItem>
            <MacroValue>{dailyLog.totals.protein}g</MacroValue>
            <MacroLabel>Protein</MacroLabel>
          </MacroItem>
          <MacroItem>
            <MacroValue>{dailyLog.totals.carbs}g</MacroValue>
            <MacroLabel>Kohlenhydrate</MacroLabel>
          </MacroItem>
          <MacroItem>
            <MacroValue>{dailyLog.totals.fat}g</MacroValue>
            <MacroLabel>Fett</MacroLabel>
          </MacroItem>
        </MacroSummary>
      </TrackerCard>
      
      <TrackerCard>
        <h3>Heutige Mahlzeiten</h3>
        
        {Object.entries(dailyLog.meals).map(([mealName, foods]) => (
          <div key={mealName}>
            <h4>{mealName}</h4>
            
            {foods.length === 0 ? (
              <p>Keine Lebensmittel für {mealName} eingetragen.</p>
            ) : (
              <FoodList>
                {foods.map(food => (
                  <FoodItem key={food.id}>
                    <FoodDetails>
                      <FoodName>{food.name} - {food.amount}g</FoodName>
                      <FoodMacros>
                        {food.calories} kcal | P: {food.protein}g | K: {food.carbs}g | F: {food.fat}g
                        {food.time && ` | ${food.time}`}
                      </FoodMacros>
                    </FoodDetails>
                    <FoodActions>
                      <IconButton danger onClick={() => removeFood(mealName, food.id)}>✕</IconButton>
                    </FoodActions>
                  </FoodItem>
                ))}
              </FoodList>
            )}
          </div>
        ))}
      </TrackerCard>
    </Container>
  );
}

export default NutritionTracker; 