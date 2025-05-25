import React from 'react';
import styled from 'styled-components';
import { useGamification } from '../../context/GamificationContext';

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
`;

const Badge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: ${props => props.unlocked 
    ? props.theme.colors.cardBackground 
    : props.theme.colors.background2};
  border-radius: 8px;
  border: 2px solid ${props => props.unlocked 
    ? props.theme.colors.primary 
    : props.theme.colors.border};
  width: 120px;
  height: 150px;
  transition: transform 0.2s, box-shadow 0.2s;
  opacity: ${props => props.unlocked ? 1 : 0.5};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const BadgeIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const BadgeName = styled.div`
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

const BadgeDescription = styled.div`
  font-size: 0.8rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const BadgePoints = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 8px;
  color: ${props => props.unlocked 
    ? props.theme.colors.success 
    : props.theme.colors.textSecondary};
`;

const Badge404 = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

function BadgeDisplay({ filterUnlocked = false }) {
  const { state } = useGamification();
  
  const filteredBadges = filterUnlocked 
    ? state.badges.filter(badge => badge.unlocked)
    : state.badges;
  
  if (filteredBadges.length === 0) {
    return (
      <Badge404>
        {filterUnlocked 
          ? 'Du hast noch keine Abzeichen freigeschaltet. Mach weiter und verdiene dir welche!'
          : 'Keine Abzeichen gefunden.'}
      </Badge404>
    );
  }
  
  return (
    <div>
      <BadgesContainer>
        {filteredBadges.map(badge => (
          <Badge key={badge.id} unlocked={badge.unlocked}>
            <BadgeIcon>{badge.icon}</BadgeIcon>
            <BadgeName>{badge.name}</BadgeName>
            <BadgeDescription>{badge.description}</BadgeDescription>
            <BadgePoints unlocked={badge.unlocked}>{badge.points} Punkte</BadgePoints>
          </Badge>
        ))}
      </BadgesContainer>
    </div>
  );
}

export default BadgeDisplay; 