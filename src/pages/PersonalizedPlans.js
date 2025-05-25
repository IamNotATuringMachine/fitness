import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWorkout } from '../context/WorkoutContext';

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

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.typography.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.cardBackground};
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
`;

const Input = styled.input`
  cursor: pointer;
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.typography.fontSizes.xs} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.md};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.short};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const PlanCard = styled.div`
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

const PlanTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PlanDescription = styled.p`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const SecondaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.gray};
  
  &:hover {
    background-color: ${props => props.theme.colors.grayDark};
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