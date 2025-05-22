import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  margin: 0;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const TemplateCard = styled.div`
  border: ${props => props.selected ? `2px solid ${props.theme.colors.secondary}` : `1px solid ${props.theme.colors.border}`};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.small};
  transition: transform ${props => props.theme.transitions.short}, box-shadow ${props => props.theme.transitions.short}, border-color ${props => props.theme.transitions.short};
  cursor: pointer;
  transform: ${props => props.selected ? 'translateY(-5px)' : 'none'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.selected ? props.theme.colors.secondary : props.theme.colors.primaryLight};
  }
`;

const TemplateName = styled.h3`
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TemplateDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const TemplateInfo = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  border: none;
  cursor: pointer;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.white};
  
  &.primary {
    background-color: ${props => props.theme.colors.secondary};
    
    &:hover {
      background-color: ${props => props.theme.colors.secondaryDark};
    }
  }
  
  &.secondary {
    background-color: ${props => props.theme.colors.grayLight};
    color: ${props => props.theme.colors.text};
    
    &:hover {
      background-color: ${props => props.theme.colors.border};
    }
  }
`;

// Predefined workout templates
const workoutTemplates = [
  {
    id: 'template-1',
    name: 'Ganzkörper-Workout für Anfänger',
    description: 'Ein vollständiges Ganzkörpertraining für Einsteiger, das alle wichtigen Muskelgruppen anspricht.',
    difficulty: 'Anfänger',
    duration: '45-60 Minuten',
    frequency: '3x pro Woche',
    goal: 'Allgemeine Fitness',
    template: {
      name: 'Ganzkörper-Workout für Anfänger',
      days: [
        {
          id: uuidv4(),
          name: 'Tag 1 - Ganzkörper',
          exercises: [
            { 
              id: uuidv4(), 
              name: 'Kniebeugen', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 60,
              notes: 'Achte auf eine gerade Rückenposition und dass die Knie nicht über die Zehenspitzen hinausragen.'
            },
            { 
              id: uuidv4(), 
              name: 'Bankdrücken', 
              sets: 3, 
              reps: 10, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 60,
              notes: 'Bei Anfängern kann auch mit Kurzhanteln gearbeitet werden.'
            },
            { 
              id: uuidv4(), 
              name: 'Klimmzüge', 
              sets: 3, 
              reps: 8, 
              weight: 0, 
              repsInReserve: 1, 
              rest: 60,
              notes: 'Bei Bedarf Hilfestellung nutzen oder mit Negativen Klimmzügen starten.'
            },
            { 
              id: uuidv4(), 
              name: 'Schulterdrücken', 
              sets: 3, 
              reps: 10, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 60,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Beinstrecken', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 60,
              notes: ''
            }
          ]
        }
      ],
      notes: 'Dieses Workout eignet sich hervorragend für Einsteiger. Mindestens einen Tag Pause zwischen den Trainingseinheiten einlegen.',
    }
  },
  {
    id: 'template-2',
    name: 'Oberkörper/Unterkörper Split',
    description: 'Ein 4-Tage Split für Fortgeschrittene, der Übungen für den Oberkörper und Unterkörper getrennt behandelt.',
    difficulty: 'Fortgeschritten',
    duration: '60-75 Minuten',
    frequency: '4x pro Woche',
    goal: 'Muskelaufbau',
    template: {
      name: 'Oberkörper/Unterkörper Split',
      days: [
        {
          id: uuidv4(),
          name: 'Tag 1 - Oberkörper',
          exercises: [
            { 
              id: uuidv4(), 
              name: 'Bankdrücken', 
              sets: 4, 
              reps: 8, 
              weight: 0, 
              repsInReserve: 1, 
              rest: 90,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Klimmzüge', 
              sets: 4, 
              reps: 8, 
              weight: 0, 
              repsInReserve: 1, 
              rest: 90,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Schulterdrücken', 
              sets: 3, 
              reps: 10, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 90,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Bizepscurls', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 60,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Trizepsdrücken', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 60,
              notes: ''
            }
          ]
        },
        {
          id: uuidv4(),
          name: 'Tag 2 - Unterkörper',
          exercises: [
            { 
              id: uuidv4(), 
              name: 'Kniebeugen', 
              sets: 4, 
              reps: 8, 
              weight: 0, 
              repsInReserve: 1, 
              rest: 120,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Kreuzheben', 
              sets: 4, 
              reps: 8, 
              weight: 0, 
              repsInReserve: 1, 
              rest: 120,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Beinpresse', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 90,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Wadenheben', 
              sets: 4, 
              reps: 15, 
              weight: 0, 
              repsInReserve: 2, 
              rest: 60,
              notes: ''
            }
          ]
        }
      ],
      notes: 'Trainiere mit diesem Plan 4x pro Woche, z.B. Mo/Di/Do/Fr mit Ruhetagen am Mi/Sa/So. Wechsle zwischen Oberkörper und Unterkörper ab.',
    }
  },
  {
    id: 'template-3',
    name: 'Fettabbau-Zirkeltraining',
    description: 'Ein intensives Zirkeltraining zur Förderung der Fettverbrennung und der kardiovaskulären Fitness.',
    difficulty: 'Mittel',
    duration: '30-45 Minuten',
    frequency: '3-4x pro Woche',
    goal: 'Fettabbau',
    template: {
      name: 'Fettabbau-Zirkeltraining',
      days: [
        {
          id: uuidv4(),
          name: 'Zirkeltraining',
          exercises: [
            { 
              id: uuidv4(), 
              name: 'Burpees', 
              sets: 3, 
              reps: 15, 
              weight: 0, 
              repsInReserve: 0, 
              rest: 30,
              notes: '30 Sekunden Pause zwischen den Übungen, 2 Minuten Pause zwischen den Runden'
            },
            { 
              id: uuidv4(), 
              name: 'Mountain Climbers', 
              sets: 3, 
              reps: 30, 
              weight: 0, 
              repsInReserve: 0, 
              rest: 30,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Kettlebell Swings', 
              sets: 3, 
              reps: 20, 
              weight: 0, 
              repsInReserve: 0, 
              rest: 30,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Seilspringen', 
              sets: 3, 
              reps: 0, 
              weight: 0, 
              repsInReserve: 0, 
              rest: 60, 
              notes: '60 Sekunden'
            },
            { 
              id: uuidv4(), 
              name: 'Ausfallschritte', 
              sets: 3, 
              reps: 20, 
              weight: 0, 
              repsInReserve: 0, 
              rest: 30,
              notes: '10 pro Bein'
            }
          ]
        }
      ],
      notes: 'Dieses hochintensive Zirkeltraining sollte 3-4x pro Woche durchgeführt werden, mit ausreichenden Ruhetagen dazwischen.',
    }
  }
];

