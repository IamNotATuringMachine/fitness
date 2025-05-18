import React, { useState } from 'react';
import styled from 'styled-components';
import { useNutrition } from '../../context/NutritionContext';
import { format } from 'date-fns';

const Container = styled.div`
  margin: 20px 0;
`;

const PlanCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PlanTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.primary};
`;

const PlanDate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PlanDescription = styled.p`
  color: ${props => props.theme.colors.text};
  margin-bottom: 15px;
`;

const MacroSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
  padding: 10px;
  background-color: ${props => props.theme.colors.background2};
  border-radius: 4px;
`;

const MacroItem = styled.div`
  text-align: center;
  min-width: 60px;
`;

const MacroValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const MacroLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MealSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const MealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const MealTitle = styled.h4`
  margin: 0;
  color: ${props => props.theme.colors.primary};
`;

const MealTime = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const FoodTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  th {
    font-weight: bold;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.danger ? props.theme.colors.errorDark : props.theme.colors.primaryDark};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.colors.textSecondary};
`;

function NutritionPlanList() {
  const { state, dispatch } = useNutrition();
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return 'Unbekanntes Datum';
    }
  };
  
  const openPlanDetails = (plan) => {
    setSelectedPlan(plan);
  };
  
  const closePlanDetails = () => {
    setSelectedPlan(null);
  };
  
  const deletePlan = (id, event) => {
    event.stopPropagation();
    if (window.confirm('Möchten Sie diesen Ernährungsplan wirklich löschen?')) {
      dispatch({ type: 'DELETE_NUTRITION_PLAN', payload: id });
      if (selectedPlan && selectedPlan.id === id) {
        setSelectedPlan(null);
      }
    }
  };
  
  return (
    <Container>
      <h2>Meine Ernährungspläne</h2>
      
      {state.nutritionPlans.length === 0 ? (
        <EmptyState>
          <p>Sie haben noch keine Ernährungspläne erstellt.</p>
        </EmptyState>
      ) : (
        state.nutritionPlans.map(plan => (
          <PlanCard key={plan.id} onClick={() => openPlanDetails(plan)}>
            <PlanHeader>
              <PlanTitle>{plan.name}</PlanTitle>
              <PlanDate>Erstellt am: {formatDate(plan.createdAt)}</PlanDate>
            </PlanHeader>
            
            <PlanDescription>{plan.description}</PlanDescription>
            
            <div>{plan.meals.length} Mahlzeiten</div>
            
            <MacroSummary>
              <MacroItem>
                <MacroValue>{plan.totalMacros?.calories || 0}</MacroValue>
                <MacroLabel>Kalorien</MacroLabel>
              </MacroItem>
              <MacroItem>
                <MacroValue>{plan.totalMacros?.protein || 0}g</MacroValue>
                <MacroLabel>Protein</MacroLabel>
              </MacroItem>
              <MacroItem>
                <MacroValue>{plan.totalMacros?.carbs || 0}g</MacroValue>
                <MacroLabel>Kohlenhydrate</MacroLabel>
              </MacroItem>
              <MacroItem>
                <MacroValue>{plan.totalMacros?.fat || 0}g</MacroValue>
                <MacroLabel>Fett</MacroLabel>
              </MacroItem>
            </MacroSummary>
            
            <ButtonGroup onClick={(e) => e.stopPropagation()}>
              <Button danger onClick={(e) => deletePlan(plan.id, e)}>Löschen</Button>
            </ButtonGroup>
          </PlanCard>
        ))
      )}
      
      {selectedPlan && (
        <ModalBackdrop onClick={closePlanDetails}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closePlanDetails}>✕</CloseButton>
            
            <h2>{selectedPlan.name}</h2>
            <PlanDate>Erstellt am: {formatDate(selectedPlan.createdAt)}</PlanDate>
            <PlanDescription>{selectedPlan.description}</PlanDescription>
            
            <MacroSummary>
              <MacroItem>
                <MacroValue>{selectedPlan.totalMacros?.calories || 0}</MacroValue>
                <MacroLabel>Kalorien</MacroLabel>
              </MacroItem>
              <MacroItem>
                <MacroValue>{selectedPlan.totalMacros?.protein || 0}g</MacroValue>
                <MacroLabel>Protein</MacroLabel>
              </MacroItem>
              <MacroItem>
                <MacroValue>{selectedPlan.totalMacros?.carbs || 0}g</MacroValue>
                <MacroLabel>Kohlenhydrate</MacroLabel>
              </MacroItem>
              <MacroItem>
                <MacroValue>{selectedPlan.totalMacros?.fat || 0}g</MacroValue>
                <MacroLabel>Fett</MacroLabel>
              </MacroItem>
            </MacroSummary>
            
            <h3>Mahlzeiten</h3>
            
            {selectedPlan.meals.map(meal => (
              <MealSection key={meal.id}>
                <MealHeader>
                  <MealTitle>{meal.name}</MealTitle>
                  {meal.time && <MealTime>Zeit: {meal.time}</MealTime>}
                </MealHeader>
                
                {meal.foods.length === 0 ? (
                  <p>Keine Lebensmittel für diese Mahlzeit.</p>
                ) : (
                  <FoodTable>
                    <thead>
                      <tr>
                        <th>Lebensmittel</th>
                        <th>Menge</th>
                        <th>Kalorien</th>
                        <th>Protein</th>
                        <th>Kohlenhydrate</th>
                        <th>Fett</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meal.foods.map(food => (
                        <tr key={food.id}>
                          <td>{food.name}</td>
                          <td>{food.amount}g</td>
                          <td>{food.calories}</td>
                          <td>{food.protein}g</td>
                          <td>{food.carbs}g</td>
                          <td>{food.fat}g</td>
                        </tr>
                      ))}
                    </tbody>
                  </FoodTable>
                )}
              </MealSection>
            ))}
            
            <ButtonGroup>
              <Button danger onClick={() => deletePlan(selectedPlan.id, { stopPropagation: () => {} })}>
                Löschen
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalBackdrop>
      )}
    </Container>
  );
}

export default NutritionPlanList; 