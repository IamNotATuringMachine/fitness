import React, { useState } from 'react';
import styled from 'styled-components';
import { createBackup, exportBackup } from '../../utils/backupUtils';

const QuickBackupButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const FloatingBackupButton = styled(QuickBackupButton)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  
  span {
    display: none;
  }
  
  &:hover span {
    display: inline;
    position: absolute;
    right: 70px;
    top: 50%;
    transform: translateY(-50%);
    background: #333;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    white-space: nowrap;
    font-size: 0.8rem;
    z-index: 1001;
    
    &::after {
      content: '';
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-left-color: #333;
    }
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const QuickBackup = ({ variant = 'header', onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickBackup = async () => {
    setIsLoading(true);
    
    try {
      const backup = createBackup();
      await exportBackup(backup);
      
      // Update last backup timestamp
      localStorage.setItem('lastBackupTime', new Date().toISOString());
      
      if (onSuccess) {
        onSuccess('Backup erfolgreich erstellt und heruntergeladen!');
      }
    } catch (error) {
      console.error('Fehler beim Quick-Backup:', error);
      if (onError) {
        onError('Fehler beim Erstellen des Backups: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'floating') {
    return (
      <FloatingBackupButton
        onClick={handleQuickBackup}
        disabled={isLoading}
        title="Schnelles Backup erstellen"
      >
        {isLoading ? <LoadingSpinner /> : '💾'}
        <span>Backup erstellen</span>
      </FloatingBackupButton>
    );
  }

  return (
    <QuickBackupButton
      onClick={handleQuickBackup}
      disabled={isLoading}
      title="Schnelles Backup erstellen"
    >
      {isLoading ? <LoadingSpinner /> : '💾'}
      <span>Backup</span>
    </QuickBackupButton>
  );
};

export default QuickBackup; 