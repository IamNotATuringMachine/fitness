import React, { useState } from 'react';
import styled from 'styled-components';
import { NutritionProvider } from '../context/NutritionContext';
import FoodItemList from '../components/nutrition/FoodItemList';
import NutritionPlanCreator from '../components/nutrition/NutritionPlanCreator';
import NutritionPlanList from '../components/nutrition/NutritionPlanList';
import NutritionTracker from '../components/nutrition/NutritionTracker';
import NutritionGoals from '../components/nutrition/NutritionGoals';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 30px;
`;

function Nutrition() {
  const [activeTab, setActiveTab] = useState('tracker');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'tracker':
        return <NutritionTracker />;
      case 'goals':
        return <NutritionGoals />;
      case 'create-plan':
        return <NutritionPlanCreator />;
      case 'plans':
        return <NutritionPlanList />;
      case 'food-items':
        return <FoodItemList />;
      default:
        return <NutritionTracker />;
    }
  };
  
  return (
    <NutritionProvider>
      <PageContainer>
        <PageTitle>Ernährungsmanagement</PageTitle>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'tracker'} 
            onClick={() => setActiveTab('tracker')}
          >
            Täglicher Tracker
          </Tab>
          <Tab 
            active={activeTab === 'goals'} 
            onClick={() => setActiveTab('goals')}
          >
            Ernährungsziele
          </Tab>
          <Tab 
            active={activeTab === 'create-plan'} 
            onClick={() => setActiveTab('create-plan')}
          >
            Plan erstellen
          </Tab>
          <Tab 
            active={activeTab === 'plans'} 
            onClick={() => setActiveTab('plans')}
          >
            Meine Pläne
          </Tab>
          <Tab 
            active={activeTab === 'food-items'} 
            onClick={() => setActiveTab('food-items')}
          >
            Lebensmittel-DB
          </Tab>
        </TabsContainer>
        
        {renderContent()}
      </PageContainer>
    </NutritionProvider>
  );
}

export default Nutrition; 