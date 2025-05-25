import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWorkout } from '../../context/WorkoutContext';
import Button from '../ui/Button';

const Container = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f8f9fa;
`;

const PeriodizationInfo = styled.div`
  margin-top: 1rem;
`;

const WeekBadge = styled.div`
  display: inline-block;
  background-color: ${props => props.currentWeek ? '#007bff' : '#6c757d'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PeriodizationApplicator = ({ planId }) => {
  const { state, dispatch } = useWorkout();
  const [selectedPeriodizationId, setSelectedPeriodizationId] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);
  
  // Find the current plan and its periodization data
  useEffect(() => {
    const plan = state.workoutPlans.find(p => p.id === planId);
    if (plan) {
      setCurrentPlan(plan);
      if (plan.periodization) {
        setSelectedPeriodizationId(plan.periodization);
      }
    }
  }, [planId, state.workoutPlans]);
  
  // Get the selected periodization plan
  const getSelectedPeriodization = () => {
    return state.periodizationPlans.find(p => p.id === selectedPeriodizationId);
  };
  
  // Apply periodization to the workout plan
  const handleApplyPeriodization = () => {
    if (!selectedPeriodizationId) {
      alert('Bitte wähle einen Periodisierungsplan aus.');
      return;
    }
    
    dispatch({
      type: 'APPLY_PERIODIZATION_TO_PLAN',
      payload: {
        planId,
        periodizationId: selectedPeriodizationId,
        periodizationData: {
          currentWeek: 1,
          appliedAt: new Date().toISOString()
        }
      }
    });
    
    alert('Periodisierungsplan erfolgreich angewendet!');
  };
  
  // Remove periodization from the workout plan
  const handleRemovePeriodization = () => {
    dispatch({
      type: 'APPLY_PERIODIZATION_TO_PLAN',
      payload: {
        planId,
        periodizationId: null,
        periodizationData: null
      }
    });
    
    setSelectedPeriodizationId('');
  };
  
  // Get current week details
  const getCurrentWeekDetails = () => {
    const periodization = getSelectedPeriodization();
    if (!periodization) return null;
    
    // Calculate the overall week number across all meso cycles
    let totalWeek = currentPlan?.periodizationData?.currentWeek || 1;
    let currentMesoCycle = null;
    let currentMesoCycleWeek = null;
    let weekIndex = 0;
    
    // Find which meso cycle contains the current week
    for (const mesoCycle of periodization.mesoCycles) {
      if (weekIndex + mesoCycle.weekCount >= totalWeek) {
        currentMesoCycle = mesoCycle;
        currentMesoCycleWeek = mesoCycle.weeks[totalWeek - weekIndex - 1];
        break;
      }
      weekIndex += mesoCycle.weekCount;
    }
    
    if (!currentMesoCycle || !currentMesoCycleWeek) return null;
    
    return {
      mesoCycle: currentMesoCycle,
      week: currentMesoCycleWeek,
      absoluteWeek: totalWeek
    };
  };
  
  // Calculate total weeks in periodization
  const getTotalWeeks = () => {
    const periodization = getSelectedPeriodization();
    if (!periodization) return 0;
    
    return periodization.mesoCycles.reduce((total, cycle) => total + cycle.weekCount, 0);
  };
  
  // Get training guidelines based on current week
  const getTrainingGuidelines = () => {
    const weekDetails = getCurrentWeekDetails();
    if (!weekDetails) return null;
    
    const { intensity, volume } = weekDetails.week;
    
    // Simplified logic for training guidelines based on intensity and volume
    let guidelines = '';
    
    if (intensity >= 90) {
      guidelines += 'Diese Woche hat eine sehr hohe Intensität. Konzentriere dich auf schwere Gewichte und niedrigere Wiederholungszahlen. ';
    } else if (intensity >= 75) {
      guidelines += 'Diese Woche hat eine hohe Intensität. Arbeite mit herausfordernden Gewichten. ';
    } else if (intensity >= 60) {
      guidelines += 'Diese Woche hat eine mittlere Intensität. Fokussiere dich auf gute Technik mit moderaten Gewichten. ';
    } else {
      guidelines += 'Diese Woche hat eine niedrige Intensität. Nutze leichtere Gewichte und fokussiere dich auf Technik und Kontrolle. ';
    }
    
    if (volume >= 90) {
      guidelines += 'Das Trainingsvolumen ist sehr hoch. Plane viele Sätze pro Muskelgruppe ein. ';
    } else if (volume >= 75) {
      guidelines += 'Das Trainingsvolumen ist hoch. Plane mehr Sätze oder Übungen als üblich ein. ';
    } else if (volume >= 60) {
      guidelines += 'Das Trainingsvolumen ist moderat. Halte dich an dein normales Trainingspensum. ';
    } else {
      guidelines += 'Das Trainingsvolumen ist niedrig. Reduziere die Anzahl der Sätze oder Übungen für eine bessere Erholung. ';
    }
    
    return guidelines;
  };
  
  const weekDetails = getCurrentWeekDetails();
  const totalWeeks = getTotalWeeks();
  
  return (
    <Container>
      <Title>Periodisierung anwenden</Title>
      
      <Select 
        value={selectedPeriodizationId}
        onChange={(e) => setSelectedPeriodizationId(e.target.value)}
      >
        <option value="">Periodisierungsplan auswählen...</option>
        {state.periodizationPlans.map(plan => (
          <option key={plan.id} value={plan.id}>
            {plan.name}
          </option>
        ))}
      </Select>
      
      {selectedPeriodizationId && (
        <Card>
          <h4>{getSelectedPeriodization()?.name}</h4>
          <p>{getSelectedPeriodization()?.description}</p>
          
          {currentPlan?.periodization === selectedPeriodizationId ? (
            <PeriodizationInfo>
              <p>
                <strong>Aktuelle Woche:</strong> {currentPlan?.periodizationData?.currentWeek || 1} von {totalWeeks}
              </p>
              
              {weekDetails && (
                <>
                  <p>
                    <strong>Mesozyklus:</strong> {weekDetails.mesoCycle.name} ({weekDetails.mesoCycle.goal})
                  </p>
                  <p>
                    <strong>Wochenintensität:</strong> {weekDetails.week.intensity}%
                  </p>
                  <p>
                    <strong>Wochenvolumen:</strong> {weekDetails.week.volume}%
                  </p>
                  
                  {weekDetails.week.notes && (
                    <p>
                      <strong>Notizen:</strong> {weekDetails.week.notes}
                    </p>
                  )}
                  
                  <div style={{ marginTop: '1rem' }}>
                    <h5>Trainingsrichtlinien:</h5>
                    <p>{getTrainingGuidelines()}</p>
                  </div>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <h5>Wochen:</h5>
                    <div>
                      {Array.from({ length: totalWeeks }, (_, i) => (
                        <WeekBadge 
                          key={i} 
                          currentWeek={(currentPlan?.periodizationData?.currentWeek || 1) === i + 1}
                          style={{ cursor: 'pointer' }}
                        >
                          Woche {i + 1}
                        </WeekBadge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <ButtonGroup>
                <Button variant="secondary" onClick={handleRemovePeriodization}>
                  Periodisierung entfernen
                </Button>
              </ButtonGroup>
            </PeriodizationInfo>
          ) : (
            <ButtonGroup>
              <Button onClick={handleApplyPeriodization}>
                Auf diesen Plan anwenden
              </Button>
            </ButtonGroup>
          )}
        </Card>
      )}
      
      {state.periodizationPlans.length === 0 && (
        <p>Noch keine Periodisierungspläne erstellt. Erstelle zuerst einen Plan unter "Periodisierung".</p>
      )}
    </Container>
  );
};

export default PeriodizationApplicator; 