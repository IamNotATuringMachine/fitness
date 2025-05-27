import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2ed573, #1dd1a1);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  font-size: 14px;
  font-weight: 500;
  max-width: 400px;
  text-align: center;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-out;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
    transform: none;
  }
`;

const NotificationIcon = styled.span`
  margin-right: 8px;
  font-size: 16px;
`;

const SyncNotification = () => {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleLoginDataSynced = (event) => {
      const { message, updatedKeys } = event.detail;
      
      const displayMessage = updatedKeys && updatedKeys.length > 0
        ? `📥 Data synced from cloud: ${updatedKeys.join(', ')}`
        : message || '📥 Your data has been synced from the cloud';
      
      setNotification(displayMessage);
      setIsVisible(true);
      
      // Auto-hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
        // Remove from DOM after animation
        setTimeout(() => {
          setNotification(null);
        }, 300);
      }, 4000);
    };

    const handleSafeDataSynced = (event) => {
      // const { updatedKeys } = event.detail; // Commented out as the whole block is disabled
      
      // MODIFIED: Disable this notification entirely
      /*
      if (updatedKeys && updatedKeys.length > 0) {
        const displayMessage = `📥 Data updated: ${updatedKeys.join(', ')}`;
        
        setNotification(displayMessage);
        setIsVisible(true);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setNotification(null);
          }, 300);
        }, 3000);
      }
      */
      // console.log('SyncNotification: 'safeDataSynced' event received, notification intentionally suppressed.', event.detail);
    };

    const handleLoginSyncFailed = (event) => {
      const { message } = event.detail;
      
      const displayMessage = message || '⚠️ Cloud sync failed - please manually sync your data';
      
      setNotification(displayMessage);
      setIsVisible(true);
      
      // Keep visible longer for error messages (6 seconds)
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setNotification(null);
        }, 300);
      }, 6000);
    };

    const handleCloudDataUpdated = (event) => {
      const { updatedKeys, source } = event.detail;
      
      if (updatedKeys && updatedKeys.length > 0 && source !== 'real-time-sync') {
        const displayMessage = `🌐 Data updated via sync: ${updatedKeys.join(', ')} updated`;
        
        setNotification(displayMessage);
        setIsVisible(true);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setNotification(null);
          }, 300);
        }, 3000);
      }
    };

    window.addEventListener('loginDataSynced', handleLoginDataSynced);
    window.addEventListener('safeDataSynced', handleSafeDataSynced);
    window.addEventListener('loginSyncFailed', handleLoginSyncFailed);
    window.addEventListener('cloudDataUpdated', handleCloudDataUpdated);

    return () => {
      window.removeEventListener('loginDataSynced', handleLoginDataSynced);
      window.removeEventListener('safeDataSynced', handleSafeDataSynced);
      window.removeEventListener('loginSyncFailed', handleLoginSyncFailed);
      window.removeEventListener('cloudDataUpdated', handleCloudDataUpdated);
    };
  }, []);

  if (!notification) {
    return null;
  }

  return (
    <NotificationContainer isVisible={isVisible}>
      <NotificationIcon>🔄</NotificationIcon>
      {notification}
    </NotificationContainer>
  );
};

export default SyncNotification; 