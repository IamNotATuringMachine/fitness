import React from 'react';
import styled from 'styled-components';
import { useGamification } from '../../context/GamificationContext';

const ChallengesContainer = styled.div`
  margin-top: 20px;
`;

const Challenge = styled.div`
  padding: 15px;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  border-left: 5px solid ${props => props.completed 
    ? props.theme.colors.success 
    : props.active 
      ? props.theme.colors.primary 
      : props.theme.colors.border};
  margin-bottom: 15px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const ChallengeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ChallengeName = styled.h4`
  margin: 0;
  color: ${props => props.completed 
    ? props.theme.colors.success 
    : props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChallengeIcon = styled.span`
  font-size: 1.5rem;
`;

const ChallengeReward = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  background-color: ${props => props.theme.colors.background2};
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
`;

const ChallengeDescription = styled.div`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const ProgressContainer = styled.div`
  margin-top: 10px;
`;

const ProgressBar = styled.div`
  height: 10px;
  background-color: ${props => props.theme.colors.background2};
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 5px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => Math.min(100, (props.progress / props.target) * 100)}%;
  background-color: ${props => props.completed 
    ? props.theme.colors.success 
    : props.theme.colors.primary};
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ActivateButton = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 10px;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.background2};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const NoChallenge = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

function ChallengeList({ filterActive, filterCompleted }) {
  const { state, activateChallenge } = useGamification();
  
  let filteredChallenges = state.challenges;
  
  if (filterActive) {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.active && !challenge.completed);
  }
  
  if (filterCompleted) {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.completed);
  }
  
  if (filteredChallenges.length === 0) {
    return (
      <NoChallenge>
        {filterActive 
          ? 'Keine aktiven Herausforderungen. Aktiviere neue Herausforderungen, um Punkte zu sammeln!'
          : filterCompleted 
            ? 'Du hast noch keine Herausforderungen abgeschlossen.'
            : 'Keine Herausforderungen gefunden.'}
      </NoChallenge>
    );
  }
  
  const handleActivate = (challengeId) => {
    activateChallenge(challengeId);
  };
  
  return (
    <ChallengesContainer>
      {filteredChallenges.map(challenge => (
        <Challenge 
          key={challenge.id} 
          active={challenge.active} 
          completed={challenge.completed}
        >
          <ChallengeHeader>
            <ChallengeName completed={challenge.completed}>
              <ChallengeIcon>{challenge.icon}</ChallengeIcon>
              {challenge.name}
            </ChallengeName>
            <ChallengeReward>
              {challenge.reward} Punkte
            </ChallengeReward>
          </ChallengeHeader>
          
          <ChallengeDescription>
            {challenge.description}
          </ChallengeDescription>
          
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill 
                progress={challenge.progress} 
                target={challenge.target}
                completed={challenge.completed}
              />
            </ProgressBar>
            <ProgressText>
              <span>Fortschritt: {challenge.progress}/{challenge.target}</span>
              <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
            </ProgressText>
          </ProgressContainer>
          
          {!challenge.active && !challenge.completed && (
            <ActivateButton onClick={() => handleActivate(challenge.id)}>
              Herausforderung annehmen
            </ActivateButton>
          )}
        </Challenge>
      ))}
    </ChallengesContainer>
  );
}

export default ChallengeList; 