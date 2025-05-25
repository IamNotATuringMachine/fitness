import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const CallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const DebugInfo = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  font-family: monospace;
  font-size: 0.8rem;
  max-width: 500px;
  word-break: break-all;
`;

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading, isInitialized, error } = useAuth();
  const [timeoutError, setTimeoutError] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('🔄 AuthCallback mounted');
    console.log('📊 Auth state:', { user: !!user, loading, isInitialized, error });
    
    // Update debug info
    setDebugInfo({
      user: !!user,
      loading,
      isInitialized,
      error: error?.message || null,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });

    // Set a timeout to prevent infinite waiting
    const timeout = setTimeout(() => {
      console.error('⏰ Auth callback timeout - redirecting to login');
      setTimeoutError(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    }, 10000); // 10 seconds timeout

    // Wait for auth state to be determined
    if (isInitialized && !loading) {
      clearTimeout(timeout);
      
      if (user) {
        console.log('✅ User authenticated, redirecting to dashboard');
        navigate('/', { replace: true });
      } else {
        console.log('❌ Authentication failed, redirecting to home (will show login)');
        navigate('/', { replace: true });
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [user, loading, isInitialized, error, navigate]);

  if (timeoutError) {
    return (
      <CallbackContainer>
        <ErrorText>
          Authentifizierung dauert zu lange. Du wirst weitergeleitet...
        </ErrorText>
        {process.env.NODE_ENV === 'development' && (
          <DebugInfo>
            <strong>Debug Info:</strong>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </DebugInfo>
        )}
      </CallbackContainer>
    );
  }

  if (error) {
    return (
      <CallbackContainer>
        <ErrorText>
          Authentifizierungsfehler: {error.message}
        </ErrorText>
        <LoadingText>
          Du wirst zur Startseite weitergeleitet...
        </LoadingText>
        {process.env.NODE_ENV === 'development' && (
          <DebugInfo>
            <strong>Debug Info:</strong>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </DebugInfo>
        )}
      </CallbackContainer>
    );
  }

  return (
    <CallbackContainer>
      <LoadingSpinner />
      <LoadingText>
        Authentifizierung wird verarbeitet...
      </LoadingText>
      {process.env.NODE_ENV === 'development' && (
        <DebugInfo>
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </DebugInfo>
      )}
    </CallbackContainer>
  );
} 