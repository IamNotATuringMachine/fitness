import React, { useRef, useEffect } from 'react';
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

export default function ProtectedRoute({ children }) {
  const { user, loading, isInitialized, error } = useAuth();

  // More specific debug logging to identify loops
  const renderReason = !isInitialized ? 'not_initialized' : 
                      loading ? 'loading' : 
                      !user ? 'no_user' : 'authenticated';
  
  // Track render count to detect loops
  const renderCountRef = useRef(0);
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

  // Detect potential infinite loops
  if (renderCountRef.current > 10 && loading) {
    console.warn('🚨 ProtectedRoute: Potential infinite loading loop detected!');
  }

  // Timeout mechanism to prevent infinite loading
  useEffect(() => {
    if (loading && isInitialized) {
      const timeout = setTimeout(() => {
        console.error('🚨 ProtectedRoute: Loading timeout - forcing page reload to reset auth state');
        window.location.reload();
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
          {process.env.NODE_ENV === 'development' && (
            <DebugInfo>
              <strong>Auth Debug:</strong>
              <br />Reason: {!isInitialized ? 'Not Initialized' : 'Loading'}
              <br />User: {user ? user.email : 'null'}
              <br />Loading: {loading.toString()}
              <br />Initialized: {isInitialized.toString()}
              <br />Error: {error?.message || 'none'}
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