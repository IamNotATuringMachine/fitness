import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  createBackup,
  exportBackup,
  validateBackup,
  parseBackupFile,
  restoreFromBackup,
  getBackupStats
} from '../../utils/backupUtils';

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  border-radius: 16px;
  padding: 2rem;
  color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.large};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.hover};
  }
`;

const ImportCard = styled(Card)`
  background: linear-gradient(135deg, ${props => props.theme.colors.secondary} 0%, ${props => props.theme.colors.secondaryDark} 100%);
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
`;

const CardDescription = styled.p`
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.5;
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusCard = styled.div`
  grid-column: 1 / -1;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.medium};
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatusTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  text-align: center;
  display: block;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.7);
    transform: translateY(-2px);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #495057;
  }
`;

const CheckboxContainer = styled.div`
  margin: 1rem 0;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const Label = styled.label`
  color: #495057;
  font-weight: 500;
  cursor: pointer;
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  
  &.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  &.warning {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }
  
  &.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid white;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BackupManager = () => {
  const [currentStats, setCurrentStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [backupToRestore, setBackupToRestore] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [restoreOptions, setRestoreOptions] = useState({
    restoreWorkout: true,
    restoreNutrition: true,
    restoreGamification: true,
    mergeData: false
  });
  const [alerts, setAlerts] = useState([]);
  const fileInputRef = useRef(null);

  const loadCurrentStats = useCallback(() => {
    try {
      const backup = createBackup();
      const stats = getBackupStats(backup);
      setCurrentStats(stats);
    } catch (error) {
      console.error('Fehler beim Laden der aktuellen Statistiken:', error);
      addAlert('Fehler beim Laden der aktuellen Daten', 'error');
    }
  }, []);

  const checkAutoBackupReminder = useCallback(() => {
    const lastBackup = localStorage.getItem('lastBackupTime');
    if (!lastBackup) {
      addAlert('Erstellen Sie Ihr erstes Backup, um Ihre Daten zu sichern!', 'info');
      return;
    }

    const lastBackupDate = new Date(lastBackup);
    const daysSinceLastBackup = (new Date() - lastBackupDate) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastBackup > 7) {
      addAlert(`Ihr letztes Backup ist ${Math.floor(daysSinceLastBackup)} Tage alt. Zeit für ein neues Backup!`, 'warning');
    }
  }, []);

  // Load current data statistics on component mount
  useEffect(() => {
    loadCurrentStats();
    // Set up automatic backup reminder
    checkAutoBackupReminder();
  }, [loadCurrentStats, checkAutoBackupReminder]);

  const addAlert = (message, type = 'info') => {
    const alert = {
      id: Date.now(),
      message,
      type
    };
    setAlerts(prev => [...prev, alert]);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, 5000);
  };

  const handleExportBackup = async () => {
    setIsLoading(true);
    try {
      const backup = createBackup();
      await exportBackup(backup);
      addAlert('Backup erfolgreich heruntergeladen!', 'success');
      
      // Update last backup timestamp
      localStorage.setItem('lastBackupTime', new Date().toISOString());
    } catch (error) {
      console.error('Fehler beim Export:', error);
      addAlert('Fehler beim Exportieren des Backups: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const backup = await parseBackupFile(file);
      const validation = validateBackup(backup);
      
      setBackupToRestore(backup);
      setValidationResult(validation);
      setShowRestoreModal(true);
    } catch (error) {
      console.error('Fehler beim Lesen der Datei:', error);
      addAlert('Fehler beim Lesen der Backup-Datei: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!backupToRestore || !validationResult) return;

    if (!validationResult.isValid) {
      addAlert('Backup ist nicht gültig und kann nicht wiederhergestellt werden.', 'error');
      return;
    }

    const confirmMessage = restoreOptions.mergeData 
      ? 'Sind Sie sicher, dass Sie die Daten zusammenführen möchten? Dies kann nicht rückgängig gemacht werden.'
      : 'Sind Sie sicher, dass Sie alle aktuellen Daten ersetzen möchten? Dies kann nicht rückgängig gemacht werden.';

    if (!window.confirm(confirmMessage)) return;

    setIsLoading(true);

    try {
      const result = await restoreFromBackup(backupToRestore, restoreOptions);
      
      if (result.success) {
        addAlert(`Wiederherstellung erfolgreich! Wiederhergestellt: ${result.restored.join(', ')}`, 'success');
        setShowRestoreModal(false);
        
        // Reload the page to refresh all contexts
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        addAlert(`Wiederherstellung teilweise fehlgeschlagen. Fehler: ${result.errors.join(', ')}`, 'warning');
      }
    } catch (error) {
      console.error('Fehler bei der Wiederherstellung:', error);
      addAlert('Fehler bei der Wiederherstellung: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container>
      <Header>
        <Title>Backup Manager</Title>
        <Subtitle>
          Sichern Sie Ihre Fitness-Daten regelmäßig und stellen Sie sie bei Bedarf wieder her. 
          Ihre Fortschritte sind wertvoll - schützen Sie sie!
        </Subtitle>
      </Header>

      {/* Alerts */}
      {alerts.map(alert => (
        <Alert key={alert.id} className={alert.type}>
          {alert.message}
        </Alert>
      ))}

      <SectionGrid>
        {/* Export Section */}
        <Card>
          <CardIcon>📤</CardIcon>
          <CardTitle>Backup Erstellen</CardTitle>
          <CardDescription>
            Erstellen Sie ein vollständiges Backup aller Ihrer Trainingsdaten, 
            Ernährungspläne und Erfolge.
          </CardDescription>
          <Button onClick={handleExportBackup} disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Backup Herunterladen'}
          </Button>
        </Card>

        {/* Import Section */}
        <ImportCard>
          <CardIcon>📥</CardIcon>
          <CardTitle>Backup Wiederherstellen</CardTitle>
          <CardDescription>
            Laden Sie ein vorhandenes Backup hoch und stellen Sie Ihre Daten wieder her.
          </CardDescription>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            id="backup-file-input"
          />
          <FileInputLabel htmlFor="backup-file-input">
            {selectedFile ? selectedFile.name : 'Backup-Datei Auswählen'}
          </FileInputLabel>
        </ImportCard>
      </SectionGrid>

      {/* Current Data Statistics */}
      {currentStats && (
        <StatusCard>
          <StatusTitle>
            📊 Aktuelle Datenübersicht
          </StatusTitle>
          <StatusGrid>
            <StatItem>
              <StatValue>{currentStats.workout.plans}</StatValue>
              <StatLabel>Trainingspläne</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{currentStats.workout.exercises}</StatValue>
              <StatLabel>Übungen</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{currentStats.workout.history}</StatValue>
              <StatLabel>Trainingseinheiten</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{currentStats.workout.measurements}</StatValue>
              <StatLabel>Körpermessungen</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{currentStats.nutrition.plans}</StatValue>
              <StatLabel>Ernährungspläne</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{currentStats.nutrition.foodItems}</StatValue>
              <StatLabel>Lebensmittel</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{currentStats.gamification.level}</StatValue>
              <StatLabel>Level</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{currentStats.gamification.points}</StatValue>
              <StatLabel>Punkte</StatLabel>
            </StatItem>
          </StatusGrid>
        </StatusCard>
      )}

      {/* Restore Modal */}
      {showRestoreModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Backup Wiederherstellen</ModalTitle>
              <CloseButton onClick={() => setShowRestoreModal(false)}>
                ×
              </CloseButton>
            </ModalHeader>

            {validationResult && (
              <>
                {validationResult.isValid ? (
                  <Alert className="success">
                    ✅ Backup ist gültig und kann wiederhergestellt werden
                  </Alert>
                ) : (
                  <Alert className="error">
                    ❌ Backup ist nicht gültig:
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                      {validationResult.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {backupToRestore && validationResult.isValid && (
                  <>
                    <h3>Backup-Informationen:</h3>
                    <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                      <p><strong>Erstellt:</strong> {format(parseISO(backupToRestore.metadata.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}</p>
                      <p><strong>Von:</strong> {backupToRestore.metadata.createdBy}</p>
                      <p><strong>Größe:</strong> {formatFileSize(currentStats?.totalSize || 0)}</p>
                      {backupToRestore.metadata.description && (
                        <p><strong>Beschreibung:</strong> {backupToRestore.metadata.description}</p>
                      )}
                    </div>

                    <h3>Wiederherstellungsoptionen:</h3>
                    
                    {validationResult.hasWorkoutData && (
                      <CheckboxContainer>
                        <Checkbox
                          type="checkbox"
                          id="restore-workout"
                          checked={restoreOptions.restoreWorkout}
                          onChange={(e) => setRestoreOptions(prev => ({
                            ...prev,
                            restoreWorkout: e.target.checked
                          }))}
                        />
                        <Label htmlFor="restore-workout">Trainingsdaten wiederherstellen</Label>
                      </CheckboxContainer>
                    )}

                    {validationResult.hasNutritionData && (
                      <CheckboxContainer>
                        <Checkbox
                          type="checkbox"
                          id="restore-nutrition"
                          checked={restoreOptions.restoreNutrition}
                          onChange={(e) => setRestoreOptions(prev => ({
                            ...prev,
                            restoreNutrition: e.target.checked
                          }))}
                        />
                        <Label htmlFor="restore-nutrition">Ernährungsdaten wiederherstellen</Label>
                      </CheckboxContainer>
                    )}

                    {validationResult.hasGamificationData && (
                      <CheckboxContainer>
                        <Checkbox
                          type="checkbox"
                          id="restore-gamification"
                          checked={restoreOptions.restoreGamification}
                          onChange={(e) => setRestoreOptions(prev => ({
                            ...prev,
                            restoreGamification: e.target.checked
                          }))}
                        />
                        <Label htmlFor="restore-gamification">Erfolge und Abzeichen wiederherstellen</Label>
                      </CheckboxContainer>
                    )}

                    <CheckboxContainer>
                      <Checkbox
                        type="checkbox"
                        id="merge-data"
                        checked={restoreOptions.mergeData}
                        onChange={(e) => setRestoreOptions(prev => ({
                          ...prev,
                          mergeData: e.target.checked
                        }))}
                      />
                      <Label htmlFor="merge-data">
                        Daten zusammenführen (statt ersetzen)
                      </Label>
                    </CheckboxContainer>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <Button 
                        onClick={handleRestore} 
                        disabled={isLoading}
                        style={{ background: '#28a745', border: 'none' }}
                      >
                        {isLoading ? <LoadingSpinner /> : 'Wiederherstellen'}
                      </Button>
                      <Button 
                        onClick={() => setShowRestoreModal(false)}
                        style={{ background: '#6c757d', border: 'none' }}
                      >
                        Abbrechen
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default BackupManager; 