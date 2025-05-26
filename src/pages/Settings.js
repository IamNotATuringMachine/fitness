import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useWorkout } from '../context/WorkoutContext';

const SettingsContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SettingsHeader = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  grid-column: 1 / -1;
`;

const SettingSection = styled(Card)`
  height: fit-content;
  padding: ${props => props.theme.spacing.lg};
`;

const SectionHeader = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AdminLink = styled(Link)`
  display: inline-block;
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const Settings = () => {
  const { userPreferences } = useTheme();
  const { state: contextState, dispatch } = useWorkout();
  
  return (
    <div>
      <SettingsContainer className={userPreferences.compactMode ? 'compact-mode' : ''}>
        <SettingsHeader>Einstellungen</SettingsHeader>
        
        <SettingSection>
          <SectionHeader>Administration</SectionHeader>
          <SectionDescription>
            Zugriff auf administrative Funktionen für Systemverwalter.
          </SectionDescription>
          <AdminLink to="/feedback-management">Feedback-Management</AdminLink>
        </SettingSection>
        
        <SettingSection>
          <SectionHeader>Debug-Funktionen</SectionHeader>
          <SectionDescription>
            Entwicklertools zur Diagnose und Wartung der Übungsdatenbank.
          </SectionDescription>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
            <Button 
              variant="secondary"
              onClick={() => {
                console.log('Exercises:', contextState.exercises);
                console.log('Exercise count:', contextState.exercises ? contextState.exercises.length : 0);
                if (contextState.exercises && contextState.exercises.length > 0) {
                  const muscleGroups = [...new Set(contextState.exercises.flatMap(ex => ex.muscleGroups))];
                  console.log('Available muscle groups:', muscleGroups);
                  
                  // Debug each exercise's muscle groups
                  contextState.exercises.slice(0, 5).forEach((ex, i) => {
                    console.log(`Exercise ${i+1}: ${ex.name} - Muscle Groups: ${JSON.stringify(ex.muscleGroups)}`);
                  });
                  
                  alert(`✅ ${contextState.exercises.length} Übungen aus der neuen Übungsdatenbank geladen!\n\nVerfügbare Muskelgruppen: ${muscleGroups.join(', ')}\n\nÖffne die Konsole für Details zu Muskelgruppen-Zuordnungen.`);
                } else {
                  alert('⚠️ Keine Übungen gefunden! Datenbank zurücksetzen...');
                  localStorage.removeItem('workoutState');
                  window.location.reload();
                }
              }}
              style={{ fontSize: '0.9rem' }}
            >
              🔍 Debug-Übungen
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => {
                if (window.confirm('🔄 Diese Aktion setzt die Übungsdatenbank zurück und lädt die neue detaillierte Übungsdatenbank.\n\nFortfahren?')) {
                  localStorage.removeItem('workoutState');
                  window.location.reload();
                }
              }}
              style={{ fontSize: '0.9rem' }}
            >
              🔄 Übungen Datenbank zurücksetzen
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => {
                if (contextState.exercises && contextState.exercises.length > 0) {
                  // Group exercises by muscle groups
                  const groupedExercises = {};
                  contextState.exercises.forEach(exercise => {
                    if (exercise.muscleGroups && Array.isArray(exercise.muscleGroups)) {
                      exercise.muscleGroups.forEach(mg => {
                        if (!groupedExercises[mg]) {
                          groupedExercises[mg] = [];
                        }
                        groupedExercises[mg].push(exercise.name);
                      });
                    }
                  });
                  
                  console.log('🏗️ Übungen nach Muskelgruppen:', groupedExercises);
                  
                  const summary = Object.keys(groupedExercises).map(mg => 
                    `${mg}: ${groupedExercises[mg].length} Übungen`
                  ).join('\n');
                  
                  alert(`🏗️ Muskelgruppen-Zuordnung:\n\n${summary}\n\nDetails in der Konsole!`);
                } else {
                  alert('⚠️ Keine Übungen geladen!');
                }
              }}
              style={{ fontSize: '0.9rem' }}
            >
              🏗️ Muskelgruppen-Mapping
            </Button>
            
            <Button 
              variant="danger"
              onClick={() => {
                if (window.confirm('🔧 Diese Aktion entfernt doppelte Übungen aus der Datenbank.\n\nDadurch wird das Problem mit der steigenden Übungszahl behoben.\n\nFortfahren?')) {
                  try {
                    const originalCount = contextState.exercises.length;
                    
                    // Remove duplicates by exercise name, keeping the first occurrence
                    const seen = new Set();
                    const uniqueExercises = contextState.exercises.filter(exercise => {
                      if (seen.has(exercise.name)) {
                        return false; // Skip duplicate
                      }
                      seen.add(exercise.name);
                      return true; // Keep unique
                    });
                    
                    const removedCount = originalCount - uniqueExercises.length;
                    
                    if (removedCount > 0) {
                      // Update the context with unique exercises
                      dispatch({ type: 'SET_EXERCISES', payload: uniqueExercises });
                      
                      alert(`✅ Erfolgreich ${removedCount} doppelte Übungen entfernt!\n\nVorher: ${originalCount} Übungen\nJetzt: ${uniqueExercises.length} Übungen\n\nDas Dashboard sollte jetzt die korrekte Anzahl anzeigen.`);
                    } else {
                      alert('✨ Keine doppelten Übungen gefunden! Die Datenbank ist bereits sauber.');
                    }
                  } catch (error) {
                    console.error('Fehler beim Entfernen von Duplikaten:', error);
                    alert('❌ Fehler beim Entfernen von Duplikaten. Versuche einen vollständigen Reset.');
                  }
                }
              }}
              style={{ fontSize: '0.9rem' }}
            >
              🔧 Doppelte Übungen entfernen
            </Button>
          </div>
        </SettingSection>
      </SettingsContainer>
    </div>
  );
};

export default Settings; 