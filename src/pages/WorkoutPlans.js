import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};

  h1 {
    color: ${props => props.theme.colors.primary};
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const PlanCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }

  h3 {
    margin-bottom: ${props => props.theme.spacing.sm};
    color: ${props => props.theme.colors.text};
  }

  p {
    font-size: ${props => props.theme.typography.fontSizes.sm};
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: ${props => props.theme.spacing.md};
    flex-grow: 1;
  }
`;

const PlanDetails = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: ${props => props.theme.spacing.md};
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const DetailLabel = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.textSecondary};
`;

const SearchContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => `${props.theme.colors.primary}40`};
  }
`;

const NoPlansMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.backgroundAlt || props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  border: 1px dashed ${props => props.theme.colors.border};
  margin-top: ${props => props.theme.spacing.lg};

  p {
    font-size: ${props => props.theme.typography.fontSizes.md};
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: ${props => props.theme.spacing.md};
  }

  h4 {
    font-size: ${props => props.theme.typography.fontSizes.lg};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: auto;
  flex-wrap: wrap;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
`;

const WorkoutPlans = () => {
  const { state, dispatch } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Add debug logging for plans on component mount
  React.useEffect(() => {
    console.log('WorkoutPlans - Available plans:', state.workoutPlans ? state.workoutPlans.length : 0);
    
    if (state.workoutPlans && state.workoutPlans.length > 0) {
      state.workoutPlans.forEach((plan, index) => {
        console.log(`Plan ${index}: ${plan.id} - ${plan.name}`);
        console.log(`Plan days: ${Array.isArray(plan.days) ? plan.days.length : 'Not an array'}`);
        
        if (Array.isArray(plan.days)) {
          plan.days.forEach((day, dayIndex) => {
            console.log(`   Day ${dayIndex}: ${day.id} - ${day.name} (${day.exercises ? day.exercises.length : 0} exercises)`);
          });
        }
      });
    }
  }, [state.workoutPlans]);
  
  const handleDeletePlan = (id) => {
    if (window.confirm('Möchtest du diesen Trainingsplan wirklich löschen?')) {
      dispatch({
        type: 'DELETE_WORKOUT_PLAN',
        payload: id
      });
    }
  };

  const fixLocalStorage = () => {
    try {
      const savedState = localStorage.getItem('workoutState');
      if (!savedState) {
        alert('Keine Daten in localStorage gefunden.');
        return;
      }
      
      const parsedState = JSON.parse(savedState);
      
      if (parsedState.workoutPlans && Array.isArray(parsedState.workoutPlans)) {
        let fixedPlans = parsedState.workoutPlans.map(plan => {
          // Ensure days array exists and is an array
          if (!plan.days || !Array.isArray(plan.days)) {
            console.warn(`Fixing plan ${plan.id} - ${plan.name} - days array is invalid`);
            return { ...plan, days: [] };
          }
          
          // Ensure each day has valid exercises and advancedMethods arrays
          const fixedDays = plan.days.map(day => {
            const fixedDay = { ...day };
            if (!fixedDay.exercises || !Array.isArray(fixedDay.exercises)) {
              console.warn(`Fixing day ${day.id} - exercises array is invalid`);
              fixedDay.exercises = [];
            }
            if (!fixedDay.advancedMethods || !Array.isArray(fixedDay.advancedMethods)) {
              console.warn(`Fixing day ${day.id} - advancedMethods array is invalid`);
              fixedDay.advancedMethods = [];
            }
            return fixedDay;
          });
          
          return { ...plan, days: fixedDays };
        });
        
        // Save the fixed state back to localStorage
        parsedState.workoutPlans = fixedPlans;
        localStorage.setItem('workoutState', JSON.stringify(parsedState));
        alert('localStorage-Daten wurden repariert. Bitte lade die Seite neu.');
        window.location.reload();
      } else {
        alert('workoutPlans nicht gefunden oder kein Array.');
      }
    } catch (error) {
      console.error('Error fixing localStorage:', error);
      alert(`Fehler beim Reparieren: ${error.message}`);
    }
  };
  
  const filteredPlans = state.workoutPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Add debug function to verify all plans are valid
  const verifyPlanIntegrity = () => {
    try {
      console.log('Verifying plan integrity...');
      
      if (!state.workoutPlans || !Array.isArray(state.workoutPlans)) {
        alert('Fehler: workoutPlans ist kein Array.');
        return false;
      }
      
      let allValid = true;
      
      state.workoutPlans.forEach((plan, index) => {
        // Check if plan has an ID
        if (!plan.id) {
          console.error(`Plan at index ${index} has no ID`);
          allValid = false;
        }
        
        // Check if days is an array
        if (!plan.days || !Array.isArray(plan.days)) {
          console.error(`Plan ${plan.id} (${plan.name}) has invalid days array`);
          allValid = false;
        } else {
          // Check each day
          plan.days.forEach((day, dayIndex) => {
            if (!day.id) {
              console.error(`Day at index ${dayIndex} in plan ${plan.id} has no ID`);
              allValid = false;
            }
            
            // Check exercises
            if (!day.exercises || !Array.isArray(day.exercises)) {
              console.error(`Day ${day.id} in plan ${plan.id} has invalid exercises array`);
              allValid = false;
            }
            
            // Check advancedMethods
            if (!day.advancedMethods || !Array.isArray(day.advancedMethods)) {
              console.error(`Day ${day.id} in plan ${plan.id} has invalid advancedMethods array`);
              allValid = false;
            }
          });
        }
      });
      
      if (allValid) {
        alert('Alle Pläne sind gültig!');
        return true;
      } else {
        alert('Einige Pläne haben Probleme. Details in der Konsole.');
        return false;
      }
    } catch (error) {
      console.error('Error verifying plans:', error);
      alert(`Fehler bei der Überprüfung: ${error.message}`);
      return false;
    }
  };

  const handleNavigateToEditPlan = (planId) => {
    try {
      console.log('Attempting to edit plan with ID:', planId);
      // Find the plan to verify it's valid before navigating
      const plan = state.workoutPlans.find(p => p.id === planId);
      console.log('Found plan:', plan ? `${plan.name} (${plan.id})` : 'No plan found');
      
      if (!plan) {
        alert(`Fehler: Plan mit ID ${planId} nicht gefunden.`);
        console.error('Available plans:', state.workoutPlans.map(p => ({ id: p.id, name: p.name })));
        return;
      }
      
      // Verify plan has valid days
      if (!plan.days || !Array.isArray(plan.days)) {
        alert(`Fehler: Plan ${plan.name} hat keine gültigen Trainingstage.`);
        console.error('Invalid plan days:', plan.days);
        
        // Try to fix the plan
        console.log('Attempting to fix plan...');
        dispatch({
          type: 'UPDATE_WORKOUT_PLAN',
          payload: { ...plan, days: [] }
        });
        
        alert('Plan wurde repariert. Bitte versuche es erneut.');
        return;
      }
      
      // Ensure the localStorage state is clean before navigating
      try {
        // Get the current state from localStorage
        const savedState = localStorage.getItem('workoutState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Fix the specific plan in the saved state
          if (parsedState.workoutPlans && Array.isArray(parsedState.workoutPlans)) {
            const updatedWorkoutPlans = parsedState.workoutPlans.map(p => {
              if (p.id === planId) {
                // Ensure this plan has valid days, exercises, etc.
                const fixedPlan = { ...p };
                if (!fixedPlan.days || !Array.isArray(fixedPlan.days)) {
                  fixedPlan.days = [];
                } else {
                  // Ensure each day has valid exercises and advancedMethods
                  fixedPlan.days = fixedPlan.days.map(day => {
                    const fixedDay = { ...day };
                    if (!fixedDay.exercises || !Array.isArray(fixedDay.exercises)) {
                      fixedDay.exercises = [];
                    }
                    if (!fixedDay.advancedMethods || !Array.isArray(fixedDay.advancedMethods)) {
                      fixedDay.advancedMethods = [];
                    }
                    return fixedDay;
                  });
                }
                return fixedPlan;
              }
              return p;
            });
            
            // Save the updated plans back to localStorage
            parsedState.workoutPlans = updatedWorkoutPlans;
            localStorage.setItem('workoutState', JSON.stringify(parsedState));
            console.log('Fixed localStorage state before navigation');
          }
        }
      } catch (e) {
        console.error('Error cleaning localStorage before navigation:', e);
        // Continue with navigation even if cleaning failed
      }
      
      // All checks passed, navigate to edit page
      const targetUrl = `/edit-plan/${planId}`;
      console.log('Navigating to:', targetUrl);
      navigate(targetUrl);
    } catch (error) {
      console.error('Error navigating to edit plan:', error);
      alert(`Fehler beim Aufrufen des Plans: ${error.message}`);
    }
  };
  
  return (
    <>
      <PageHeader>
        <h1>Meine Trainingspläne</h1>
        <Button onClick={() => navigate('/create-plan')}>Neuen Plan erstellen</Button>
      </PageHeader>
      
      <SearchContainer>
        <SearchInput 
          type="text"
          placeholder="Pläne durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      {filteredPlans.length === 0 ? (
        <NoPlansMessage>
          {state.workoutPlans.length === 0 
            ? (
              <>
                <h4>Noch keine Pläne hier!</h4>
                <p>Starte durch und erstelle deinen ersten, persönlichen Trainingsplan.</p>
                <Button onClick={() => navigate('/create-plan')} variant="primary" size="large">Ersten Plan erstellen</Button>
              </>
            ) : (
              <>
                <h4>Nichts gefunden</h4>
                <p>Für deine Suche nach "<strong>{searchTerm}</strong>" gibt es leider keine Treffer. Versuche es mit einem anderen Begriff.</p>
              </>
            )
          }
        </NoPlansMessage>
      ) : (
        <PlansGrid>
          {filteredPlans.map(plan => {
            const totalExercises = plan.days.reduce((sum, day) => sum + (day.exercises ? day.exercises.length : 0), 0);

            return (
              <PlanCard key={plan.id} onClick={() => navigate(`/plan/${plan.id}`)}>
                <h3>{plan.name}</h3>
                {plan.description && <p>{plan.description}</p>}
                <PlanDetails>
                  <DetailItem>
                    <DetailLabel>Tage:</DetailLabel>
                    <span>{plan.days ? plan.days.length : 0}</span>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Übungen gesamt:</DetailLabel>
                    <span>{totalExercises}</span>
                  </DetailItem>
                </PlanDetails>
                <ActionsContainer>
                  <Button onClick={(e) => { e.stopPropagation(); handleNavigateToEditPlan(plan.id); }} variant="secondary">Bearbeiten</Button>
                  <Button onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }} variant="danger">Löschen</Button>
                </ActionsContainer>
              </PlanCard>
            );
          })}
        </PlansGrid>
      )}
    </>
  );
};

export default WorkoutPlans; 