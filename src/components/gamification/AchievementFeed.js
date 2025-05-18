import React from 'react';
import styled from 'styled-components';
import { useGamification } from '../../context/GamificationContext';
import { format } from 'date-fns';

const FeedContainer = styled.div`
  margin-top: 20px;
`;

const FeedItem = styled.div`
  padding: 15px;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const FeedIcon = styled.div`
  font-size: 1.8rem;
  background-color: ${props => {
    switch(props.type) {
      case 'badge': return props.theme.colors.primary;
      case 'challenge': return props.theme.colors.success;
      case 'points': return props.theme.colors.info;
      default: return props.theme.colors.primary;
    }
  }};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FeedContent = styled.div`
  flex: 1;
`;

const FeedTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const FeedDescription = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 5px;
`;

const FeedTime = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
`;

const FeedPoints = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.success};
`;

const EmptyFeed = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

function AchievementFeed({ limit = 10 }) {
  const { state } = useGamification();
  
  // Sort achievements by timestamp, most recent first
  const sortedAchievements = [...state.achievements]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
  
  if (sortedAchievements.length === 0) {
    return (
      <EmptyFeed>
        Noch keine Aktivitäten. Starte Deine Trainings- und Ernährungsreise, um Punkte und Erfolge zu sammeln!
      </EmptyFeed>
    );
  }
  
  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'dd.MM.yyyy HH:mm');
    } catch {
      return 'Unbekanntes Datum';
    }
  };
  
  return (
    <FeedContainer>
      {sortedAchievements.map(achievement => (
        <FeedItem key={achievement.id}>
          <FeedIcon type={achievement.type}>
            {achievement.icon || (achievement.type === 'badge' ? '🏅' : achievement.type === 'challenge' ? '🎯' : '⭐')}
          </FeedIcon>
          <FeedContent>
            <FeedTitle>{achievement.name}</FeedTitle>
            <FeedDescription>{achievement.description}</FeedDescription>
            <FeedTime>{formatDate(achievement.timestamp)}</FeedTime>
          </FeedContent>
          <FeedPoints>+{achievement.points} P</FeedPoints>
        </FeedItem>
      ))}
    </FeedContainer>
  );
}

export default AchievementFeed; 