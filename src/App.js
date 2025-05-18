import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import WorkoutPlans from './pages/WorkoutPlans';
import WorkoutTemplates from './pages/WorkoutTemplates';
import CreatePlan from './pages/CreatePlan';
import EditPlan from './pages/EditPlan';
import Calendar from './pages/Calendar';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ProgressTracking from './pages/ProgressTracking';
import Analysis from './pages/Analysis';
import PersonalizedPlans from './pages/PersonalizedPlans';
import PeriodizationTools from './pages/PeriodizationTools';
import AITrainingAssistant from './pages/AITrainingAssistant';
import Settings from './pages/Settings';
import Nutrition from './pages/Nutrition';
import Gamification from './pages/Gamification';
import DataImportExport from './pages/DataImportExport';
import Feedback from './pages/Feedback';
import FeedbackManagement from './pages/FeedbackManagement';
import { WorkoutProvider } from './context/WorkoutContext';
import ThemeProvider from './theme/ThemeProvider';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: background-color ${props => props.theme.transitions.medium};
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  overflow-y: auto;
`;

function App() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <Router>
          <AppContainer>
            <Header />
            <MainContainer>
              <Sidebar />
              <ContentContainer>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/plans" element={<WorkoutPlans />} />
                  <Route path="/templates" element={<WorkoutTemplates />} />
                  <Route path="/create-plan" element={<CreatePlan />} />
                  <Route path="/edit-plan/:id" element={<EditPlan />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/exercises" element={<ExerciseLibrary />} />
                  <Route path="/progress" element={<ProgressTracking />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/personalized-plans" element={<PersonalizedPlans />} />
                  <Route path="/periodization" element={<PeriodizationTools />} />
                  <Route path="/ai-assistant" element={<AITrainingAssistant />} />
                  <Route path="/nutrition" element={<Nutrition />} />
                  <Route path="/gamification" element={<Gamification />} />
                  <Route path="/data-import-export" element={<DataImportExport />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/feedback-management" element={<FeedbackManagement />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </ContentContainer>
            </MainContainer>
          </AppContainer>
        </Router>
      </WorkoutProvider>
    </ThemeProvider>
  );
}

export default App; 