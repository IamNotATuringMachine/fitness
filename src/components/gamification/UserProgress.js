import React from 'react';
import styled from 'styled-components';
import { useGamification } from '../../context/GamificationContext';

const ProgressContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  margin: 0 0 5px 0;
  color: ${props => props.theme.colors.text};
`;

const UserLevel = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  font-size: 1.1rem;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  background-color: ${props => props.theme.colors.background2};
  padding: 15px;
  border-radius: 8px;
  flex: 1;
  min-width: 120px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const LevelProgressContainer = styled.div`
  margin-top: 20px;
`;

const LevelProgressBar = styled.div`
  height: 15px;
  background-color: ${props => props.theme.colors.background2};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 5px;
`;

const LevelProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => props.theme.colors.primary};
  transition: width 0.3s ease;
`;

const LevelProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

function UserProgress() {
  const { state } = useGamification();
  
  // Calculate level progress percentage
  const calculateLevelProgress = () => {
    const { userPoints, userLevel, levelThresholds } = state;
    const currentLevelPoints = levelThresholds[userLevel - 1] || 0;
    const nextLevelPoints = levelThresholds[userLevel] || (currentLevelPoints + 100);
    const pointsInCurrentLevel = userPoints - currentLevelPoints;
    const pointsRequiredForNextLevel = nextLevelPoints - currentLevelPoints;
    
    return Math.min(100, (pointsInCurrentLevel / pointsRequiredForNextLevel) * 100);
  };
  
  const levelProgressPercentage = calculateLevelProgress();
  
  // Calculate current level points range
  const getCurrentLevelPoints = () => {
    const { userLevel, levelThresholds } = state;
    const currentLevelPoints = levelThresholds[userLevel - 1] || 0;
    const nextLevelPoints = levelThresholds[userLevel] || (currentLevelPoints + 100);
    
    return {
      current: currentLevelPoints,
      next: nextLevelPoints
    };
  };
  
  const levelPoints = getCurrentLevelPoints();
  
  // Count completed badges
  const completedBadges = state.badges.filter(badge => badge.unlocked).length;
  
  // Count completed challenges
  const completedChallenges = state.challenges.filter(challenge => challenge.completed).length;
  
  return (
    <ProgressContainer>
      <ProfileHeader>
        <ProfileAvatar>
          {state.userLevel}
        </ProfileAvatar>
        <ProfileInfo>
          <UserName>Fitness-Enthusiast</UserName>
          <UserLevel>Level {state.userLevel} Fitness-Hero</UserLevel>
          <div>Gesamtpunkte: {state.userPoints}</div>
        </ProfileInfo>
      </ProfileHeader>
      
      <StatsContainer>
        <StatItem>
          <StatValue>{state.userPoints}</StatValue>
          <StatLabel>Gesamtpunkte</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{completedBadges}</StatValue>
          <StatLabel>Abzeichen</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{completedChallenges}</StatValue>
          <StatLabel>Herausforderungen</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{state.streaks.longestWorkoutStreak}</StatValue>
          <StatLabel>Längste Serie</StatLabel>
        </StatItem>
      </StatsContainer>
      
      <LevelProgressContainer>
        <div>Fortschritt zu Level {state.userLevel + 1}</div>
        <LevelProgressBar>
          <LevelProgressFill percentage={levelProgressPercentage} />
        </LevelProgressBar>
        <LevelProgressText>
          <span>Level {state.userLevel}</span>
          <span>{Math.round(levelProgressPercentage)}%</span>
          <span>Level {state.userLevel + 1}</span>
        </LevelProgressText>
        <LevelProgressText>
          <span>{state.userPoints - levelPoints.current} / {levelPoints.next - levelPoints.current} Punkte</span>
        </LevelProgressText>
      </LevelProgressContainer>
    </ProgressContainer>
  );
}

export default UserProgress; 