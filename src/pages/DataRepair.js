import React, { useState } from 'react';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import { v4 as uuidv4 } from 'uuid';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Description = styled.p`
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.5;
`;

const ActionSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionTitle = styled.h2`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ActionDescription = styled.p`
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.5;
`;

const ActionCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ResultSection = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const ResultTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ResultItem = styled.div`
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SuccessMessage = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.success}20;
  color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const WarningMessage = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.warning}20;
  color: ${props => props.theme.colors.warning};
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const DataRepair = () => {
  const { state, dispatch } = useWorkout();
  const [repairResults, setRepairResults] = useState(null);
  const [planCheckResults, setPlanCheckResults] = useState(null);
  
  // Function to check and repair workout plans
  const handleRepairPlans = () => {
    if (!state.workoutPlans || !Array.isArray(state.workoutPlans)) {
      setRepairResults({
        fixed: 0,
        total: 0,
        details: ['Keine Trainingspläne gefunden.']
      });
      return;
    }
    
    let fixedCount = 0;
    let details = [];
    
    // Make a copy of the plans to work with
    const repairedPlans = state.workoutPlans.map(plan => {
      let planFixed = false;
      let planDetails = [];
      
      // Check if plan has required fields
      if (!plan.id) {
        plan.id = uuidv4();
        planFixed = true;
        planDetails.push(`Plan ohne ID gefunden - ID erstellt: ${plan.id}`);
      }
      
      if (!plan.name) {
        plan.name = `Unbenannter Plan (${new Date().toLocaleDateString()})`;
        planFixed = true;
        planDetails.push(`Plan ohne Namen gefunden - Name gesetzt: ${plan.name}`);
      }
      
      // Check and repair days array
      if (!plan.days) {
        plan.days = [];
        planFixed = true;
        planDetails.push(`Plan ohne Trainingstage gefunden - leeres Array erstellt`);
      } else if (!Array.isArray(plan.days)) {
        plan.days = [];
        planFixed = true;
        planDetails.push(`Ungültiges Trainingstage-Format gefunden - leeres Array erstellt`);
      }
      
      // Check and repair each day
      plan.days = plan.days.map(day => {
        let dayFixed = false;
        
        // Check if day has required fields
        if (!day.id) {
          day.id = uuidv4();
          dayFixed = true;
          planDetails.push(`Trainingstag ohne ID gefunden - ID erstellt: ${day.id}`);
        }
        
        if (!day.name) {
          day.name = `Unbenannter Tag ${plan.days.indexOf(day) + 1}`;
          dayFixed = true;
          planDetails.push(`Trainingstag ohne Namen gefunden - Name gesetzt: ${day.name}`);
        }
        
        // Check and repair exercises array
        if (!day.exercises) {
          day.exercises = [];
          dayFixed = true;
          planDetails.push(`Trainingstag ohne Übungen gefunden - leeres Array erstellt`);
        } else if (!Array.isArray(day.exercises)) {
          day.exercises = [];
          dayFixed = true;
          planDetails.push(`Ungültiges Übungen-Format gefunden - leeres Array erstellt`);
        }
        
        // Check and repair each exercise
        day.exercises = day.exercises.map(exercise => {
          let exerciseFixed = false;
          
          // Check if exercise has required fields
          if (!exercise.id) {
            exercise.id = uuidv4();
            exerciseFixed = true;
            planDetails.push(`Übung ohne ID gefunden - ID erstellt: ${exercise.id}`);
          }
          
          if (!exercise.name) {
            exercise.name = 'Unbenannte Übung';
            exerciseFixed = true;
            planDetails.push(`Übung ohne Namen gefunden - Name gesetzt: ${exercise.name}`);
          }
          
          if (exerciseFixed) {
            planFixed = true;
          }
          
          return exercise;
        });
        
        // Check and repair advancedMethods array
        if (!day.advancedMethods) {
          day.advancedMethods = [];
          dayFixed = true;
          planDetails.push(`Trainingstag ohne fortgeschrittene Methoden gefunden - leeres Array erstellt`);
        } else if (!Array.isArray(day.advancedMethods)) {
          day.advancedMethods = [];
          dayFixed = true;
          planDetails.push(`Ungültiges Format für fortgeschrittene Methoden gefunden - leeres Array erstellt`);
        }
        
        if (dayFixed) {
          planFixed = true;
        }
        
        return day;
      });
      
      if (planFixed) {
        fixedCount++;
        details = [...details, ...planDetails];
      }
      
      return plan;
    });
    
    // Update state with repaired plans
    if (fixedCount > 0) {
      dispatch({
        type: 'REPAIR_WORKOUT_PLANS',
        payload: repairedPlans
      });
    }
    
    setRepairResults({
      fixed: fixedCount,
      total: state.workoutPlans.length,
      details
    });
  };
  
  // Function to check plans for consistency and completeness
  const handleCheckPlans = () => {
    if (!state.workoutPlans || !Array.isArray(state.workoutPlans)) {
      setPlanCheckResults({
        issues: 0,
        total: 0,
        details: ['Keine Trainingspläne gefunden.']
      });
      return;
    }
    
    let issueCount = 0;
    let details = [];
    
    // Check each plan
    state.workoutPlans.forEach(plan => {
      // Check if plan is empty
      if (plan.days.length === 0) {
        issueCount++;
        details.push(`Plan "${plan.name}" hat keine Trainingstage.`);
      }
      
      // Check each day
      plan.days.forEach(day => {
        // Check if day has no exercises
        if (day.exercises.length === 0) {
          issueCount++;
          details.push(`Tag "${day.name}" in Plan "${plan.name}" hat keine Übungen.`);
        }
        
        // Check each exercise
        day.exercises.forEach(exercise => {
          // Check if exercise has complete information
          if (!exercise.sets || !exercise.reps) {
            issueCount++;
            details.push(`Übung "${exercise.name}" in Tag "${day.name}" (Plan "${plan.name}") hat unvollständige Angaben zu Sätzen oder Wiederholungen.`);
          }
        });
      });
    });
    
    setPlanCheckResults({
      issues: issueCount,
      total: state.workoutPlans.length,
      details: details.length > 0 ? details : ['Alle Pläne sind vollständig und konsistent.']
    });
  };
  
  return (
    <PageContainer>
      <Title>Trainingsdaten reparieren und Pläne prüfen</Title>
      <Description>
        Hier kannst du potenzielle Probleme in deinen Trainingsdaten beheben und deine Pläne auf Vollständigkeit prüfen.
        Dies kann hilfreich sein, wenn die App unerwartetes Verhalten zeigt oder wenn Trainingsdaten nicht korrekt angezeigt werden.
      </Description>
      
      <ActionSection>
        <ActionTitle>Trainingsdaten reparieren</ActionTitle>
        <ActionDescription>
          Diese Funktion repariert beschädigte oder fehlerhafte Datenstrukturen in deinen Trainingsplänen.
          Sie kann fehlende IDs, leere Arrays und ungültige Formate korrigieren.
        </ActionDescription>
        
        <ActionCard>
          <Card.Body>
            <Button onClick={handleRepairPlans}>
              Trainingsdaten reparieren
            </Button>
            
            {repairResults && (
              <ResultSection>
                <ResultTitle>Ergebnisse</ResultTitle>
                
                {repairResults.fixed === 0 ? (
                  <SuccessMessage>
                    Alle Trainingsdaten sind bereits in gutem Zustand. Keine Reparaturen notwendig.
                  </SuccessMessage>
                ) : (
                  <WarningMessage>
                    {repairResults.fixed} von {repairResults.total} Plänen wurden repariert.
                  </WarningMessage>
                )}
                
                {repairResults.details.map((detail, index) => (
                  <ResultItem key={index}>{detail}</ResultItem>
                ))}
              </ResultSection>
            )}
          </Card.Body>
        </ActionCard>
      </ActionSection>
      
      <ActionSection>
        <ActionTitle>Pläne auf Vollständigkeit prüfen</ActionTitle>
        <ActionDescription>
          Diese Funktion überprüft deine Trainingspläne auf Vollständigkeit und Konsistenz.
          Sie kann leere Tage, fehlende Übungen und unvollständige Übungsdaten identifizieren.
        </ActionDescription>
        
        <ActionCard>
          <Card.Body>
            <Button onClick={handleCheckPlans}>
              Pläne prüfen
            </Button>
            
            {planCheckResults && (
              <ResultSection>
                <ResultTitle>Ergebnisse</ResultTitle>
                
                {planCheckResults.issues === 0 ? (
                  <SuccessMessage>
                    Alle Pläne sind vollständig und konsistent.
                  </SuccessMessage>
                ) : (
                  <WarningMessage>
                    {planCheckResults.issues} Probleme in {planCheckResults.total} Plänen gefunden.
                  </WarningMessage>
                )}
                
                {planCheckResults.details.map((detail, index) => (
                  <ResultItem key={index}>{detail}</ResultItem>
                ))}
              </ResultSection>
            )}
          </Card.Body>
        </ActionCard>
      </ActionSection>
    </PageContainer>
  );
};

export default DataRepair; 