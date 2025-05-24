import React, { useState, /* useEffect, */ createContext, useContext, /* useCallback */ } from 'react';
import styled, { keyframes, css } from 'styled-components';
import ReactDOM from 'react-dom';

// Animation keyframes
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: ${props => props.theme.zIndices.tooltip || 700};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  pointer-events: none;
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
  }
`;

const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.cardBackground};
  box-shadow: ${props => props.theme.shadows.large};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.secondary;
      case 'error':
        return props.theme.colors.accent;
      case 'warning':
        return props.theme.colors.warning;
      case 'info':
      default:
        return props.theme.colors.primary;
    }
  }};
  min-width: 300px;
  max-width: 500px;
  pointer-events: auto;
  
  animation: ${props => props.isExiting 
    ? css`${slideOutRight} 0.3s ease-in-out forwards`
    : css`${slideInRight} 0.3s ease-in-out`
  };
  
  @media (max-width: 768px) {
    min-width: auto;
    max-width: none;
  }
`;

const ToastIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastTitle = styled.h4`
  margin: 0 0 ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
  line-height: 1.4;
`;

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textLight};
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color ${props => props.theme.transitions.short};
  flex-shrink: 0;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
  }
  
  &:focus {
    outline: none;
    background-color: ${props => props.theme.colors.grayLight};
  }
`;

const ToastProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.colors.secondary;
      case 'error':
        return props.theme.colors.accent;
      case 'warning':
        return props.theme.colors.warning;
      case 'info':
      default:
        return props.theme.colors.primary;
    }
  }};
  border-radius: 0 0 ${props => props.theme.borderRadius.medium} ${props => props.theme.borderRadius.medium};
  width: ${props => `${props.progress}%`};
  transition: width 100ms linear;
`;

// Toast context for managing toasts globally
const ToastContext = createContext();

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Individual toast component
const Toast = ({ id, type, title, message, duration, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(id), 300);
  };
  
  if (duration > 0) {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const newProgress = (remaining / duration) * 100;
      
      setProgress(newProgress);
      
      if (remaining === 0) {
        clearInterval(interval);
        handleClose();
      }
    }, 100);
    
    return () => clearInterval(interval);
  }
  
  return (
    <ToastItem type={type} isExiting={isExiting}>
      <ToastIcon>{getIcon()}</ToastIcon>
      <ToastContent>
        {title && <ToastTitle>{title}</ToastTitle>}
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
      <ToastCloseButton onClick={handleClose}>×</ToastCloseButton>
      {duration > 0 && <ToastProgressBar type={type} progress={progress} />}
    </ToastItem>
  );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ 
    type = 'info', 
    title, 
    message, 
    duration = 5000,
    persistent = false 
  }) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type,
      title,
      message,
      duration: persistent ? 0 : duration
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (message, options = {}) => 
    addToast({ type: 'success', message, ...options });
    
  const error = (message, options = {}) => 
    addToast({ type: 'error', message, ...options });
    
  const warning = (message, options = {}) => 
    addToast({ type: 'warning', message, ...options });
    
  const info = (message, options = {}) => 
    addToast({ type: 'info', message, ...options });

  const toast = {
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {typeof document !== 'undefined' && 
        ReactDOM.createPortal(
          <ToastContainer>
            {toasts.map(toastProps => (
              <Toast 
                key={toastProps.id} 
                {...toastProps} 
                onRemove={removeToast} 
              />
            ))}
          </ToastContainer>,
          document.body
        )
      }
    </ToastContext.Provider>
  );
};

export default Toast; 