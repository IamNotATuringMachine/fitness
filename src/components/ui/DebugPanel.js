import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useWorkout } from '../../context/WorkoutContext';
import { secureStorage } from '../../utils/security';
import Button from './Button';
import Card from './Card';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 80px;
  right: 1.5rem;
  z-index: 999;
  
  @media (max-width: 768px) {
    bottom: 70px;
    right: 1rem;
  }
`;

const DebugContent = styled(Card)`
  width: 400px;
  max-height: 500px;
  overflow-y: auto;
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    width: calc(100vw - 2rem);
    max-width: 400px;
  }
`;

const DebugSection = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const DebugTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #dc3545;
`;

const DebugInfo = styled.div`
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 10px;
`;

const DebugActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const WarningText = styled.div`
  color: #dc3545;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SuccessText = styled.div`
  color: #28a745;
  font-weight: bold;
  margin-bottom: 10px;
`;

const DebugPanel = ({ isVisible, onClose }) => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [lastAction, setLastAction] = useState('');
  const { state } = useWorkout();

  const updateStorageInfo = useCallback(() => {
    try {
      const stored = secureStorage.get('workoutState');
      const storageSize = localStorage.getItem('workoutState')?.length || 0;
      
      setStorageInfo({
        hasData: !!stored,
        workoutPlansCount: stored?.workoutPlans?.length || 0,
        workoutHistoryCount: stored?.workoutHistory?.length || 0,
        exercisesCount: stored?.exercises?.length || 0,
        storageSize: (storageSize / 1024).toFixed(2) + ' KB',
        lastSaved: stored?.lastSaved || 'Unbekannt',
        currentStateWorkoutPlans: state?.workoutPlans?.length || 0,
        currentStateWorkoutHistory: state?.workoutHistory?.length || 0,
        currentStateExercises: state?.exercises?.length || 0
      });
    } catch (error) {
      setStorageInfo({ error: error.message });
    }
  }, [state]);

  useEffect(() => {
    if (isVisible) {
      updateStorageInfo();
    }
  }, [isVisible, updateStorageInfo]);

  const clearLocalStorage = () => {
    if (window.confirm('🚨 WARNUNG: Dies löscht ALLE gespeicherten Daten! Bist du sicher?')) {
      localStorage.removeItem('workoutState');
      setLastAction('✅ LocalStorage geleert - Seite neu laden für kompletten Reset');
      updateStorageInfo();
    }
  };

  const forceReload = () => {
    window.location.reload();
  };

  const exportData = () => {
    try {
      const data = secureStorage.get('workoutState');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setLastAction('✅ Daten exportiert');
    } catch (error) {
      setLastAction('❌ Export fehlgeschlagen: ' + error.message);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <DebugContainer>
      <DebugContent>
        <DebugTitle>🐛 Fitness App Debug Panel</DebugTitle>
        
        {lastAction && (
          <DebugSection>
            <SuccessText>{lastAction}</SuccessText>
            <Button size="sm" onClick={() => setLastAction('')}>Verstanden</Button>
          </DebugSection>
        )}

        <DebugSection>
          <h5>📊 LocalStorage Status</h5>
          {storageInfo ? (
            <DebugInfo>
              <div><strong>Daten vorhanden:</strong> {storageInfo.hasData ? '✅ Ja' : '❌ Nein'}</div>
              <div><strong>Gespeicherte Pläne:</strong> {storageInfo.workoutPlansCount}</div>
              <div><strong>Gespeicherte Workouts:</strong> {storageInfo.workoutHistoryCount}</div>
              <div><strong>Gespeicherte Übungen:</strong> {storageInfo.exercisesCount}</div>
              <div><strong>Speichergröße:</strong> {storageInfo.storageSize}</div>
              <div><strong>Aktuelle State Pläne:</strong> {storageInfo.currentStateWorkoutPlans}</div>
              <div><strong>Aktuelle State Workouts:</strong> {storageInfo.currentStateWorkoutHistory}</div>
              <div><strong>Aktuelle State Übungen:</strong> {storageInfo.currentStateExercises}</div>
            </DebugInfo>
          ) : (
            <div>Lade...</div>
          )}
        </DebugSection>

        <DebugSection>
          <h5>🔧 Aktionen</h5>
          <DebugActions>
            <Button variant="secondary" size="sm" onClick={updateStorageInfo}>
              Aktualisieren
            </Button>
            <Button variant="warning" size="sm" onClick={forceReload}>
              Seite neu laden
            </Button>
            <Button variant="primary" size="sm" onClick={exportData}>
              Daten exportieren
            </Button>
          </DebugActions>
        </DebugSection>

        <DebugSection>
          <h5>⚠️ Problemlösung</h5>
          <WarningText>
            Wenn Änderungen nach "npm start" verschwinden:
          </WarningText>
          <DebugInfo>
            1. Prüfe die Browser-Konsole (F12) auf Fehlermeldungen<br/>
            2. Exportiere deine Daten als Backup<br/>
            3. Lösche den LocalStorage komplett<br/>
            4. Lade die Seite neu
          </DebugInfo>
          <DebugActions>
            <Button variant="danger" size="sm" onClick={clearLocalStorage}>
              🗑️ LocalStorage löschen
            </Button>
          </DebugActions>
        </DebugSection>

        <DebugSection>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Panel schließen
          </Button>
        </DebugSection>
      </DebugContent>
    </DebugContainer>
  );
};

export default DebugPanel; 