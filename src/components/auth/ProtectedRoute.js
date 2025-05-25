import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const DebugInfo = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  font-family: monospace;
  font-size: 0.8rem;
  max-width: 400px;
  word-break: break-all;
`;

const TroubleshootButton = styled.button`
  background: ${props => props.theme.colors.warning};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.theme.colors.error};
  }
`;

const clearCacheAndReload = () => {
  console.log('🔄 User initiated cache clear and reload...');
  
  // Clear service worker caches
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
  
  // Clear relevant localStorage
  ['workoutState', 'userProfile', 'gamificationState', 'nutritionState', 'app_version'].forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Force hard reload
  window.location.reload(true);
};

export default function ProtectedRoute({ children }) {
  const { user, loading, isInitialized, error } = useAuth();
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  // More specific debug logging to identify loops
  const renderReason = !isInitialized ? 'not_initialized' : 
                      loading ? 'loading' : 
                      !user ? 'no_user' : 'authenticated';
  
  // Track render count to detect loops
  const renderCountRef = useRef(0);
  const firstRenderTimeRef = useRef(Date.now());
  renderCountRef.current += 1;
  
  console.log('🛡️ ProtectedRoute render #' + renderCountRef.current + ':', { 
    renderReason,
    hasUser: !!user, 
    userEmail: user?.email,
    loading, 
    isInitialized,
    hasError: !!error,
    timestamp: new Date().toISOString().split('T')[1]
  });

  // Detect potential infinite loops and show troubleshoot option
  useEffect(() => {
    const timeSinceFirstRender = Date.now() - firstRenderTimeRef.current;
    
    if (renderCountRef.current > 8 && loading && timeSinceFirstRender > 5000) {
      console.warn('🚨 ProtectedRoute: Potential infinite loading loop detected!');
      setShowTroubleshoot(true);
    }
  }, [loading, renderCountRef.current]);

  // Timeout mechanism to prevent infinite loading
  useEffect(() => {
    if (loading && isInitialized) {
      const timeout = setTimeout(() => {
        console.error('🚨 ProtectedRoute: Loading timeout - showing troubleshoot option');
        setShowTroubleshoot(true);
      }, 15000); // 15 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [loading, isInitialized]);

  // Show loading spinner while auth is initializing
  if (!isInitialized || loading) {
    console.log('⏳ ProtectedRoute showing loading:', { 
      isInitialized, 
      loading, 
      reason: !isInitialized ? 'not_initialized' : 'loading' 
    });
    
    return (
      <LoadingContainer>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <LoadingText>
            {!isInitialized ? 'Initialisiere Authentifizierung...' : 'Lade Anwendung...'}
          </LoadingText>
          
          {showTroubleshoot && (
            <div>
              <LoadingText style={{ color: '#ff6b6b', marginTop: '1rem' }}>
                Die Anwendung lädt länger als erwartet...
              </LoadingText>
              <TroubleshootButton onClick={clearCacheAndReload}>
                Cache leeren und neu laden
              </TroubleshootButton>
            </div>
          )}
          
          {(process.env.NODE_ENV === 'development' || showTroubleshoot) && (
            <DebugInfo>
              <strong>Auth Debug:</strong>
              <br />Reason: {!isInitialized ? 'Not Initialized' : 'Loading'}
              <br />User: {user ? user.email : 'null'}
              <br />Loading: {loading.toString()}
              <br />Initialized: {isInitialized.toString()}
              <br />Error: {error?.message || 'none'}
              <br />Renders: {renderCountRef.current}
              <br />Time: {new Date().toLocaleTimeString()}
            </DebugInfo>
          )}
        </div>
      </LoadingContainer>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    console.log('🔐 ProtectedRoute showing login form - user not authenticated');
    return <LoginForm />;
  }

  // User is authenticated, render the protected content
  console.log('✅ ProtectedRoute rendering protected content for user:', user.email);
  return children;
} 