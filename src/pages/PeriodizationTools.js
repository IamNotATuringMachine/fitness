import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text};
`;

const Section = styled.section`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.cardBackground};
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.cardBackground};
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  min-height: 100px;
  background-color: ${props => props.theme.colors.cardBackground};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${props => props.theme.spacing.md};
  
  th, td {
    border: 1px solid ${props => props.theme.colors.border};
    padding: ${props => props.theme.typography.fontSizes.xs};
    text-align: left;
  }
  
  th {
    background-color: ${props => props.theme.colors.grayLight};
    font-weight: ${props => props.theme.typography.fontWeights.bold};
  }
  
  tr:nth-child(even) td {
    background-color: ${props => props.theme.colors.background};
  }
`;

const CycleCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  transition: transform ${props => props.theme.transitions.short}, box-shadow ${props => props.theme.transitions.short};
  background-color: ${props => props.theme.colors.cardBackground};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const WeekCard = styled.div`
  border: 1px solid ${props => props.theme.colors.grayLight};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
`;

const IntensitySlider = styled.input.attrs({ type: 'range' })`
  width: 100%;
  margin: ${props => props.theme.spacing.md} 0;
`;

const VolumeSlider = styled.input.attrs({ type: 'range' })`
  width: 100%;
  margin: ${props => props.theme.spacing.md} 0;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.xs};
  
  span {
    font-size: ${props => props.theme.typography.fontSizes.sm};
    color: ${props => props.theme.colors.textLight};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.gray};
  
  &:hover {
    background-color: ${props => props.theme.colors.grayDark};
  }
