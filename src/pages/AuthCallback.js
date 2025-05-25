import React, { useEffect } from 'react';
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
`;

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for auth state to be determined
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        navigate('/', { replace: true });
      } else {
        // Authentication failed, redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <CallbackContainer>
      <LoadingSpinner />
      <LoadingText>
        Authentifizierung wird verarbeitet...
      </LoadingText>
    </CallbackContainer>
  );
} 