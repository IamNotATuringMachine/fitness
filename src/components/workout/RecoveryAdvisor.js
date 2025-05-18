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

const MuscleGroupContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const MuscleGroup = styled.div`
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  width: 100px;
  font-weight: ${props => props.fatigue > 70 ? 'bold' : 'normal'};
  background-color: ${props => {
    if (props.fatigue > 90) return '#dc3545'; // High fatigue - red
    if (props.fatigue > 70) return '#ffc107'; // Medium fatigue - yellow
    if (props.fatigue > 40) return '#28a745'; // Low fatigue - green
    return '#f8f9fa'; // Fully recovered - light gray
  }};
  color: ${props => props.fatigue > 90 ? 'white' : 'black'};
`;

const FatigueTitle = styled.div`
  font-size: 12px;
  margin-bottom: 5px;
`;

const FatigueValue = styled.div`
  font-size: 16px;
`;

const Legend = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
`;

const LegendColor = styled.div`
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border-radius: 3px;
  background-color: ${props => props.color};
`;

const RecoveryAdvice = styled.div`
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  margin-top: 20px;
`;

const RecoveryAdviceTitle = styled.h4`
  color: #343a40;
  margin-bottom: 10px;
`;

const RecoveryAdvisor = ({ workoutHistory }) => {
  const [muscleGroupFatigue, setMuscleGroupFatigue] = useState([]);
  const [recoveryAdvice, setRecoveryAdvice] = useState('');

  useEffect(() => {
    if (workoutHistory) {
      // Calculate muscle group fatigue levels
      const fatigueLevels = calculateMuscleGroupFatigue(workoutHistory);
      setMuscleGroupFatigue(fatigueLevels);
      
      // Generate recovery advice
      const advice = generateRecoveryAdvice(fatigueLevels);
      setRecoveryAdvice(advice);
    }
  }, [workoutHistory]);

  // Calculate fatigue levels for each muscle group
  const calculateMuscleGroupFatigue = (history) => {
    // This would be a more complex calculation based on:
    // 1. Recent workout intensity and volume for each muscle group
    // 2. Time since last workout for that muscle group
    // 3. Individual recovery patterns
    
    // For demo purposes, we're returning sample data
    return [
      { name: 'Brust', fatigue: 85 },
      { name: 'Rücken', fatigue: 60 },
      { name: 'Beine', fatigue: 90 },
      { name: 'Schultern', fatigue: 40 },
      { name: 'Arme', fatigue: 30 },
      { name: 'Bauch', fatigue: 20 }
    ];
  };

  // Generate personalized recovery advice
  const generateRecoveryAdvice = (fatigueLevels) => {
    const highFatigueMuscles = fatigueLevels.filter(muscle => muscle.fatigue > 70);
    
    if (highFatigueMuscles.length === 0) {
      return "Alle Muskelgruppen scheinen gut erholt zu sein. Du bist bereit für ein intensives Training!";
    }
    
    const muscleNames = highFatigueMuscles.map(muscle => muscle.name).join(', ');
    
    let advice = `Deine ${muscleNames} ${highFatigueMuscles.length === 1 ? 'zeigt' : 'zeigen'} Anzeichen von Ermüdung. `;
    
    // General advice
    advice += "Erwäge folgende Erholungsstrategien:\n\n";
    advice += "- Konzentriere dich heute auf andere Muskelgruppen\n";
    advice += "- Erhöhe deine Proteinzufuhr und achte auf ausreichend Schlaf\n";
    advice += "- Regelmäßige Dehnübungen können die Durchblutung fördern\n";
    
    // Specific advice for extremely fatigued muscles
    const extremelyFatigued = fatigueLevels.filter(muscle => muscle.fatigue > 90);
    if (extremelyFatigued.length > 0) {
      const extremeNames = extremelyFatigued.map(muscle => muscle.name).join(', ');
      advice += `\nDeine ${extremeNames} ${extremelyFatigued.length === 1 ? 'benötigt' : 'benötigen'} besondere Aufmerksamkeit. `;
      advice += "Aktive Erholung wie leichtes Kardio oder Mobilität kann helfen.";
    }
    
    return advice;
  };

  return (
    <Container>
      <Title>Regenerations-Monitor</Title>
      
      <Legend>
        <LegendItem>
          <LegendColor color="#dc3545" />
          <span>Hohe Ermüdung</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#ffc107" />
          <span>Mittlere Ermüdung</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#28a745" />
          <span>Leichte Ermüdung</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#f8f9fa" />
          <span>Erholt</span>
        </LegendItem>
      </Legend>
      
      <MuscleGroupContainer>
        {muscleGroupFatigue.map(muscle => (
          <MuscleGroup key={muscle.name} fatigue={muscle.fatigue}>
            <FatigueTitle>{muscle.name}</FatigueTitle>
            <FatigueValue>{muscle.fatigue}%</FatigueValue>
          </MuscleGroup>
        ))}
      </MuscleGroupContainer>
      
      <RecoveryAdvice>
        <RecoveryAdviceTitle>Regenerationsempfehlungen</RecoveryAdviceTitle>
        <p>{recoveryAdvice}</p>
      </RecoveryAdvice>
    </Container>
  );
};

export default RecoveryAdvisor; 