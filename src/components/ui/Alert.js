import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.default};
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: fadeIn 0.3s ease-in-out;
  
  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.successLight;
      case 'warning':
        return props.theme.colors.warningLight;
      case 'error':
        return props.theme.colors.errorLight;
      case 'info':
      default:
        return props.theme.colors.infoLight;
    }
  }};
  
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.success;
      case 'warning':
        return props.theme.colors.warning;
      case 'error':
        return props.theme.colors.error;
      case 'info':
      default:
        return props.theme.colors.info;
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.successDark;
      case 'warning':
        return props.theme.colors.warningDark;
      case 'error':
        return props.theme.colors.errorDark;
      case 'info':
      default:
        return props.theme.colors.infoDark;
    }
  }};
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.h4`
  margin: 0 0 ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const AlertMessage = styled.p`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  line-height: 1;
  padding: ${props => props.theme.spacing.xs};
  color: inherit;
  opacity: 0.7;
  transition: opacity ${props => props.theme.transitions.short};
  
  &:hover {
    opacity: 1;
  }
`;

const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  onClose, 
  autoClose = false, 
  autoCloseTime = 5000 
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);
  
  if (!visible) return null;
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  // Choose the icon based on the alert type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };
  
  return (
    <AlertContainer type={type}>
      <AlertContent>
        {title && <AlertTitle>{getIcon()} {title}</AlertTitle>}
        <AlertMessage>{!title && getIcon()} {children}</AlertMessage>
      </AlertContent>
      {onClose && (
        <CloseButton onClick={handleClose}>×</CloseButton>
      )}
    </AlertContainer>
  );
};

export default Alert; 