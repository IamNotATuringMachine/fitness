import styled from 'styled-components';
import Card from '../ui/Card';
import Button from '../ui/Button';

export const TrackerContainer = styled(Card)`
  margin-bottom: 2rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const ExerciseList = styled.div`
  margin-top: 1.5rem;
`;

export const ExerciseItem = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
`;

export const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ExerciseName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CompleteBadge = styled.span`
  background-color: #28a745;
  color: white;
  font-size: 0.7rem;
  font-weight: normal;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

export const SetsContainer = styled.div`
  margin-bottom: 1rem;
`;

export const SetRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SetLabel = styled.div`
  width: 80px;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 0.5rem;
  }
`;

export const SetDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PlannedSetDetails = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

export const ActualSetInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  span {
    color: #6c757d;
  }
  
  input {
    width: 80px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 576px) {
    input {
      width: 60px;
    }
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  label {
    font-size: 0.75rem;
    color: #6c757d;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  margin-left: auto;
  
  &:disabled {
    color: #adb5bd;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    color: #bd2130;
  }
`;

export const AddSetButton = styled(Button)`
  margin-top: 0.5rem;
  width: 100%;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

export const ErrorText = styled.div`
  color: #dc3545;
  padding: 0.75rem;
  background-color: #f8d7da;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const SuccessText = styled.div`
  color: #fff;
  background-color: #28a745;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const NotesTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const Sets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SetHeader = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(3, 1fr);
  font-weight: 500;
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const SetActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SetNotesInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;

export const Notes = styled.div`
  margin-top: 1rem;
`; 