`;

const PeriodizationTools = () => {
  const { state, dispatch } = useWorkout();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State for periodization plan
  const [periodizationPlan, setPeriodizationPlan] = useState({
    name: '',
    description: '',
    type: 'linear',
    targetPlan: '',
    mesoCycles: []
  });
  
  // State for the currently edited meso cycle
  const [currentMesoCycle, setCurrentMesoCycle] = useState({
    name: '',
    goal: '',
    weekCount: 4,
    weeks: []
  });
  
  // State to track view mode
  const [viewMode, setViewMode] = useState('create'); // 'create', 'editMeso', 'viewPlan'
  
  // Initialize weeks for a new meso cycle
  useEffect(() => {
    if (currentMesoCycle.weekCount > 0 && currentMesoCycle.weeks.length === 0) {
      const initialWeeks = [];
      for (let i = 0; i < currentMesoCycle.weekCount; i++) {
        initialWeeks.push({
          index: i + 1,
          intensity: 70,
          volume: 70,
          notes: ''
        });
      }
      setCurrentMesoCycle(prev => ({
        ...prev,
        weeks: initialWeeks
      }));
    }
  }, [currentMesoCycle.weekCount]);
  
  // Handle periodization plan change
  const handlePlanChange = (e) => {
    setPeriodizationPlan({
      ...periodizationPlan,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle meso cycle change
  const handleMesoCycleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'weekCount') {
      const weekCount = parseInt(value, 10);
      if (weekCount > 0) {
        const weeks = [];
        for (let i = 0; i < weekCount; i++) {
          // Keep existing weeks if possible
          const existingWeek = currentMesoCycle.weeks[i];
          weeks.push(existingWeek || {
            index: i + 1,
            intensity: 70,
            volume: 70,
            notes: ''
          });
        }
        setCurrentMesoCycle({
          ...currentMesoCycle,
          weekCount,
          weeks
        });
      }
    } else {
      setCurrentMesoCycle({
        ...currentMesoCycle,
        [name]: value
      });
    }
  };
  
  // Handle week intensity/volume change
  const handleWeekChange = (index, field, value) => {
    const updatedWeeks = currentMesoCycle.weeks.map((week, i) => {
      if (i === index) {
        return {
          ...week,
          [field]: field === 'notes' ? value : parseInt(value, 10)
        };
      }
      return week;
    });
    
    setCurrentMesoCycle({
      ...currentMesoCycle,
      weeks: updatedWeeks
    });
  };
  
  // Add meso cycle to periodization plan
  const handleAddMesoCycle = () => {
    if (!currentMesoCycle.name) {
      alert('Bitte gib einen Namen für den Mesozyklus ein.');
      return;
    }
    
    const newMesoCycle = {
      ...currentMesoCycle,
      id: Date.now().toString()
    };
    
    setPeriodizationPlan({
      ...periodizationPlan,
      mesoCycles: [...periodizationPlan.mesoCycles, newMesoCycle]
    });
    
    // Reset current meso cycle form
    setCurrentMesoCycle({
      name: '',
      goal: '',
      weekCount: 4,
      weeks: []
    });
    
    setViewMode('create');
  };
  
  // Edit a meso cycle
  const handleEditMesoCycle = (id) => {
    const mesoCycleToEdit = periodizationPlan.mesoCycles.find(cycle => cycle.id === id);
    if (mesoCycleToEdit) {
      setCurrentMesoCycle(mesoCycleToEdit);
      setViewMode('editMeso');
    }
  };
  
  // Update an existing meso cycle
  const handleUpdateMesoCycle = () => {
    setPeriodizationPlan({
      ...periodizationPlan,
      mesoCycles: periodizationPlan.mesoCycles.map(cycle => 
        cycle.id === currentMesoCycle.id ? currentMesoCycle : cycle
      )
    });
    
    // Reset current meso cycle form
    setCurrentMesoCycle({
      name: '',
      goal: '',
      weekCount: 4,
      weeks: []
    });
    
    setViewMode('create');
  };
  
  // Remove a meso cycle
  const handleRemoveMesoCycle = (id) => {
    setPeriodizationPlan({
      ...periodizationPlan,
      mesoCycles: periodizationPlan.mesoCycles.filter(cycle => cycle.id !== id)
    });
  };
  
  // Save the complete periodization plan
  const handleSavePlan = () => {
    if (!periodizationPlan.name) {
      alert('Bitte gib einen Namen für den Periodisierungsplan ein.');
      return;
    }
    
    if (periodizationPlan.mesoCycles.length === 0) {
      alert('Bitte füge mindestens einen Mesozyklus hinzu.');
      return;
    }
    
    const newPlan = {
      ...periodizationPlan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    dispatch({
      type: 'ADD_PERIODIZATION_PLAN',
      payload: newPlan
    });
    
    // Reset form
    setPeriodizationPlan({
      name: '',
      description: '',
      type: 'linear',
      targetPlan: '',
      mesoCycles: []
    });
    
    alert('Periodisierungsplan erfolgreich gespeichert!');
  };
  
  // Get cycle type description
  const getCycleTypeDescription = (type) => {
    switch(type) {
      case 'linear':
        return 'Lineare Steigerung von Intensität/Volumen über mehrere Wochen, gefolgt von einer Deload-Phase.';
      case 'undulating':
        return 'Regelmäßiger Wechsel zwischen Tagen oder Wochen mit unterschiedlicher Intensität und Volumen.';
      case 'block':
        return 'Fokussierung auf bestimmte Fähigkeiten in einzelnen Phasen (z.B. Hypertrophie, Kraft, Leistung).';
      case 'conjugate':
        return 'Gleichzeitige Entwicklung verschiedener Fähigkeiten mit unterschiedlichen Methoden.';
      default:
        return '';
    }
  };
  
  return (
    <Container>
      <Title>Periodisierungstools</Title>
      
      <Section>
        <SectionTitle>Was ist Periodisierung?</SectionTitle>
        <p>
          Periodisierung ist die systematische Planung des Trainings in verschiedenen Zeitabschnitten (Zyklen), 
          um optimale Leistungssteigerung zu erzielen und Übertraining zu vermeiden. Durch die gezielte Variation 
          von Trainingsintensität und -volumen können Kraft, Hypertrophie und Leistung maximiert werden.
        </p>
        <Table>
          <thead>
            <tr>
              <th>Zyklustyp</th>
              <th>Beschreibung</th>
              <th>Typische Dauer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Makrozyklus</td>
              <td>Langfristiger Trainingszeitraum mit einem übergeordneten Ziel</td>
              <td>3-12 Monate</td>
            </tr>
            <tr>
              <td>Mesozyklus</td>
              <td>Mittelfristiger Trainingszeitraum mit spezifischem Trainingsfokus</td>
              <td>3-6 Wochen</td>
            </tr>
            <tr>
              <td>Mikrozyklus</td>
              <td>Kurzfristiger Trainingszeitraum (meist eine Trainingswoche)</td>
              <td>1 Woche</td>
            </tr>
          </tbody>
        </Table>
      </Section>
      
      {viewMode === 'create' && (
        <>
          <Section>
            <SectionTitle>Neuen Periodisierungsplan erstellen</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="name">Name des Plans</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                value={periodizationPlan.name}
                onChange={handlePlanChange}
                placeholder="z.B. 12-Wochen Kraftaufbau"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={periodizationPlan.description}
                onChange={handlePlanChange}
                placeholder="Beschreibe hier deinen Periodisierungsplan..."
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="type">Art der Periodisierung</Label>
              <Select 
                id="type" 
                name="type" 
                value={periodizationPlan.type}
                onChange={handlePlanChange}
              >
                <option value="linear">Lineare Periodisierung</option>
                <option value="undulating">Wellenförmige Periodisierung</option>
                <option value="block">Block-Periodisierung</option>
                <option value="conjugate">Konjugat-Periodisierung</option>
              </Select>
              <p style={{ 
                fontSize: theme.typography.fontSizes.sm, 
                color: theme.colors.textLight, 
                marginTop: theme.spacing.sm 
              }}>
                {getCycleTypeDescription(periodizationPlan.type)}
              </p>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="targetPlan">Ziel-Trainingsplan (optional)</Label>
              <Select 
                id="targetPlan" 
                name="targetPlan" 
                value={periodizationPlan.targetPlan}
                onChange={handlePlanChange}
              >
                <option value="">Keiner (allgemeine Periodisierung)</option>
                {state.workoutPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </Section>
          
          <Section>
            <SectionTitle>Mesozyklen</SectionTitle>
            
            {periodizationPlan.mesoCycles.length > 0 ? (
              <>
                {periodizationPlan.mesoCycles.map((cycle, index) => (
                  <CycleCard key={cycle.id}>
                    <h3>Mesozyklus {index + 1}: {cycle.name}</h3>
                    <p><strong>Ziel:</strong> {cycle.goal}</p>
                    <p><strong>Dauer:</strong> {cycle.weekCount} Wochen</p>
                    
                    <div style={{ marginTop: theme.spacing.md }}>
                      <h4>Wochen:</h4>
                      {cycle.weeks.map((week, i) => (
                        <WeekCard key={i}>
                          <p><strong>Woche {week.index}:</strong></p>
                          <p>Intensität: {week.intensity}% | Volumen: {week.volume}%</p>
                          {week.notes && <p><strong>Notizen:</strong> {week.notes}</p>}
                        </WeekCard>
                      ))}
                    </div>
                    
                    <ButtonGroup>
                      <Button onClick={() => handleEditMesoCycle(cycle.id)}>
                        Bearbeiten
                      </Button>
                      <SecondaryButton onClick={() => handleRemoveMesoCycle(cycle.id)}>
                        Entfernen
                      </SecondaryButton>
                    </ButtonGroup>
                  </CycleCard>
                ))}
              </>
            ) : (
              <p>Noch keine Mesozyklen hinzugefügt. Füge unten einen neuen Mesozyklus hinzu.</p>
            )}
            
            <div style={{ marginTop: theme.spacing.xl }}>
              <h3>Neuen Mesozyklus hinzufügen</h3>
              
              <FormGroup>
                <Label htmlFor="mesoName">Name des Mesozyklus</Label>
                <Input 
                  type="text" 
                  id="mesoName" 
                  name="name" 
                  value={currentMesoCycle.name}
                  onChange={handleMesoCycleChange}
                  placeholder="z.B. Hypertrophie-Phase"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="goal">Ziel des Mesozyklus</Label>
                <Input 
                  type="text" 
                  id="goal" 
                  name="goal" 
                  value={currentMesoCycle.goal}
                  onChange={handleMesoCycleChange}
                  placeholder="z.B. Muskelaufbau, Kraftsteigerung, Erholung"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="weekCount">Anzahl der Wochen</Label>
                <Input 
                  type="number" 
                  id="weekCount" 
                  name="weekCount" 
                  value={currentMesoCycle.weekCount}
                  onChange={handleMesoCycleChange}
                  min="1"
                  max="12"
                />
              </FormGroup>
              
              {currentMesoCycle.weeks.length > 0 && (
                <div style={{ marginTop: theme.spacing.lg }}>
                  <h4>Wochenplanung:</h4>
                  
                  {currentMesoCycle.weeks.map((week, index) => (
                    <WeekCard key={index}>
                      <h5>Woche {week.index}</h5>
                      
                      <SliderContainer>
                        <Label>Intensität: {week.intensity}%</Label>
                        <IntensitySlider 
                          type="range" 
                          min="40" 
                          max="100" 
                          value={week.intensity}
                          onChange={(e) => handleWeekChange(index, 'intensity', e.target.value)}
                        />
                        <SliderLabels>
                          <span>Gering (40%)</span>
                          <span>Mittel (70%)</span>
                          <span>Hoch (100%)</span>
                        </SliderLabels>
                      </SliderContainer>
                      
                      <SliderContainer>
                        <Label>Volumen: {week.volume}%</Label>
                        <VolumeSlider 
                          type="range" 
                          min="40" 
                          max="100" 
                          value={week.volume}
                          onChange={(e) => handleWeekChange(index, 'volume', e.target.value)}
                        />
                        <SliderLabels>
                          <span>Gering (40%)</span>
                          <span>Mittel (70%)</span>
                          <span>Hoch (100%)</span>
                        </SliderLabels>
                      </SliderContainer>
                      
                      <FormGroup>
                        <Label>Notizen zur Woche</Label>
                        <Textarea 
                          value={week.notes}
                          onChange={(e) => handleWeekChange(index, 'notes', e.target.value)}
                          placeholder="z.B. Erhöhung des Gewichts, Fokus auf bestimmte Übungen..."
                        />
                      </FormGroup>
                    </WeekCard>
                  ))}
                </div>
              )}
              
              <ButtonGroup>
                <Button onClick={handleAddMesoCycle}>
                  Mesozyklus hinzufügen
                </Button>
              </ButtonGroup>
            </div>
          </Section>
          
          <ButtonGroup style={{ justifyContent: 'flex-end' }}>
            <SecondaryButton onClick={() => navigate(-1)}>
              Abbrechen
            </SecondaryButton>
            <Button onClick={handleSavePlan}>
              Periodisierungsplan speichern
            </Button>
          </ButtonGroup>
        </>
      )}
      
      {viewMode === 'editMeso' && (
        <Section>
          <SectionTitle>Mesozyklus bearbeiten</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="mesoName">Name des Mesozyklus</Label>
            <Input 
              type="text" 
              id="mesoName" 
              name="name" 
              value={currentMesoCycle.name}
              onChange={handleMesoCycleChange}
              placeholder="z.B. Hypertrophie-Phase"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="goal">Ziel des Mesozyklus</Label>
            <Input 
              type="text" 
              id="goal" 
              name="goal" 
              value={currentMesoCycle.goal}
              onChange={handleMesoCycleChange}
              placeholder="z.B. Muskelaufbau, Kraftsteigerung, Erholung"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="weekCount">Anzahl der Wochen</Label>
            <Input 
              type="number" 
              id="weekCount" 
              name="weekCount" 
              value={currentMesoCycle.weekCount}
              onChange={handleMesoCycleChange}
              min="1"
              max="12"
            />
          </FormGroup>
          
          {currentMesoCycle.weeks.length > 0 && (
            <div style={{ marginTop: theme.spacing.lg }}>
              <h4>Wochenplanung:</h4>
              
              {currentMesoCycle.weeks.map((week, index) => (
                <WeekCard key={index}>
                  <h5>Woche {week.index}</h5>
                  
                  <SliderContainer>
                    <Label>Intensität: {week.intensity}%</Label>
                    <IntensitySlider 
                      type="range" 
                      min="40" 
                      max="100" 
                      value={week.intensity}
                      onChange={(e) => handleWeekChange(index, 'intensity', e.target.value)}
                    />
                    <SliderLabels>
                      <span>Gering (40%)</span>
                      <span>Mittel (70%)</span>
                      <span>Hoch (100%)</span>
                    </SliderLabels>
                  </SliderContainer>
                  
                  <SliderContainer>
                    <Label>Volumen: {week.volume}%</Label>
                    <VolumeSlider 
                      type="range" 
                      min="40" 
                      max="100" 
                      value={week.volume}
                      onChange={(e) => handleWeekChange(index, 'volume', e.target.value)}
                    />
                    <SliderLabels>
                      <span>Gering (40%)</span>
                      <span>Mittel (70%)</span>
                      <span>Hoch (100%)</span>
                    </SliderLabels>
                  </SliderContainer>
                  
                  <FormGroup>
                    <Label>Notizen zur Woche</Label>
                    <Textarea 
                      value={week.notes}
                      onChange={(e) => handleWeekChange(index, 'notes', e.target.value)}
                      placeholder="z.B. Erhöhung des Gewichts, Fokus auf bestimmte Übungen..."
                    />
                  </FormGroup>
                </WeekCard>
              ))}
            </div>
          )}
          
          <ButtonGroup>
            <Button onClick={handleUpdateMesoCycle}>
              Änderungen speichern
            </Button>
            <SecondaryButton onClick={() => {
              setCurrentMesoCycle({
                name: '',
                goal: '',
                weekCount: 4,
                weeks: []
              });
              setViewMode('create');
            }}>
              Abbrechen
            </SecondaryButton>
          </ButtonGroup>
        </Section>
      )}
    </Container>
  );
};

export default PeriodizationTools; 