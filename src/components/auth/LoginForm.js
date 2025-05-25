import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}20, ${props => props.theme.colors.secondary}20);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin: 0 0 2rem 0;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
  z-index: 2;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
  
  span {
    padding: 0 1rem;
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ToggleMode = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
  }
`;

const ErrorMessage = styled.div`
  background: #ff4757;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: #2ed573;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.9rem;
  text-align: right;
  padding: 0;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
  }
`;

const DemoModeIndicator = styled.div`
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  color: #2d3436;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 600;
  border: 2px solid #fdcb6e;
  
  &::before {
    content: '🧪';
    margin-right: 0.5rem;
    font-size: 1.1rem;
  }
`;

const DemoButton = styled.button`
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-bottom: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 184, 148, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { 
    signIn, 
    signUp, 
    signInDemo,
    signInWithGoogle, 
    signInWithGitHub, 
    resetPassword,
    loading, 
    error,
    clearError,
    isDemoMode 
  } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError('');
    clearError();
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setLocalError('Bitte füllen Sie alle Felder aus');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError('Das Passwort muss mindestens 6 Zeichen lang sein');
      return false;
    }

    if (isSignUp) {
      if (!formData.name) {
        setLocalError('Bitte geben Sie Ihren Namen ein');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setLocalError('Die Passwörter stimmen nicht überein');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      let result;
      
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, {
          name: formData.name
        });
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (result.success) {
        if (isSignUp) {
          setSuccessMessage('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail.');
          setIsSignUp(false);
          setFormData({ email: '', password: '', confirmPassword: '', name: '' });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else if (provider === 'github') {
        result = await signInWithGitHub();
      }

      if (!result.success && result.error) {
        setLocalError(result.error.message || 'Anmeldung fehlgeschlagen');
      }
    } catch (error) {
      console.error('Social login error:', error);
      setLocalError('Anmeldung fehlgeschlagen');
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setLocalError('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }

    try {
      const result = await resetPassword(formData.email);
      if (result.success) {
        setSuccessMessage('Passwort-Reset-Link wurde an Ihre E-Mail gesendet');
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLocalError('');
      const result = await signInDemo();
      if (!result.success && result.error) {
        setLocalError(result.error.message || 'Demo-Anmeldung fehlgeschlagen');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setLocalError('Demo-Anmeldung fehlgeschlagen');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
    setLocalError('');
    setSuccessMessage('');
    clearError();
  };

  const displayError = localError || error?.message;

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <LogoIcon>
            <FaUser />
          </LogoIcon>
          <Title>FitTrack</Title>
          <Subtitle>
            {isDemoMode 
              ? 'Demo Modus - Testen Sie die App!' 
              : (isSignUp ? 'Erstellen Sie Ihr Konto' : 'Willkommen zurück')
            }
          </Subtitle>
        </Logo>

        {isDemoMode && (
          <DemoModeIndicator>
            Demo Modus aktiv - Keine Registrierung erforderlich!
            <br />
            <small>Alle Funktionen verfügbar, Daten werden lokal gespeichert</small>
          </DemoModeIndicator>
        )}

        {displayError && (
          <ErrorMessage>{displayError}</ErrorMessage>
        )}

        {successMessage && (
          <SuccessMessage>{successMessage}</SuccessMessage>
        )}

        {isDemoMode && (
          <DemoButton
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            {loading ? 'Lädt...' : '🚀 Demo starten'}
          </DemoButton>
        )}

        <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <InputGroup>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="text"
                name="name"
                placeholder="Vollständiger Name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
              />
            </InputGroup>
          )}

          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="E-Mail-Adresse"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Passwort"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </InputGroup>

          {isSignUp && (
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Passwort bestätigen"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
              />
            </InputGroup>
          )}

          {!isSignUp && (
            <ForgotPassword
              type="button"
              onClick={() => setShowForgotPassword(!showForgotPassword)}
            >
              Passwort vergessen?
            </ForgotPassword>
          )}

          {showForgotPassword && !isSignUp && (
            <SubmitButton
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? 'Wird gesendet...' : 'Reset-Link senden'}
            </SubmitButton>
          )}

          {!showForgotPassword && (
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Lädt...' : (isSignUp ? 'Registrieren' : 'Anmelden')}
            </SubmitButton>
          )}
        </Form>

        {!showForgotPassword && (
          <>
            {!isDemoMode && (
              <Divider>
                <span>oder</span>
              </Divider>
            )}

            {isDemoMode && (
              <Divider>
                <span>oder traditionell anmelden</span>
              </Divider>
            )}

            <SocialButtons>
              <SocialButton
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <FaGoogle />
                {isDemoMode ? 'Demo Google' : 'Google'}
              </SocialButton>
              <SocialButton
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
              >
                <FaGithub />
                {isDemoMode ? 'Demo GitHub' : 'GitHub'}
              </SocialButton>
            </SocialButtons>

            <div style={{ textAlign: 'center' }}>
              <ToggleMode type="button" onClick={toggleMode}>
                {isDemoMode 
                  ? (isSignUp ? 'Demo Login versuchen' : 'Demo Registrierung versuchen')
                  : (isSignUp 
                    ? 'Bereits ein Konto? Anmelden' 
                    : 'Noch kein Konto? Registrieren'
                  )
                }
              </ToggleMode>
            </div>
          </>
        )}
      </LoginCard>
    </LoginContainer>
  );
} 