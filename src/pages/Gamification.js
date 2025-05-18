import React, { useState } from 'react';
import styled from 'styled-components';
import { GamificationProvider } from '../context/GamificationContext';
import BadgeDisplay from '../components/gamification/BadgeDisplay';
import ChallengeList from '../components/gamification/ChallengeList';
import AchievementFeed from '../components/gamification/AchievementFeed';
import UserProgress from '../components/gamification/UserProgress';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 30px;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-right: 5px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.hover};
  }
`;

const ContentSection = styled.div`
  margin-bottom: 30px;
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 20px;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

function Gamification() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <ContentSection>
              <h2>Dein Fortschritt</h2>
              <InfoText>
                Verfolge deinen Fortschritt, sammle Punkte und steige in Level auf, während du deine Fitness- und Ernährungsziele erreichst.
              </InfoText>
              <UserProgress />
            </ContentSection>
            
            <TwoColumnLayout>
              <ContentSection>
                <h2>Aktuelle Herausforderungen</h2>
                <InfoText>
                  Nimm an Herausforderungen teil, um zusätzliche Punkte zu sammeln und deine Fitness-Reise zu beschleunigen.
                </InfoText>
                <ChallengeList filterActive={true} />
              </ContentSection>
              
              <ContentSection>
                <h2>Letzte Aktivitäten</h2>
                <InfoText>
                  Deine letzten Erfolge und Aktivitäten auf einen Blick.
                </InfoText>
                <AchievementFeed limit={5} />
              </ContentSection>
            </TwoColumnLayout>
          </>
        );
      
      case 'badges':
        return (
          <ContentSection>
            <h2>Deine Abzeichen</h2>
            <InfoText>
              Sammle Abzeichen, indem du verschiedene Aktivitäten und Ziele in der App abschließt. 
              Jedes Abzeichen schaltet Punkte frei, die dir helfen, in Level aufzusteigen.
            </InfoText>
            <h3>Freigeschaltete Abzeichen</h3>
            <BadgeDisplay filterUnlocked={true} />
            <h3>Verfügbare Abzeichen</h3>
            <BadgeDisplay />
          </ContentSection>
        );
      
      case 'challenges':
        return (
          <ContentSection>
            <h2>Herausforderungen</h2>
            <InfoText>
              Nimm an Herausforderungen teil, um zusätzliche Punkte zu verdienen und deine Motivation zu steigern. 
              Aktiviere Herausforderungen, die zu deinen Zielen passen, und verfolge deinen Fortschritt.
            </InfoText>
            <h3>Aktive Herausforderungen</h3>
            <ChallengeList filterActive={true} />
            <h3>Verfügbare Herausforderungen</h3>
            <ChallengeList />
            <h3>Abgeschlossene Herausforderungen</h3>
            <ChallengeList filterCompleted={true} />
          </ContentSection>
        );
      
      case 'history':
        return (
          <ContentSection>
            <h2>Erfolgshistorie</h2>
            <InfoText>
              Eine chronologische Übersicht aller deiner Erfolge, verdienten Punkte und Aktivitäten.
            </InfoText>
            <AchievementFeed limit={30} />
          </ContentSection>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <GamificationProvider>
      <PageContainer>
        <PageTitle>Erfolge & Belohnungen</PageTitle>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Übersicht
          </Tab>
          <Tab 
            active={activeTab === 'badges'} 
            onClick={() => setActiveTab('badges')}
          >
            Abzeichen
          </Tab>
          <Tab 
            active={activeTab === 'challenges'} 
            onClick={() => setActiveTab('challenges')}
          >
            Herausforderungen
          </Tab>
          <Tab 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            Aktivitätshistorie
          </Tab>
        </TabsContainer>
        
        {renderContent()}
      </PageContainer>
    </GamificationProvider>
  );
}

export default Gamification; 