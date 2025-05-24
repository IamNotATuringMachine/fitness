import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import Button from './Button';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.accent};
`;

const ErrorTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.xl};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.lg};
  max-width: 600px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.grayLight};
  border-radius: ${props => props.theme.borderRadius.medium};
  width: 100%;
  max-width: 800px;
  
  summary {
    cursor: pointer;
    font-weight: ${props => props.theme.typography.fontWeights.medium};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  pre {
    background-color: ${props => props.theme.colors.cardBackground};
    padding: ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.small};
    overflow-x: auto;
    font-size: ${props => props.theme.typography.fontSizes.sm};
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // In a real app, you would send this to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error, errorInfo) {
    // Simulate error logging
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorId: this.state.errorId
    };

    // Store error in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingErrors.push(errorReport);
      
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Failed to log error to localStorage:', e);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReportBug = () => {
    const subject = encodeURIComponent(`Bug Report - Error ID: ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error Message: ${this.state.error?.message || 'Unknown error'}

Steps to reproduce:
1. 
2. 
3. 

Additional information:
- Timestamp: ${new Date().toISOString()}
- URL: ${window.location.href}
- Browser: ${navigator.userAgent}

Technical Details:
${this.state.error?.stack || 'No stack trace available'}
    `);
    
    window.open(`mailto:support@fitnessapp.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const { fallback: CustomFallback } = this.props;

      // If a custom fallback is provided, use it
      if (CustomFallback) {
        return (
          <CustomFallback
            error={error}
            errorInfo={errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
          />
        );
      }

      // Default error UI
      return (
        <ErrorContainer>
          <Card style={{ width: '100%', maxWidth: '800px' }}>
            <Card.Body>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorTitle>Etwas ist schief gelaufen</ErrorTitle>
              <ErrorMessage>
                Es tut uns leid, aber es ist ein unerwarteter Fehler aufgetreten. 
                Das Problem wurde automatisch gemeldet und unser Team arbeitet daran, es zu beheben.
              </ErrorMessage>
              
              <ActionButtons>
                <Button onClick={this.handleRetry} variant="primary">
                  Erneut versuchen
                </Button>
                <Button onClick={this.handleGoHome} variant="outline">
                  Zur Startseite
                </Button>
                <Button onClick={this.handleReload} variant="outline">
                  Seite neu laden
                </Button>
                <Button onClick={this.handleReportBug} variant="outline">
                  Bug melden
                </Button>
              </ActionButtons>

              {process.env.NODE_ENV === 'development' && error && (
                <ErrorDetails>
                  <summary>Technische Details (Entwicklermodus)</summary>
                  <div>
                    <h4>Error Message:</h4>
                    <pre>{error.message}</pre>
                    
                    <h4>Stack Trace:</h4>
                    <pre>{error.stack}</pre>
                    
                    {errorInfo && (
                      <>
                        <h4>Component Stack:</h4>
                        <pre>{errorInfo.componentStack}</pre>
                      </>
                    )}
                  </div>
                </ErrorDetails>
              )}
            </Card.Body>
          </Card>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 