import React, { useState } from 'react';
import styled from 'styled-components';
import { createBackup, exportBackup } from '../../utils/backupUtils';

const FloatingContainer = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 0.75rem;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    gap: 0.5rem;
  }
`;

const FloatingButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #374151;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.95);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    font-size: 1.1rem;
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  border-top: 2px solid #374151;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: #1f2937;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1f2937;
  }
  
  ${FloatingButton}:hover & {
    opacity: 1;
  }
`;

const FloatingActions = ({ showDebug = true, onDebugToggle, debugVisible }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleQuickBackup = async () => {
    setIsBackingUp(true);
    
    try {
      const backup = createBackup();
      await exportBackup(backup);
      
      // Update last backup timestamp
      localStorage.setItem('lastBackupTime', new Date().toISOString());
    } catch (error) {
      console.error('Fehler beim Quick-Backup:', error);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <FloatingContainer>
      {/* Backup Button */}
      <FloatingButton
        onClick={handleQuickBackup}
        disabled={isBackingUp}
        title="Schnelles Backup erstellen"
      >
        <Tooltip>Backup erstellen</Tooltip>
        {isBackingUp ? <LoadingSpinner /> : '💾'}
      </FloatingButton>

      {/* Debug Button */}
      {showDebug && (
        <FloatingButton
          onClick={onDebugToggle}
          title="Debug Panel ein/ausblenden"
          style={{
            background: debugVisible 
              ? 'rgba(59, 130, 246, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            color: debugVisible ? 'white' : '#374151'
          }}
        >
          <Tooltip>Debug Panel</Tooltip>
          🔧
        </FloatingButton>
      )}
    </FloatingContainer>
  );
};

export default FloatingActions; 