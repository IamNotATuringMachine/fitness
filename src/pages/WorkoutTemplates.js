import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const TemplateCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const TemplateName = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
`;

const TemplateDescription = styled.p`
  color: #666;
  margin-bottom: 15px;
`;

const TemplateInfo = styled.div`
  margin-bottom: 15px;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  
  &.primary {
    background-color: #4caf50;
    color: white;
    
    &:hover {
      background-color: #3d8b40;
    }
  }
  
  &.secondary {
    background-color: #f5f5f5;
    color: #333;
    
    &:hover {
      background-color: #e0e0e0;
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
              duration: 0, 
              rest: 60,
              notes: 'Achte auf eine gerade Rückenposition und dass die Knie nicht über die Zehenspitzen hinausragen.'
            },
            { 
              id: uuidv4(), 
              name: 'Bankdrücken', 
              sets: 3, 
              reps: 10, 
              weight: 0, 
              duration: 0, 
              rest: 60,
              notes: 'Bei Anfängern kann auch mit Kurzhanteln gearbeitet werden.'
            },
            { 
              id: uuidv4(), 
              name: 'Klimmzüge', 
              sets: 3, 
              reps: 8, 
              weight: 0, 
              duration: 0, 
              rest: 60,
              notes: 'Bei Bedarf Hilfestellung nutzen oder mit Negativen Klimmzügen starten.'
            },
            { 
              id: uuidv4(), 
              name: 'Schulterdrücken', 
              sets: 3, 
              reps: 10, 
              weight: 0, 
              duration: 0, 
              rest: 60,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Beinstrecken', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              duration: 0, 
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
              duration: 0, 
              rest: 90,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Klimmzüge', 
              sets: 4, 
              reps: 8, 
              weight: 0, 
              duration: 0, 
              rest: 90,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Schulterdrücken', 
              sets: 3, 
              reps: 10, 
              weight: 0, 
              duration: 0, 
              rest: 90,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Bizepscurls', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              duration: 0, 
              rest: 60,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Trizepsdrücken', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              duration: 0, 
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
              duration: 0, 
              rest: 120,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Kreuzheben', 
              sets: 4, 
              reps: 8, 
              weight: 0, 
              duration: 0, 
              rest: 120,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Beinpresse', 
              sets: 3, 
              reps: 12, 
              weight: 0, 
              duration: 0, 
              rest: 90,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Wadenheben', 
              sets: 4, 
              reps: 15, 
              weight: 0, 
              duration: 0, 
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
              duration: 0, 
              rest: 30,
              notes: '30 Sekunden Pause zwischen den Übungen, 2 Minuten Pause zwischen den Runden'
            },
            { 
              id: uuidv4(), 
              name: 'Mountain Climbers', 
              sets: 3, 
              reps: 30, 
              weight: 0, 
              duration: 0, 
              rest: 30,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Kettlebell Swings', 
              sets: 3, 
              reps: 20, 
              weight: 0, 
              duration: 0, 
              rest: 30,
              notes: ''
            },
            { 
              id: uuidv4(), 
              name: 'Seilspringen', 
              sets: 3, 
              reps: 0, 
              weight: 0, 
              duration: 60, 
              rest: 30,
              notes: '60 Sekunden'
            },
            { 
              id: uuidv4(), 
              name: 'Ausfallschritte', 
              sets: 3, 
              reps: 20, 
              weight: 0, 
              duration: 0, 
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
            onClick={() => handleTemplateSelect(template)}
            style={selectedTemplate?.id === template.id ? {
              border: '2px solid #4caf50',
              transform: 'translateY(-5px)'
            } : {}}
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