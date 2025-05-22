import React, { useState } from 'react';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import { Card, Button, Alert } from '../components/ui';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xxl};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.md};
`;

const Section = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SectionDescription = styled.p`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textLight};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const ImportInput = styled.input`
  display: none;
`;

const ImportLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.short};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.short};
`;

const DataImportExport = () => {
  const { state, dispatch } = useWorkout();
  const [importStatus, setImportStatus] = useState({ message: '', type: '' });

  // Export data in JSON format
  const exportJson = (dataType) => {
    let data;
    let fileName;

    switch (dataType) {
      case 'workoutPlans':
        data = state.workoutPlans;
        fileName = 'workout-plans.json';
        break;
      case 'exercises':
        data = state.exercises;
        fileName = 'exercises.json';
        break;
      case 'workoutHistory':
        data = state.workoutHistory;
        fileName = 'workout-history.json';
        break;
      case 'bodyMeasurements':
        data = state.bodyMeasurements;
        fileName = 'body-measurements.json';
        break;
      case 'all':
        data = state;
        fileName = 'fittrack-all-data.json';
        break;
      default:
        data = {};
        fileName = 'data.json';
    }

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export data in CSV format
  const exportCsv = (dataType) => {
    let data;
    let fileName;
    let csvContent;

    switch (dataType) {
      case 'workoutPlans':
        // For workout plans, we'll export a simplified version since the structure is complex
        data = state.workoutPlans.map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description || '',
          dateCreated: plan.dateCreated || '',
          numberOfDays: plan.days ? plan.days.length : 0
        }));
        fileName = 'workout-plans.csv';
        break;
      case 'exercises':
        data = state.exercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          muscleGroups: exercise.muscleGroups ? exercise.muscleGroups.join(', ') : '',
          equipment: exercise.equipment ? exercise.equipment.join(', ') : '',
          difficulty: exercise.difficulty || ''
        }));
        fileName = 'exercises.csv';
        break;
      case 'workoutHistory':
        data = state.workoutHistory.map(entry => ({
          id: entry.id,
          date: entry.date || '',
          planId: entry.planId || '',
          planName: entry.planName || '',
          duration: entry.duration || '',
        }));
        fileName = 'workout-history.csv';
        break;
      case 'bodyMeasurements':
        data = state.bodyMeasurements.map(measurement => ({
          id: measurement.id,
          date: measurement.date || '',
          weight: measurement.weight || '',
          bodyFat: measurement.bodyFat || '',
          chest: measurement.chest || '',
          waist: measurement.waist || '',
          hips: measurement.hips || '',
          arms: measurement.arms || '',
          legs: measurement.legs || '',
        }));
        fileName = 'body-measurements.csv';
        break;
      default:
        data = [];
        fileName = 'data.csv';
    }

    // Create CSV header
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      csvContent = [headers.join(',')];
      
      // Add data rows
      data.forEach(item => {
        const row = headers.map(header => {
          const cell = item[header] || '';
          // Escape quotes and wrap with quotes if the cell contains commas or quotes
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        });
        csvContent.push(row.join(','));
      });
      
      csvContent = csvContent.join('\n');
    } else {
      csvContent = '';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data
  const handleImport = (event, dataType) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let importedData;
        
        // Check if file is JSON
        if (file.name.endsWith('.json')) {
          importedData = JSON.parse(content);
          
          // Import based on data type
          switch (dataType) {
            case 'workoutPlans':
              if (Array.isArray(importedData)) {
                importedData.forEach(plan => {
                  dispatch({ type: 'ADD_WORKOUT_PLAN', payload: plan });
                });
                setImportStatus({ 
                  message: `Erfolgreich ${importedData.length} Trainingspläne importiert`, 
                  type: 'success'
                });
              } else {
                setImportStatus({ 
                  message: 'Ungültiges Format für Trainingspläne', 
                  type: 'error'
                });
              }
              break;
            case 'exercises':
              if (Array.isArray(importedData)) {
                importedData.forEach(exercise => {
                  dispatch({ type: 'ADD_EXERCISE', payload: exercise });
                });
                setImportStatus({ 
                  message: `Erfolgreich ${importedData.length} Übungen importiert`, 
                  type: 'success'
                });
              } else {
                setImportStatus({ 
                  message: 'Ungültiges Format für Übungen', 
                  type: 'error'
                });
              }
              break;
            case 'workoutHistory':
              if (Array.isArray(importedData)) {
                importedData.forEach(entry => {
                  dispatch({ type: 'TRACK_WORKOUT', payload: entry });
                });
                setImportStatus({ 
                  message: `Erfolgreich ${importedData.length} Trainingseinträge importiert`, 
                  type: 'success'
                });
              } else {
                setImportStatus({ 
                  message: 'Ungültiges Format für Trainingshistorie', 
                  type: 'error'
                });
              }
              break;
            case 'bodyMeasurements':
              if (Array.isArray(importedData)) {
                importedData.forEach(measurement => {
                  dispatch({ type: 'TRACK_BODY_MEASUREMENT', payload: measurement });
                });
                setImportStatus({ 
                  message: `Erfolgreich ${importedData.length} Körpermaßeinträge importiert`, 
                  type: 'success'
                });
              } else {
                setImportStatus({ 
                  message: 'Ungültiges Format für Körpermaße', 
                  type: 'error'
                });
              }
              break;
            case 'all':
              // Be careful with full data import as it can overwrite existing data
              if (importedData.workoutPlans) {
                importedData.workoutPlans.forEach(plan => {
                  dispatch({ type: 'ADD_WORKOUT_PLAN', payload: plan });
                });
              }
              if (importedData.exercises) {
                importedData.exercises.forEach(exercise => {
                  dispatch({ type: 'ADD_EXERCISE', payload: exercise });
                });
              }
              if (importedData.workoutHistory) {
                importedData.workoutHistory.forEach(entry => {
                  dispatch({ type: 'TRACK_WORKOUT', payload: entry });
                });
              }
              if (importedData.bodyMeasurements) {
                importedData.bodyMeasurements.forEach(measurement => {
                  dispatch({ type: 'TRACK_BODY_MEASUREMENT', payload: measurement });
                });
              }
              setImportStatus({ 
                message: 'Alle Daten erfolgreich importiert', 
                type: 'success'
              });
              break;
            default:
              setImportStatus({ 
                message: 'Unbekannter Datentyp', 
                type: 'error'
              });
          }
        } else if (file.name.endsWith('.csv')) {
          // Basic CSV parsing
          const rows = content.split('\n');
          if (rows.length < 2) {
            setImportStatus({ message: 'CSV-Datei ist leer oder hat kein Header', type: 'error' });
            return;
          }
          
          const headers = rows[0].split(',');
          const parsedData = [];
          
          for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;
            
            const values = parseCSVRow(rows[i]);
            const entry = {};
            
            for (let j = 0; j < headers.length; j++) {
              if (j < values.length) {
                entry[headers[j]] = values[j];
              }
            }
            
            parsedData.push(entry);
          }
          
          // Now process the parsed data similar to JSON handling
          switch (dataType) {
            case 'exercises':
              parsedData.forEach(exercise => {
                // Process specific fields as needed
                if (exercise.muscleGroups && typeof exercise.muscleGroups === 'string') {
                  exercise.muscleGroups = exercise.muscleGroups.split(', ');
                }
                if (exercise.equipment && typeof exercise.equipment === 'string') {
                  exercise.equipment = exercise.equipment.split(', ');
                }
                dispatch({ type: 'ADD_EXERCISE', payload: exercise });
              });
              setImportStatus({ 
                message: `Erfolgreich ${parsedData.length} Übungen aus CSV importiert`, 
                type: 'success'
              });
              break;
            // Handle other data types as needed
            default:
              setImportStatus({ message: 'CSV-Import für diesen Datentyp nicht unterstützt', type: 'error' });
          }
        } else {
          setImportStatus({ message: 'Nicht unterstütztes Dateiformat', type: 'error' });
        }
      } catch (error) {
        console.error('Fehler beim Importieren:', error);
        setImportStatus({ message: `Importfehler: ${error.message}`, type: 'error' });
      }
    };
    
    reader.onerror = () => {
      setImportStatus({ message: 'Fehler beim Lesen der Datei', type: 'error' });
    };
    
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Helper function to parse CSV rows correctly (handling quoted fields)
  const parseCSVRow = (row) => {
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        if (inQuotes && i + 1 < row.length && row[i + 1] === '"') {
          // Handle escaped quotes (double quotes inside quotes)
          currentValue += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last field
    result.push(currentValue);
    return result;
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Datenimport und -export</Title>
        <Subtitle>Exportieren und importieren Sie Ihre Trainingsdaten in verschiedenen Formaten</Subtitle>
      </PageHeader>

      {importStatus.message && (
        <Alert 
          type={importStatus.type} 
          onClose={() => setImportStatus({ message: '', type: '' })}
        >
          {importStatus.message}
        </Alert>
      )}

      <Section>
        <SectionTitle>Trainingspläne exportieren</SectionTitle>
        <SectionDescription>
          Exportieren Sie Ihre Trainingspläne zur Sicherung oder zur Verwendung in anderen Anwendungen.
        </SectionDescription>
        <ButtonContainer>
          <Button onClick={() => exportJson('workoutPlans')}>Als JSON exportieren</Button>
          <Button variant="secondary" onClick={() => exportCsv('workoutPlans')}>Als CSV exportieren</Button>
        </ButtonContainer>
      </Section>

      <Section>
        <SectionTitle>Übungsbibliothek exportieren</SectionTitle>
        <SectionDescription>
          Exportieren Sie Ihre persönliche Übungsbibliothek.
        </SectionDescription>
        <ButtonContainer>
          <Button onClick={() => exportJson('exercises')}>Als JSON exportieren</Button>
          <Button variant="secondary" onClick={() => exportCsv('exercises')}>Als CSV exportieren</Button>
        </ButtonContainer>
      </Section>

      <Section>
        <SectionTitle>Trainingshistorie exportieren</SectionTitle>
        <SectionDescription>
          Exportieren Sie Ihre absolvierte Trainingseinheiten für die Analyse in externen Tools.
        </SectionDescription>
        <ButtonContainer>
          <Button onClick={() => exportJson('workoutHistory')}>Als JSON exportieren</Button>
          <Button variant="secondary" onClick={() => exportCsv('workoutHistory')}>Als CSV exportieren</Button>
        </ButtonContainer>
      </Section>

      <Section>
        <SectionTitle>Körpermaße exportieren</SectionTitle>
        <SectionDescription>
          Exportieren Sie Ihre Körpermaße für die langfristige Verfolgung Ihrer Fortschritte.
        </SectionDescription>
        <ButtonContainer>
          <Button onClick={() => exportJson('bodyMeasurements')}>Als JSON exportieren</Button>
          <Button variant="secondary" onClick={() => exportCsv('bodyMeasurements')}>Als CSV exportieren</Button>
        </ButtonContainer>
      </Section>

      <Section>
        <SectionTitle>Alle Daten exportieren</SectionTitle>
        <SectionDescription>
          Exportieren Sie alle Ihre Daten für eine vollständige Sicherung.
        </SectionDescription>
        <ButtonContainer>
          <Button onClick={() => exportJson('all')}>Als JSON exportieren</Button>
        </ButtonContainer>
      </Section>

      <Section>
        <SectionTitle>Daten importieren</SectionTitle>
        <SectionDescription>
          Importieren Sie zuvor exportierte Daten oder Daten aus anderen Quellen.
        </SectionDescription>
        
        <div>
          <h3>Trainingspläne importieren</h3>
          <ImportInput 
            type="file" 
            id="import-workout-plans" 
            accept=".json,.csv"
            onChange={(e) => handleImport(e, 'workoutPlans')}
          />
          <ImportLabel htmlFor="import-workout-plans">Trainingspläne importieren</ImportLabel>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <h3>Übungen importieren</h3>
          <ImportInput 
            type="file" 
            id="import-exercises" 
            accept=".json,.csv"
            onChange={(e) => handleImport(e, 'exercises')}
          />
          <ImportLabel htmlFor="import-exercises">Übungen importieren</ImportLabel>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <h3>Trainingshistorie importieren</h3>
          <ImportInput 
            type="file" 
            id="import-workout-history" 
            accept=".json,.csv"
            onChange={(e) => handleImport(e, 'workoutHistory')}
          />
          <ImportLabel htmlFor="import-workout-history">Trainingshistorie importieren</ImportLabel>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <h3>Körpermaße importieren</h3>
          <ImportInput 
            type="file" 
            id="import-body-measurements" 
            accept=".json,.csv"
            onChange={(e) => handleImport(e, 'bodyMeasurements')}
          />
          <ImportLabel htmlFor="import-body-measurements">Körpermaße importieren</ImportLabel>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <h3>Alle Daten importieren</h3>
          <ImportInput 
            type="file" 
            id="import-all" 
            accept=".json"
            onChange={(e) => handleImport(e, 'all')}
          />
          <ImportLabel htmlFor="import-all">Vollständigen Datensatz importieren</ImportLabel>
        </div>
      </Section>
    </PageContainer>
  );
};

export default DataImportExport; 