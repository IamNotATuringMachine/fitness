import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: #333;
`;

const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: #444;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  
  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const CycleCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const WeekCard = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: #f9f9f9;
`;

const IntensitySlider = styled.input`
  width: 100%;
  margin: 1rem 0;
`;

const VolumeSlider = styled.input`
  width: 100%;
  margin: 1rem 0;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  
  span {
    font-size: 0.8rem;
    color: #666;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const PeriodizationTools = () => {
  const { state, dispatch } = useWorkout();
  const navigate = useNavigate();
  
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
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
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
                    
                    <div style={{ marginTop: '1rem' }}>
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
            
            <div style={{ marginTop: '2rem' }}>
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
                <div style={{ marginTop: '1.5rem' }}>
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
            <div style={{ marginTop: '1.5rem' }}>
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