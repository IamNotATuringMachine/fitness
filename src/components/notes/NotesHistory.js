import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useWorkout } from '../../context/WorkoutContext';
import Button from '../ui/Button';

const Container = styled.div`
  margin-top: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const NotesList = styled.div`
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const NoteItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
`;

const NoteDate = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const NoteContent = styled.div`
  white-space: pre-wrap;
`;

const NotesHistory = ({ 
  entityType, // 'plan', 'day', or 'exercise'
  planId,
  dayId,
  exerciseId,
  currentNote,
  onNoteSave
}) => {
  const { state, dispatch } = useWorkout();
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Initialize with current note
    setNewNote(currentNote || '');
    
    // Get notes history for this entity
    const historyNotes = state.notesHistory.filter(note => {
      if (entityType === 'plan') {
        return note.planId === planId && !note.dayId && !note.exerciseId;
      } else if (entityType === 'day') {
        return note.planId === planId && note.dayId === dayId && !note.exerciseId;
      } else if (entityType === 'exercise') {
        return note.planId === planId && note.dayId === dayId && note.exerciseId === exerciseId;
      }
      return false;
    });
    
    setNotes(historyNotes);
  }, [state.notesHistory, planId, dayId, exerciseId, entityType, currentNote]);

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    
    // Create a new note history record
    const noteRecord = {
      id: uuidv4(),
      date: new Date().toISOString(),
      content: newNote,
      planId,
      dayId: entityType === 'day' || entityType === 'exercise' ? dayId : null,
      exerciseId: entityType === 'exercise' ? exerciseId : null
    };
    
    // Add to history
    dispatch({
      type: 'ADD_NOTE',
      payload: noteRecord,
    });
    
    // Update the current note on the entity
    if (entityType === 'plan') {
      dispatch({
        type: 'UPDATE_PLAN_NOTES',
        payload: {
          planId,
          notes: newNote
        }
      });
    } else if (entityType === 'day') {
      dispatch({
        type: 'UPDATE_DAY_NOTES',
        payload: {
          planId,
          dayId,
          notes: newNote
        }
      });
    } else if (entityType === 'exercise') {
      dispatch({
        type: 'UPDATE_EXERCISE_NOTES',
        payload: {
          planId,
          dayId,
          exerciseId,
          notes: newNote
        }
      });
    }
    
    // Notify parent component
    if (onNoteSave) {
      onNoteSave(newNote);
    }
  };

  return (
    <Container>
      <h4>Notizen</h4>
      <Textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Füge hier deine Notizen hinzu..."
      />
      <Button onClick={handleSaveNote}>Notiz speichern</Button>
      
      {notes.length > 0 && (
        <>
          <h5>Notizenverlauf</h5>
          <NotesList>
            {notes.map(note => (
              <NoteItem key={note.id}>
                <NoteDate>{format(new Date(note.date), 'dd.MM.yyyy HH:mm')}</NoteDate>
                <NoteContent>{note.content}</NoteContent>
              </NoteItem>
            ))}
          </NotesList>
        </>
      )}
    </Container>
  );
};

export default NotesHistory; 