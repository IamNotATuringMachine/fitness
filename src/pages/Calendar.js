import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';
import { v4 as uuidv4 } from 'uuid';

// Global styles to override react-calendar defaults for dark mode
const CalendarGlobalStyles = createGlobalStyle`
  .react-calendar {
    background: ${props => props.theme.colors.cardBackground} !important;
    color: ${props => props.theme.colors.text} !important;
    border: 1px solid ${props => props.theme.colors.border} !important;
  }
  
  .react-calendar__navigation button {
    color: ${props => props.theme.colors.text} !important;
    background: transparent !important;
    
    &:hover {
      background-color: ${props => props.theme.colors.backgroundSecondary} !important;
    }
    
    &:disabled {
      background-color: transparent !important;
      color: ${props => props.theme.colors.textLight} !important;
    }
  }
  
  .react-calendar__month-view__weekdays__weekday {
    color: ${props => props.theme.colors.textLight} !important;
  }
  
  .react-calendar__tile {
    background: ${props => props.theme.colors.cardBackground} !important;
    color: ${props => props.theme.colors.text} !important;
    
    &:hover {
      background-color: ${props => props.theme.colors.backgroundSecondary} !important;
    }
  }
  
  .react-calendar__tile--active {
    background: ${props => props.theme.colors.primary} !important;
    color: ${props => props.theme.colors.white} !important;
    
    &:hover {
      background: ${props => props.theme.colors.primaryDark} !important;
    }
  }
  
  .react-calendar__tile--now {
    background: ${props => props.theme.colors.primary}20 !important;
    color: ${props => props.theme.colors.primary} !important;
  }
  
  .react-calendar__tile--neighboringMonth {
    color: ${props => props.theme.colors.textLight} !important;
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

const CalendarWrapper = styled.div`
  flex: 1;
  
  .react-calendar {
    width: 100%;
    border: none;
    border-radius: ${props => props.theme.borderRadius.medium};
    box-shadow: ${props => props.theme.shadows.medium};
    padding: 1rem;
    background-color: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
  }
  
  .react-calendar__navigation {
    background-color: ${props => props.theme.colors.cardBackground};
    
    button {
      background-color: transparent;
      color: ${props => props.theme.colors.text};
      border: none;
      font-size: 1rem;
      padding: 0.5rem;
      
      &:hover {
        background-color: ${props => props.theme.colors.backgroundSecondary};
      }
      
      &:disabled {
        color: ${props => props.theme.colors.textLight};
      }
    }
  }
  
  .react-calendar__month-view__weekdays {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    
    .react-calendar__month-view__weekdays__weekday {
      color: ${props => props.theme.colors.textLight};
      font-weight: 500;
      padding: 0.5rem;
      text-align: center;
    }
  }
  
  .react-calendar__tile {
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};
    
    &:hover {
      background-color: ${props => props.theme.colors.backgroundSecondary};
    }
  }
  
  .react-calendar__tile--now {
    background-color: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
  }
  
  .react-calendar__tile--active {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    
    &:hover {
      background-color: ${props => props.theme.colors.primaryDark};
    }
  }
  
  .react-calendar__tile--neighboringMonth {
    color: ${props => props.theme.colors.textLight};
  }
  
  .has-workout::after {
    content: "";
    position: absolute;
    bottom: 5px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.accent};
  }
`;

const EventsPanel = styled.div`
  flex: 1;
  max-width: 100%;
  
  @media (min-width: 992px) {
    max-width: 400px;
  }
`;

const EventForm = styled.form`
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => props.theme.colors.focusLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${props => props.theme.colors.focusLight};
  }
  
  option {
    background-color: ${props => props.theme.colors.inputBackground};
    color: ${props => props.theme.colors.text};
  }
`;

const EventsList = styled.div`
  margin-top: 1.5rem;
