import React, { useState, /* useEffect */ } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, Alert } from '../components/ui';
import { useWorkout } from '../context/WorkoutContext';
import { useToast } from '../components/ui/Toast';

const SocialContainer = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const SocialHeader = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}20, 
    ${props => props.theme.colors.secondary}20
  );
  border-radius: ${props => props.theme.borderRadius.large};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xxl};
  margin-bottom: ${props => props.theme.spacing.sm};
  background: linear-gradient(45deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const FeatureCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  border-left: 4px solid ${props => props.theme.colors.secondary};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.cardBackground}, 
    ${props => props.theme.colors.backgroundSecondary}
  );
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.colors.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
  text-align: center;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.6;
`;

const LeaderboardCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
`;

const LeaderboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const LeaderboardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LeaderboardItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
  background: ${props => {
    switch (props.rank) {
      case 1: return `linear-gradient(135deg, #FFD70020, #FFA50020)`;
      case 2: return `linear-gradient(135deg, #C0C0C020, #A8A8A820)`;
      case 3: return `linear-gradient(135deg, #CD7F3220, #B8860B20)`;
      default: return props.theme.colors.backgroundSecondary;
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return 'transparent';
    }
  }};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const UserName = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const Score = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.secondary};
`;

const ChallengeCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  border: 2px solid ${props => props.theme.colors.primary};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}10, 
    ${props => props.theme.colors.secondary}10
  );
`;

const ChallengeTitle = styled.h4`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ChallengeDescription = styled.p`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ChallengeProgress = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.grayLight};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.secondary}
  );
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
  margin-top: ${props => props.theme.spacing.xs};
  display: block;
`;

const ShareCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
`;

const ShareForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const SharePreview = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  border-left: 4px solid ${props => props.theme.colors.secondary};
`;

const SocialFeatures = () => {
  const { workoutHistory } = useWorkout();
  const toast = useToast();
  
  const [shareText, setShareText] = useState('');
  const [challenges] = useState([
    {
      id: 1,
      title: '30-Day Consistency Challenge',
      description: 'Complete at least 20 workouts this month',
      progress: 65,
      current: 13,
      target: 20,
      timeLeft: '12 days',
      participants: 2847
    },
    {
      id: 2,
      title: 'Volume Milestone',
      description: 'Reach 50,000kg total training volume',
      progress: 78,
      current: 39000,
      target: 50000,
      timeLeft: 'Ongoing',
      participants: 1523
    }
  ]);
  
  const [leaderboard] = useState([
    { id: 1, name: 'Alex Johnson', score: 15420, avatar: 'AJ' },
    { id: 2, name: 'Sarah Chen', score: 14850, avatar: 'SC' },
    { id: 3, name: 'Mike Rodriguez', score: 14200, avatar: 'MR' },
    { id: 4, name: 'Emma Wilson', score: 13750, avatar: 'EW' },
    { id: 5, name: 'David Kim', score: 13100, avatar: 'DK' }
  ]);

  const calculateUserStats = () => {
    if (!workoutHistory || workoutHistory.length === 0) {
      return { totalWorkouts: 0, totalVolume: 0, streak: 0 };
    }

    const totalWorkouts = workoutHistory.length;
    const totalVolume = workoutHistory.reduce((sum, workout) => {
      return sum + (workout.sets || []).reduce((setSum, set) => 
        setSum + (set.weight || 0) * (set.reps || 0), 0
      );
    }, 0);

    // Calculate streak (simplified)
    let streak = 0;
    const today = new Date();
    for (let i = workoutHistory.length - 1; i >= 0; i--) {
      const workoutDate = new Date(workoutHistory[i].date);
      const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }

    return { totalWorkouts, totalVolume, streak };
  };

  const handleShareWorkout = (e) => {
    e.preventDefault();
    
    if (!shareText.trim()) {
      toast.error('Please enter a message to share');
      return;
    }

    const stats = calculateUserStats();
    const shareData = {
      message: shareText,
      stats,
      timestamp: new Date().toISOString()
    };

    // Simulate sharing (in real app, this would post to social feed)
    console.log('Sharing workout:', shareData);
    toast.success('Workout shared successfully!');
    setShareText('');
  };

  const joinChallenge = (challengeId) => {
    console.log('Joining challenge:', challengeId);
    toast.success('Challenge joined! Good luck!');
  };

  const userStats = calculateUserStats();

  return (
    <SocialContainer>
      <SocialHeader>
        <Title>🤝 FitTrack Social</Title>
        <Subtitle>Connect, compete, and achieve together</Subtitle>
      </SocialHeader>

      <FeaturesGrid>
        {/* User Stats */}
        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Your Stats</FeatureTitle>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong>{userStats.totalWorkouts}</strong> Total Workouts
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>{Math.round(userStats.totalVolume).toLocaleString()}kg</strong> Total Volume
            </div>
            <div>
              <strong>{userStats.streak}</strong> Day Streak
            </div>
          </div>
        </FeatureCard>

        {/* Community Challenges */}
        <FeatureCard>
                      <FeatureIcon>★</FeatureIcon>
          <FeatureTitle>Active Challenges</FeatureTitle>
          <FeatureDescription>
            Join community challenges and compete with others
          </FeatureDescription>
          {challenges.map(challenge => (
            <ChallengeCard key={challenge.id} style={{ marginBottom: '16px' }}>
              <ChallengeTitle>{challenge.title}</ChallengeTitle>
              <ChallengeDescription>{challenge.description}</ChallengeDescription>
              <ChallengeProgress>
                <ProgressBar>
                  <ProgressFill progress={challenge.progress} />
                </ProgressBar>
                <ProgressText>
                  {challenge.current}/{challenge.target} • {challenge.timeLeft} • {challenge.participants} participants
                </ProgressText>
              </ChallengeProgress>
              <Button onClick={() => joinChallenge(challenge.id)}>
                Join Challenge
              </Button>
            </ChallengeCard>
          ))}
        </FeatureCard>

        {/* Leaderboard */}
        <FeatureCard>
          <FeatureIcon>🥇</FeatureIcon>
          <FeatureTitle>Community Leaderboard</FeatureTitle>
          <FeatureDescription>
            See how you rank against other FitTrack users
          </FeatureDescription>
          <LeaderboardList>
            {leaderboard.map((user, index) => (
              <LeaderboardItem key={user.id} rank={index + 1}>
                <UserInfo>
                  <span style={{ fontWeight: 'bold', minWidth: '20px' }}>#{index + 1}</span>
                  <Avatar>{user.avatar}</Avatar>
                  <UserName>{user.name}</UserName>
                </UserInfo>
                <Score>{user.score.toLocaleString()}</Score>
              </LeaderboardItem>
            ))}
          </LeaderboardList>
        </FeatureCard>

        {/* Workout Sharing */}
        <FeatureCard>
          <FeatureIcon>📢</FeatureIcon>
          <FeatureTitle>Share Your Progress</FeatureTitle>
          <FeatureDescription>
            Share your workouts and motivate the community
          </FeatureDescription>
          <ShareForm onSubmit={handleShareWorkout}>
            <Input
              placeholder="Share your workout experience..."
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              multiline
              rows={3}
            />
            {shareText && (
              <SharePreview>
                <strong>Preview:</strong>
                <p style={{ margin: '8px 0', color: '#666' }}>{shareText}</p>
                <small style={{ color: '#888' }}>
                  ◆ {userStats.totalWorkouts} workouts • 
                  ▲ {Math.round(userStats.totalVolume).toLocaleString()}kg volume • 
                  ⬆ {userStats.streak} day streak
                </small>
              </SharePreview>
            )}
            <Button type="submit">Share Workout</Button>
          </ShareForm>
        </FeatureCard>

        {/* Friends & Following */}
        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>Friends & Following</FeatureTitle>
          <FeatureDescription>
            Connect with friends and follow inspiring athletes
          </FeatureDescription>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>12</strong> Friends • <strong>34</strong> Following
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Find friends by email or username
            </div>
          </div>
          <Button variant="secondary" style={{ width: '100%' }}>
            Find Friends
          </Button>
        </FeatureCard>

        {/* Workout Feed */}
        <FeatureCard>
          <FeatureIcon>📱</FeatureIcon>
          <FeatureTitle>Community Feed</FeatureTitle>
          <FeatureDescription>
            See what your friends and the community are up to
          </FeatureDescription>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '8px' }}>
              <strong>Sarah Chen</strong> completed a Push Day workout
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                2 hours ago • ◆ Great session today!
              </div>
            </div>
            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
              <strong>Mike Rodriguez</strong> joined the 30-Day Challenge
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                4 hours ago • Ready to crush this challenge! ⬆
              </div>
            </div>
          </div>
          <Button variant="secondary" style={{ width: '100%' }}>
            View Full Feed
          </Button>
        </FeatureCard>
      </FeaturesGrid>

      {/* Coming Soon Features */}
      <Card style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(80, 200, 120, 0.1))' }}>
        <h3 style={{ marginBottom: '16px', color: '#4A90E2' }}>🚀 Coming Soon</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <strong>Workout Battles</strong>
            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
              Challenge friends to head-to-head workouts
            </p>
          </div>
          <div>
            <strong>Team Challenges</strong>
            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
              Create teams and compete together
            </p>
          </div>
          <div>
            <strong>Achievement Badges</strong>
            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
              Unlock badges for milestones and achievements
            </p>
          </div>
          <div>
            <strong>Live Workouts</strong>
            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
              Join live workout sessions with the community
            </p>
          </div>
        </div>
        <Alert type="info">
          These features are in development and will be available in future updates!
        </Alert>
      </Card>
    </SocialContainer>
  );
};

export default SocialFeatures; 