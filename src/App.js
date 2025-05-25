import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileNavigation from './components/layout/MobileNavigation';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import WorkoutPlans from './pages/WorkoutPlans';
import WorkoutTemplates from './pages/WorkoutTemplates';
import CreatePlan from './pages/CreatePlan';
import EditPlan from './pages/EditPlan';
import Calendar from './pages/Calendar';
import ExerciseLibrary from './pages/ExerciseLibrary';
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
import { AuthProvider } from './context/AuthContext';
import ThemeProvider from './theme/ThemeProvider';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ExerciseTracker from './components/workout/ExerciseTracker';
import DataRepair from './pages/DataRepair';
import WorkoutDetails from './pages/WorkoutDetails';
import EditWorkoutPage from './pages/EditWorkoutPage';
import WorkoutHistory from './pages/WorkoutHistory';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import SocialFeatures from './pages/SocialFeatures';
import AuthCallback from './pages/AuthCallback';

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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  overflow-y: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.mobile.md};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.mobile.sm};
  }
`;

// Protected App Layout Component
function ProtectedAppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <AppContainer>
      <Header 
        onMenuToggle={toggleMobileMenu} 
        isMobileMenuOpen={mobileMenuOpen}
      />
      <MainContainer>
        <Sidebar />
        <MobileNavigation 
          isOpen={mobileMenuOpen} 
          onClose={closeMobileMenu}
        />
        <ContentContainer>
          {children}
        </ContentContainer>
      </MainContainer>
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Router basename="/fitness">
              <Routes>
                {/* Public route for OAuth callback - not protected */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* All other routes are protected */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <WorkoutProvider>
                      <ProtectedAppLayout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/plans" element={<WorkoutPlans />} />
                          <Route path="/templates" element={<WorkoutTemplates />} />
                          <Route path="/create-plan" element={<CreatePlan />} />
                          <Route path="/edit-plan/:id" element={<EditPlan />} />
                          <Route path="/calendar" element={<Calendar />} />
                          <Route path="/exercises" element={<ExerciseLibrary />} />
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
                          <Route path="/workout-tracker" element={<ExerciseTracker />} />
                          <Route path="/workout-history" element={<WorkoutHistory />} />
                          <Route path="/data-repair" element={<DataRepair />} />
                          <Route path="/workout/:id" element={<WorkoutDetails />} />
                          <Route path="/edit-workout/:id" element={<EditWorkoutPage />} />
                          <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                          <Route path="/social" element={<SocialFeatures />} />
                        </Routes>
                      </ProtectedAppLayout>
                    </WorkoutProvider>
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </ErrorBoundary>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App; 