const WorkoutTemplates = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Navigate to create plan with the template
      navigate('/create-plan', { state: { template: selectedTemplate.template } });
    }
  };

  const handleCreateCustomPlan = () => {
    navigate('/create-plan');
  };

  return (
    <Container>
      <Header>
        <Title>Trainingsplan-Vorlagen</Title>
        <Button className="secondary" onClick={handleCreateCustomPlan}>
          Eigenen Plan erstellen
        </Button>
      </Header>

      <TemplateGrid>
        {workoutTemplates.map((template) => (
          <TemplateCard 
            key={template.id}
            selected={selectedTemplate?.id === template.id}
            onClick={() => handleTemplateSelect(template)}
          >
            <TemplateName>{template.name}</TemplateName>
            <TemplateDescription>{template.description}</TemplateDescription>
            <TemplateInfo>
              <div><strong>Schwierigkeit:</strong> {template.difficulty}</div>
              <div><strong>Dauer:</strong> {template.duration}</div>
              <div><strong>Häufigkeit:</strong> {template.frequency}</div>
              <div><strong>Ziel:</strong> {template.goal}</div>
            </TemplateInfo>
            {selectedTemplate?.id === template.id && (
              <ButtonContainer>
                <Button className="primary" onClick={handleUseTemplate}>
                  Diese Vorlage verwenden
                </Button>
              </ButtonContainer>
            )}
          </TemplateCard>
        ))}
      </TemplateGrid>
    </Container>
  );
};

export default WorkoutTemplates; 