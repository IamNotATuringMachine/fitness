import React from 'react';
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

  // Debug logging
  console.log('🛡️ ProtectedRoute render:', { 
    hasUser: !!user, 
    userEmail: user?.email,
    loading, 
    isInitialized,
    hasError: !!error,
    timestamp: new Date().toISOString()
  });

  // Show loading spinner while auth is initializing
  if (!isInitialized || loading) {
    console.log('⏳ ProtectedRoute showing loading:', { isInitialized, loading });
    return (
      <LoadingContainer>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <LoadingText>Lade Anwendung...</LoadingText>
          {process.env.NODE_ENV === 'development' && (
            <DebugInfo>
              <strong>Auth Debug:</strong>
              <br />User: {user ? user.email : 'null'}
              <br />Loading: {loading.toString()}
              <br />Initialized: {isInitialized.toString()}
              <br />Error: {error?.message || 'none'}
            </DebugInfo>
          )}
        </div>
      </LoadingContainer>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    console.log('🔐 ProtectedRoute showing login form');
    return <LoginForm />;
  }

  // User is authenticated, render the protected content
  console.log('✅ ProtectedRoute rendering protected content for user:', user.email);
  return children;
} 