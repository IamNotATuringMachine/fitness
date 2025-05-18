import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AIAssistant from '../components/workout/AIAssistant';
import RecoveryAdvisor from '../components/workout/RecoveryAdvisor';
import ExerciseAlternatives from '../components/workout/ExerciseAlternatives';

const PageContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: #343a40;
  margin-bottom: 20px;
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #343a40;
  margin: 30px 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
`;

const NotificationBanner = styled.div`
  background-color: #e9ecef;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  color: #495057;
`;

const AITrainingAssistant = () => {
  // Mock data for demonstration
  const [workoutHistory, setWorkoutHistory] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // In a real application, this would fetch data from context/API
    // For demo purposes, we're setting up mock data
    const mockWorkoutHistory = {
      exercises: [
        {
          id: 'bench-press',
          name: 'Bankdrücken',
          history: [
            { date: '2023-05-01', weight: 75, reps: 8, sets: 3 },
            { date: '2023-05-05', weight: 77.5, reps: 8, sets: 3 },
            { date: '2023-05-08', weight: 80, reps: 7, sets: 3 },
            { date: '2023-05-12', weight: 80, reps: 8, sets: 3 },
            { date: '2023-05-15', weight: 80, reps: 8, sets: 3 },
            { date: '2023-05-19', weight: 80, reps: 8, sets: 3 }
          ]
        },
        {
          id: 'squat',
          name: 'Kniebeugen',
          history: [
            { date: '2023-05-02', weight: 90, reps: 6, sets: 3 },
            { date: '2023-05-06', weight: 92.5, reps: 6, sets: 3 },
            { date: '2023-05-09', weight: 95, reps: 6, sets: 3 },
            { date: '2023-05-13', weight: 97.5, reps: 5, sets: 3 },
            { date: '2023-05-16', weight: 97.5, reps: 6, sets: 3 },
            { date: '2023-05-20', weight: 100, reps: 6, sets: 3 }
          ]
        }
      ],
      muscleGroups: {
        chest: ['2023-06-01', '2023-06-03', '2023-06-05', '2023-06-07'],
        back: ['2023-06-02', '2023-06-06'],
        legs: ['2023-06-02', '2023-06-04', '2023-06-06'],
        shoulders: ['2023-06-01', '2023-06-05'],
        arms: ['2023-06-03', '2023-06-07'],
        core: ['2023-06-01', '2023-06-03', '2023-06-05']
      }
    };

    const mockCurrentPlan = {
      name: 'Hypertrophie-Plan',
      workouts: [
        {
          id: 'workout-1',
          name: 'Push Tag',
          exercises: [
            { id: 'bench-press', name: 'Bankdrücken', sets: 3, reps: 8, weight: 80 },
            { id: 'incline-press', name: 'Schrägbankdrücken', sets: 3, reps: 10, weight: 60 },
            { id: 'shoulder-press', name: 'Schulterdrücken', sets: 3, reps: 10, weight: 40 },
            { id: 'lateral-raise', name: 'Seitheben', sets: 3, reps: 12, weight: 10 },
            { id: 'tricep-extension', name: 'Trizeps-Extension', sets: 3, reps: 12, weight: 25 }
          ]
        },
        {
          id: 'workout-2',
          name: 'Pull Tag',
          exercises: [
            { id: 'pull-ups', name: 'Klimmzüge', sets: 3, reps: 8, weight: 0 },
            { id: 'row', name: 'Rudern', sets: 3, reps: 10, weight: 70 },
            { id: 'lat-pulldown', name: 'Lat-Pulldown', sets: 3, reps: 10, weight: 65 },
            { id: 'face-pull', name: 'Face Pulls', sets: 3, reps: 15, weight: 25 },
            { id: 'bicep-curl', name: 'Bizeps-Curls', sets: 3, reps: 12, weight: 15 }
          ]
        },
        {
          id: 'workout-3',
          name: 'Bein Tag',
          exercises: [
            { id: 'squat', name: 'Kniebeugen', sets: 3, reps: 6, weight: 100 },
            { id: 'deadlift', name: 'Kreuzheben', sets: 3, reps: 8, weight: 120 },
            { id: 'leg-press', name: 'Beinpresse', sets: 3, reps: 10, weight: 150 },
            { id: 'leg-extension', name: 'Beinstrecker', sets: 3, reps: 12, weight: 50 },
            { id: 'calf-raise', name: 'Wadenheben', sets: 3, reps: 15, weight: 40 }
          ]
        }
      ]
    };

    // Set the mock data
    setWorkoutHistory(mockWorkoutHistory);
    setCurrentPlan(mockCurrentPlan);
  }, []);

  const handleApplySuggestion = (suggestion) => {
    // This would update the plan in a real application
    console.log('Applied suggestion:', suggestion);
    
    // Show notification
    setNotification(`Vorschlag angewendet: ${suggestion.title}`);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleReplaceExercise = (originalExerciseId, alternativeId, alternativeName) => {
    // This would update the workout plan with the alternative exercise
    console.log(`Ersetzt: Original ID ${originalExerciseId} mit Alternative ID ${alternativeId}`);
    
    // Show notification
    setNotification(`Übung ersetzt durch: ${alternativeName}`);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <PageContainer>
      <PageTitle>KI-Trainingsassistent</PageTitle>
      
      <FeatureDescription>
        Diese Seite bietet dir KI-gestützte Analysen und Empfehlungen, um dein Training zu optimieren 
        und deine Ziele schneller zu erreichen. Die Vorschläge basieren auf deinem Trainingsfortschritt, 
        deinem aktuellen Plan und bewährten Trainingsprinzipien.
      </FeatureDescription>
      
      {notification && (
        <NotificationBanner>
          {notification}
        </NotificationBanner>
      )}
      
      <SectionTitle>Dynamische Trainingsanpassungen</SectionTitle>
      {workoutHistory && currentPlan ? (
        <AIAssistant 
          workoutHistory={workoutHistory} 
          currentPlan={currentPlan}
          onApplySuggestion={handleApplySuggestion}
        />
      ) : (
        <p>Lade Trainingsdaten...</p>
      )}
      
      <SectionTitle>Regenerationsberücksichtigung</SectionTitle>
      {workoutHistory ? (
        <RecoveryAdvisor workoutHistory={workoutHistory} />
      ) : (
        <p>Lade Trainingsdaten...</p>
      )}
      
      <SectionTitle>Übungsbewertung und Alternativen</SectionTitle>
      <ExerciseAlternatives onReplaceExercise={handleReplaceExercise} />
    </PageContainer>
  );
};

export default AITrainingAssistant; 