import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWorkout } from '../context/WorkoutContext';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PlanCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PlanDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const DetailLabel = styled.span`
  font-weight: bold;
  width: 120px;
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
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

const NoPlansMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const WorkoutPlans = () => {
  const { state, dispatch } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleDeletePlan = (id) => {
    if (window.confirm('Möchtest du diesen Trainingsplan wirklich löschen?')) {
      dispatch({
        type: 'DELETE_WORKOUT_PLAN',
        payload: id
      });
    }
  };
  
  const filteredPlans = state.workoutPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div>
      <PageHeader>
        <h1>Deine Trainingspläne</h1>
        <Button as={Link} to="/create-plan">
          Neuen Plan erstellen
        </Button>
      </PageHeader>
      
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Suche nach Trainingsplänen..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      {filteredPlans.length > 0 ? (
        <PlansGrid>
          {filteredPlans.map(plan => (
            <PlanCard key={plan.id}>
              <Card.Header>{plan.name}</Card.Header>
              <Card.Body>
                <p>{plan.description || 'Keine Beschreibung.'}</p>
                <PlanDetails>
                  <DetailItem>
                    <DetailLabel>Trainingstage:</DetailLabel> 
                    <span>{plan.days ? plan.days.length : 0}</span>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Erstellt am:</DetailLabel> 
                    <span>
                      {plan.createdAt 
                        ? new Date(plan.createdAt).toLocaleDateString('de-DE') 
                        : 'Unbekannt'}
                    </span>
                  </DetailItem>
                </PlanDetails>
              </Card.Body>
              <Card.Footer>
                <ActionsContainer>
                  <Button 
                    as={Link} 
                    to={`/edit-plan/${plan.id}`} 
                    variant="primary"
                  >
                    Bearbeiten
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    Löschen
                  </Button>
                </ActionsContainer>
              </Card.Footer>
            </PlanCard>
          ))}
        </PlansGrid>
      ) : (
        <NoPlansMessage>
          <h3>Keine Trainingspläne gefunden</h3>
          {searchTerm ? (
            <p>Es wurden keine Pläne mit dem Suchbegriff "{searchTerm}" gefunden.</p>
          ) : (
            <>
              <p>Du hast noch keine Trainingspläne erstellt.</p>
              <Button as={Link} to="/create-plan">Ersten Plan erstellen</Button>
            </>
          )}
        </NoPlansMessage>
      )}
    </div>
  );
};

export default WorkoutPlans; 