`;

const EventItem = styled.div`
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 0.5rem;
  background-color: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const EventTime = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const EventTitle = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Calendar = () => {
  const { state, dispatch } = useWorkout();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    planId: '',
    time: '08:00',
    notes: ''
  });
  
  // Handle date click
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  };
  
  // Add new event
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!eventForm.title.trim()) {
      alert('Bitte gib einen Titel für das Training ein.');
      return;
    }
    
    const eventDate = new Date(selectedDate);
    const [hours, minutes] = eventForm.time.split(':').map(Number);
    eventDate.setHours(hours, minutes, 0, 0);
    
    const event = {
      id: uuidv4(),
      title: eventForm.title.trim(),
      planId: eventForm.planId || null,
      date: eventDate.toISOString(),
      notes: eventForm.notes.trim(),
      completed: false,
    };
    
    dispatch({
      type: 'ADD_CALENDAR_EVENT',
      payload: event
    });
    
    // Reset form
    setEventForm({
      title: '',
      planId: '',
      time: '08:00',
      notes: ''
    });
    
    setShowAddForm(false);
  };
  
  // Delete event
  const handleDeleteEvent = (id) => {
    if (window.confirm('Möchtest du dieses Training wirklich löschen?')) {
      dispatch({
        type: 'DELETE_CALENDAR_EVENT',
        payload: id
      });
    }
  };
  
  // Toggle event completion status
  const toggleEventCompletion = (event) => {
    dispatch({
      type: 'UPDATE_CALENDAR_EVENT',
      payload: {
        ...event,
        completed: !event.completed
      }
    });
  };
  
  // Filter events for selected date
  const eventsForSelectedDate = state.calendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Check if a date has events
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const hasEvents = state.calendarEvents.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
    
    return hasEvents ? <div className="has-workout"></div> : null;
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div>
      <CalendarGlobalStyles />
      <h1>Trainingskalender</h1>
      <p>Plane und verfolge deine Trainingseinheiten in diesem Kalender.</p>
      
      <PageContainer>
        <CalendarWrapper>
          <ReactCalendar 
            onChange={handleDateChange} 
            value={selectedDate}
            locale="de-DE"
            tileContent={tileContent}
          />
        </CalendarWrapper>
        
        <EventsPanel>
          <Card>
            <Card.Header>
              {formatDate(selectedDate)}
            </Card.Header>
            <Card.Body>
              {!showAddForm ? (
                <Button onClick={() => setShowAddForm(true)} fullWidth>
                  Training hinzufügen
                </Button>
              ) : (
                <EventForm onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label htmlFor="title">Trainingstitel</Label>
                    <Input 
                      type="text" 
                      id="title" 
                      name="title" 
                      value={eventForm.title}
                      onChange={handleInputChange}
                      placeholder="z.B. Oberkörpertraining"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="planId">Trainingsplan (optional)</Label>
                    <Select 
                      id="planId" 
                      name="planId" 
                      value={eventForm.planId}
                      onChange={handleInputChange}
                    >
                      <option value="">Keinen Plan auswählen</option>
                      {state.workoutPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="time">Uhrzeit</Label>
                    <Input 
                      type="time" 
                      id="time" 
                      name="time" 
                      value={eventForm.time}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="notes">Notizen (optional)</Label>
                    <Input 
                      as="textarea" 
                      id="notes" 
                      name="notes" 
                      value={eventForm.notes}
                      onChange={handleInputChange}
                      placeholder="Zusätzliche Notizen zum Training"
                      style={{ minHeight: '80px' }}
                    />
                  </FormGroup>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button type="submit">Speichern</Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setShowAddForm(false)}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </EventForm>
              )}
              
              <EventsList>
                <h3>Trainingseinheiten ({eventsForSelectedDate.length})</h3>
                {eventsForSelectedDate.length > 0 ? (
                  eventsForSelectedDate.map(event => {
                    const eventTime = new Date(event.date);
                    const formattedTime = eventTime.toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    const planName = event.planId 
                      ? state.workoutPlans.find(plan => plan.id === event.planId)?.name 
                      : null;
                    
                    return (
                      <EventItem key={event.id}>
                        <EventTime>{formattedTime} Uhr</EventTime>
                        <EventTitle>{event.title}</EventTitle>
                        {planName && <div>Plan: {planName}</div>}
                        {event.notes && <div>Notizen: {event.notes}</div>}
                        <ActionButtons>
                          <Button 
                            size="small" 
                            variant={event.completed ? "success" : "primary"}
                            onClick={() => toggleEventCompletion(event)}
                          >
                            {event.completed ? "Erledigt ✓" : "Als erledigt markieren"}
                          </Button>
                          <Button 
                            size="small" 
                            variant="danger"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            Löschen
                          </Button>
                        </ActionButtons>
                      </EventItem>
                    );
                  })
                ) : (
                  <p>Keine Trainingseinheiten für diesen Tag geplant.</p>
                )}
              </EventsList>
            </Card.Body>
          </Card>
        </EventsPanel>
      </PageContainer>
    </div>
  );
};

export default Calendar; 