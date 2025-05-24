import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Alert } from '../components/ui';
import { sanitizeText, isValidEmail, defaultRateLimiter } from '../utils/security';

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

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  transition: border-color ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  transition: border-color ${props => props.theme.transitions.short};
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  transition: border-color ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xs};
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: ${props => props.theme.spacing.xs};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const FeedbackHistory = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

const FeedbackItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.backgroundSecondary};
`;

const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const FeedbackDate = styled.span`
  font-weight: normal;
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const FeedbackContent = styled.p`
  margin: ${props => props.theme.spacing.sm} 0;
`;

const FeedbackType = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  text-transform: uppercase;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  background-color: ${props => {
    switch (props.type) {
      case 'bug':
        return props.theme.colors.errorLight;
      case 'feature':
        return props.theme.colors.successLight;
      case 'improvement':
        return props.theme.colors.warningLight;
      default:
        return props.theme.colors.grayLight;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'bug':
        return props.theme.colors.errorDark;
      case 'feature':
        return props.theme.colors.successDark;
      case 'improvement':
        return props.theme.colors.warningDark;
      default:
        return props.theme.colors.textDark;
    }
  }};
`;

const NoFeedback = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  padding: ${props => props.theme.spacing.md};
`;

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState(
    JSON.parse(localStorage.getItem('feedbackData')) || []
  );
  
  const [formData, setFormData] = useState({
    type: 'feature',
    category: 'training',
    title: '',
    description: '',
    priority: 'medium',
    email: ''
  });
  
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Sanitize input before setting state
    const sanitizedValue = sanitizeText(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Rate limiting check
    if (!defaultRateLimiter.isAllowed('feedback-submission')) {
      setAlertInfo({
        show: true,
        message: 'Sie haben zu viele Anfragen gesendet. Bitte warten Sie eine Minute.',
        type: 'error'
      });
      return;
    }
    
    // Enhanced validation
    if (!formData.title.trim() || !formData.description.trim()) {
      setAlertInfo({
        show: true,
        message: 'Bitte füllen Sie den Titel und die Beschreibung aus.',
        type: 'error'
      });
      return;
    }
    
    if (formData.title.length > 100) {
      setAlertInfo({
        show: true,
        message: 'Der Titel darf maximal 100 Zeichen lang sein.',
        type: 'error'
      });
      return;
    }
    
    if (formData.description.length > 1000) {
      setAlertInfo({
        show: true,
        message: 'Die Beschreibung darf maximal 1000 Zeichen lang sein.',
        type: 'error'
      });
      return;
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      setAlertInfo({
        show: true,
        message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        type: 'error'
      });
      return;
    }
    
    const newFeedback = {
      id: Date.now().toString(),
      ...formData,
      title: sanitizeText(formData.title),
      description: sanitizeText(formData.description),
      date: new Date().toISOString(),
      status: 'received'
    };
    
    const updatedFeedbackList = [newFeedback, ...feedbackList];
    setFeedbackList(updatedFeedbackList);
    localStorage.setItem('feedbackData', JSON.stringify(updatedFeedbackList));
    
    setFormData({
      type: 'feature',
      category: 'training',
      title: '',
      description: '',
      priority: 'medium',
      email: ''
    });
    
    setAlertInfo({
      show: true,
      message: 'Vielen Dank für Ihr Feedback! Wir haben Ihre Anfrage erhalten.',
      type: 'success'
    });
  };
  
  const resetForm = () => {
    setFormData({
      type: 'feature',
      category: 'training',
      title: '',
      description: '',
      priority: 'medium',
      email: ''
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getFeedbackTypeLabel = (type) => {
    switch (type) {
      case 'bug':
        return 'Fehler';
      case 'feature':
        return 'Feature-Vorschlag';
      case 'improvement':
        return 'Verbesserung';
      default:
        return 'Sonstiges';
    }
  };
  
  const getCategoryLabel = (category) => {
    switch (category) {
      case 'training':
        return 'Trainingsplanung';
      case 'tracking':
        return 'Fortschrittsverfolgung';
      case 'nutrition':
        return 'Ernährung';
      case 'ui':
        return 'Benutzeroberfläche';
      case 'other':
        return 'Sonstiges';
      default:
        return category;
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Feedback & Vorschläge</Title>
        <Subtitle>Helfen Sie uns, FitTrack zu verbessern, indem Sie Feedback geben und Verbesserungsvorschläge machen</Subtitle>
      </PageHeader>
      
      {alertInfo.show && (
        <Alert 
          type={alertInfo.type} 
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        >
          {alertInfo.message}
        </Alert>
      )}
      
      <Section>
        <SectionTitle>Feedback geben</SectionTitle>
        <SectionDescription>
          Wir schätzen Ihr Feedback und verwenden es, um unsere App kontinuierlich zu verbessern.
        </SectionDescription>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="type">Art des Feedbacks</Label>
            <Select 
              id="type" 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
            >
              <option value="feature">Feature-Vorschlag</option>
              <option value="improvement">Verbesserungsvorschlag</option>
              <option value="bug">Fehlermeldung</option>
              <option value="other">Sonstiges</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="category">Kategorie</Label>
            <Select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
            >
              <option value="training">Trainingsplanung</option>
              <option value="tracking">Fortschrittsverfolgung</option>
              <option value="nutrition">Ernährung</option>
              <option value="ui">Benutzeroberfläche</option>
              <option value="other">Sonstiges</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="title">Titel</Label>
            <Input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Ein kurzer Titel für Ihr Feedback"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Beschreibung</Label>
            <TextArea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Detaillierte Beschreibung Ihres Feedbacks oder Vorschlags"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Priorität</Label>
            <RadioGroup>
              <RadioLabel>
                <input 
                  type="radio" 
                  name="priority" 
                  value="low" 
                  checked={formData.priority === 'low'} 
                  onChange={handleChange} 
                />
                Niedrig
              </RadioLabel>
              <RadioLabel>
                <input 
                  type="radio" 
                  name="priority" 
                  value="medium" 
                  checked={formData.priority === 'medium'} 
                  onChange={handleChange} 
                />
                Mittel
              </RadioLabel>
              <RadioLabel>
                <input 
                  type="radio" 
                  name="priority" 
                  value="high" 
                  checked={formData.priority === 'high'} 
                  onChange={handleChange} 
                />
                Hoch
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">E-Mail (optional)</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Ihre E-Mail-Adresse für Rückfragen"
            />
          </FormGroup>
          
          <ButtonContainer>
            <Button type="button" variant="secondary" onClick={resetForm}>Zurücksetzen</Button>
            <Button type="submit">Absenden</Button>
          </ButtonContainer>
        </form>
      </Section>
      
      <Section>
        <SectionTitle>Ihre bisherigen Feedback-Einträge</SectionTitle>
        <SectionDescription>
          Hier sehen Sie eine Übersicht aller Ihrer abgesendeten Feedback-Einträge und deren aktuellen Status.
        </SectionDescription>
        
        <FeedbackHistory>
          {feedbackList.length > 0 ? (
            feedbackList.map(feedback => (
              <FeedbackItem key={feedback.id}>
                <FeedbackHeader>
                  <div>
                    {feedback.title}
                    <FeedbackType type={feedback.type}>{getFeedbackTypeLabel(feedback.type)}</FeedbackType>
                  </div>
                  <FeedbackDate>{formatDate(feedback.date)}</FeedbackDate>
                </FeedbackHeader>
                <div>Kategorie: {getCategoryLabel(feedback.category)}</div>
                <div>Priorität: {feedback.priority === 'high' ? 'Hoch' : feedback.priority === 'medium' ? 'Mittel' : 'Niedrig'}</div>
                <FeedbackContent>{feedback.description}</FeedbackContent>
                <div>Status: {feedback.status === 'received' ? 'Empfangen' : feedback.status}</div>
              </FeedbackItem>
            ))
          ) : (
            <NoFeedback>Sie haben noch kein Feedback abgegeben.</NoFeedback>
          )}
        </FeedbackHistory>
      </Section>
    </PageContainer>
  );
};

export default Feedback; 