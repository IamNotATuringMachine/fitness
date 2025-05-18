import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';

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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Input = styled.input`
  cursor: pointer;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const PlanCard = styled.div`
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

const PlanTitle = styled.h3`
  margin-bottom: 0.5rem;
`;

const PlanDescription = styled.p`
  margin-bottom: 1rem;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SecondaryButton = styled(Button)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const PersonalizedPlans = () => {
  const { state, dispatch } = useWorkout();
  const { workoutPlans, userProfile } = state;
  const navigate = useNavigate();
  
  // State for the fitness questionnaire, initialized from userProfile
  const [formData, setFormData] = useState({
    fitnessLevel: userProfile?.fitnessLevel || 'beginner',
    goal: userProfile?.goal || 'strength',
    trainingDays: userProfile?.trainingDays || '3',
    equipment: userProfile?.equipment || 'gym',
    limitations: userProfile?.limitations || '',
    preferredExercises: userProfile?.preferredExercises || '',
  });
  
  // State for recommended plans
  const [recommendedPlans, setRecommendedPlans] = useState([]);
  // State to track if user has completed the questionnaire
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save user profile data to context
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: formData
    });
    
    generateRecommendations();
    setQuestionnaireCompleted(true);
  };
  
  // Generate plan recommendations based on user input
  const generateRecommendations = () => {
    // Filter plans based on user preferences
    let filtered = [...(workoutPlans || [])];
    
    // Filter by workout frequency/days
    filtered = filtered.filter(plan => {
      const daysCount = plan.days ? plan.days.length : 0;
      
      if (formData.trainingDays === '1-2' && daysCount <= 2) return true;
      if (formData.trainingDays === '3' && daysCount >= 3 && daysCount <= 4) return true;
      if (formData.trainingDays === '5+' && daysCount >= 5) return true;
      
      // If no plans match exactly, we'll still show some results
      return true;
    });
    
    // Sort by relevance (simple algorithm)
    filtered = filtered.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      // Check if plan type matches goal
      if (a.type && a.type.toLowerCase().includes(formData.goal)) scoreA += 5;
      if (b.type && b.type.toLowerCase().includes(formData.goal)) scoreB += 5;
      
      // Check if difficulty matches fitness level
      if (formData.fitnessLevel === 'beginner' && a.difficulty === 'Anfänger') scoreA += 3;
      if (formData.fitnessLevel === 'intermediate' && a.difficulty === 'Mittel') scoreA += 3;
      if (formData.fitnessLevel === 'advanced' && a.difficulty === 'Fortgeschritten') scoreA += 3;
      
      if (formData.fitnessLevel === 'beginner' && b.difficulty === 'Anfänger') scoreB += 3;
      if (formData.fitnessLevel === 'intermediate' && b.difficulty === 'Mittel') scoreB += 3;
      if (formData.fitnessLevel === 'advanced' && b.difficulty === 'Fortgeschritten') scoreB += 3;
      
      return scoreB - scoreA; // Higher score first
    });
    
    // Limit to top 3 recommendations
    setRecommendedPlans(filtered.slice(0, 3));
    
    // If we don't have enough recommended plans, add some generic recommendations
    if (filtered.length < 3) {
      // Create template plans based on user preferences
      const templatePlans = generateTemplatePlans();
      setRecommendedPlans(prev => [...prev, ...templatePlans].slice(0, 3));
    }
  };
  
  // Generate template plans based on user preferences when we don't have enough matches
  const generateTemplatePlans = () => {
    const templates = [];
    
    // Template for strength
    if (formData.goal === 'strength') {
      templates.push({
        id: 'template-strength',
        name: 'Kraftaufbau-Programm',
        description: 'Ein optimierter Plan für maximalen Kraftzuwachs, basierend auf deinem Fitnesslevel und verfügbarer Zeit.',
        type: 'Kraftaufbau',
        difficulty: formData.fitnessLevel === 'beginner' ? 'Anfänger' : 
                   formData.fitnessLevel === 'intermediate' ? 'Mittel' : 'Fortgeschritten',
        isTemplate: true
      });
    }
    
    // Template for muscle growth
    if (formData.goal === 'muscle') {
      templates.push({
        id: 'template-muscle',
        name: 'Hypertrophie-Programm',
        description: 'Ein spezialisierter Plan für maximales Muskelwachstum, angepasst an dein Fitnesslevel.',
        type: 'Muskelaufbau',
        difficulty: formData.fitnessLevel === 'beginner' ? 'Anfänger' : 
                   formData.fitnessLevel === 'intermediate' ? 'Mittel' : 'Fortgeschritten',
        isTemplate: true
      });
    }
    
    // Template for weight loss
    if (formData.goal === 'weightloss') {
      templates.push({
        id: 'template-weightloss',
        name: 'Fettabbau-Programm',
        description: 'Ein effektiver Plan zur Gewichtsreduktion mit einem Fokus auf Kalorienverbrennung und Stoffwechseloptimierung.',
        type: 'Gewichtsreduktion',
        difficulty: formData.fitnessLevel === 'beginner' ? 'Anfänger' : 
                   formData.fitnessLevel === 'intermediate' ? 'Mittel' : 'Fortgeschritten',
        isTemplate: true
      });
    }
    
    // Template for general fitness
    templates.push({
      id: 'template-fitness',
      name: 'Allgemeines Fitnessprogramm',
      description: 'Ein ausgewogener Plan für allgemeine Fitness, der Kraft, Ausdauer und Beweglichkeit kombiniert.',
      type: 'Allgemeine Fitness',
      difficulty: formData.fitnessLevel === 'beginner' ? 'Anfänger' : 
                 formData.fitnessLevel === 'intermediate' ? 'Mittel' : 'Fortgeschritten',
      isTemplate: true
    });
    
    return templates;
  };
  
  // Navigate to create plan page with template
  const handleCreateFromTemplate = (plan) => {
    if (plan.isTemplate) {
      // Navigate to create plan page with template data
      navigate('/create-plan', { state: { template: formData } });
    } else {
      // Navigate to the existing plan
      navigate(`/edit-plan/${plan.id}`);
    }
  };
  
  // Reset form and go back to questionnaire
  const handleReset = () => {
    setQuestionnaireCompleted(false);
    setFormData({
      fitnessLevel: userProfile?.fitnessLevel || 'beginner',
      goal: userProfile?.goal || 'strength',
      trainingDays: userProfile?.trainingDays || '3',
      equipment: userProfile?.equipment || 'gym',
      limitations: userProfile?.limitations || '',
      preferredExercises: userProfile?.preferredExercises || '',
    });
  };
  
  return (
    <Container>
      <Title>Personalisierte Trainingspläne</Title>
      
      {!questionnaireCompleted ? (
        <Section>
          <SectionTitle>Fitness-Check</SectionTitle>
          <p>Beantworte diese Fragen, um personalisierte Trainingsplanempfehlungen zu erhalten.</p>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="fitnessLevel">Dein aktuelles Fitnesslevel:</Label>
              <Select 
                id="fitnessLevel" 
                name="fitnessLevel" 
                value={formData.fitnessLevel}
                onChange={handleChange}
              >
                <option value="beginner">Anfänger (0-1 Jahr Trainingserfahrung)</option>
                <option value="intermediate">Fortgeschritten (1-3 Jahre Trainingserfahrung)</option>
                <option value="advanced">Erfahren (3+ Jahre Trainingserfahrung)</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="goal">Dein primäres Trainingsziel:</Label>
              <Select 
                id="goal" 
                name="goal" 
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="strength">Kraft steigern</option>
                <option value="muscle">Muskelaufbau</option>
                <option value="weightloss">Gewichtsreduktion</option>
                <option value="endurance">Ausdauer verbessern</option>
                <option value="general">Allgemeine Fitness</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Wie viele Tage pro Woche möchtest du trainieren?</Label>
              <RadioGroup>
                <RadioOption>
                  <Input 
                    type="radio" 
                    name="trainingDays" 
                    value="1-2" 
                    checked={formData.trainingDays === '1-2'}
                    onChange={handleChange}
                  />
                  1-2 Tage
                </RadioOption>
                <RadioOption>
                  <Input 
                    type="radio" 
                    name="trainingDays" 
                    value="3" 
                    checked={formData.trainingDays === '3'}
                    onChange={handleChange}
                  />
                  3-4 Tage
                </RadioOption>
                <RadioOption>
                  <Input 
                    type="radio" 
                    name="trainingDays" 
                    value="5+" 
                    checked={formData.trainingDays === '5+'}
                    onChange={handleChange}
                  />
                  5+ Tage
                </RadioOption>
              </RadioGroup>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="equipment">Verfügbares Equipment:</Label>
              <Select 
                id="equipment" 
                name="equipment" 
                value={formData.equipment}
                onChange={handleChange}
              >
                <option value="gym">Vollausgestattetes Fitnessstudio</option>
                <option value="minimal">Minimale Ausrüstung (Hanteln, Klimmzugstange)</option>
                <option value="bodyweight">Nur Körpergewichtsübungen</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="limitations">Hast du körperliche Einschränkungen oder Verletzungen?</Label>
              <Select 
                id="limitations" 
                name="limitations" 
                value={formData.limitations}
                onChange={handleChange}
              >
                <option value="">Keine Einschränkungen</option>
                <option value="back">Rückenprobleme</option>
                <option value="knee">Knieprobleme</option>
                <option value="shoulder">Schulterprobleme</option>
                <option value="other">Andere</option>
              </Select>
            </FormGroup>
            
            <Button type="submit">Plan empfehlen</Button>
          </form>
        </Section>
      ) : (
        <Section>
          <SectionTitle>Deine personalisierten Empfehlungen</SectionTitle>
          <p>Basierend auf deinen Angaben haben wir folgende Trainingspläne für dich ausgewählt:</p>
          
          {recommendedPlans.length > 0 ? (
            recommendedPlans.map((plan) => (
              <PlanCard key={plan.id}>
                <PlanTitle>{plan.name}</PlanTitle>
                <PlanDescription>
                  {plan.description || `Ein ${plan.type || 'angepasster'} Trainingsplan mit Schwierigkeitsgrad ${plan.difficulty || 'mittel'}.`}
                </PlanDescription>
                {plan.days && (
                  <p>Trainingstage: {plan.days.length}</p>
                )}
                <ButtonGroup>
                  <Button onClick={() => handleCreateFromTemplate(plan)}>
                    {plan.isTemplate ? 'Diesen Plan erstellen' : 'Plan anzeigen'}
                  </Button>
                </ButtonGroup>
              </PlanCard>
            ))
          ) : (
            <p>Leider konnten keine passenden Pläne gefunden werden. Bitte versuche es mit anderen Einstellungen.</p>
          )}
          
          <ButtonGroup style={{ marginTop: '2rem' }}>
            <SecondaryButton onClick={handleReset}>Zurück zum Fragebogen</SecondaryButton>
          </ButtonGroup>
        </Section>
      )}
    </Container>
  );
};

export default PersonalizedPlans; 