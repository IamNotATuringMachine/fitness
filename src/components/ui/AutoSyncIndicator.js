import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import autoSyncService from '../../services/AutoSyncService';

const AutoSyncIndicator = () => {
  const { user, isDemoMode } = useAuth();
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isVisible, setIsVisible] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Only show indicator for authenticated users (not demo mode)
    if (user && !isDemoMode) {
      setIsVisible(true);
      
      // Listen for auto-sync events
      const handleAutoSyncCompleted = (event) => {
        setSyncStatus('synced');
        setLastSyncTime(new Date());
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setSyncStatus('idle');
        }, 3000);
      };
      
      const handleAutoSyncError = (event) => {
        setSyncStatus('error');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setSyncStatus('idle');
        }, 5000);
      };
      
      window.addEventListener('autoSyncCompleted', handleAutoSyncCompleted);
      window.addEventListener('autoSyncError', handleAutoSyncError);
      
      return () => {
        window.removeEventListener('autoSyncCompleted', handleAutoSyncCompleted);
        window.removeEventListener('autoSyncError', handleAutoSyncError);
      };
    } else {
      setIsVisible(false);
    }
  }, [user, isDemoMode]);

  if (!isVisible || syncStatus === 'idle') return null;

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: '✅',
          text: 'Auto-synced',
          color: '#2ed573',
          bgColor: 'rgba(46, 213, 115, 0.1)'
        };
      case 'error':
        return {
          icon: '❌',
          text: 'Sync error',
          color: '#ff3838',
          bgColor: 'rgba(255, 56, 56, 0.1)'
        };
      default:
        return {
          icon: '🔄',
          text: 'Auto-sync active',
          color: '#5a9fd4',
          bgColor: 'rgba(90, 159, 212, 0.1)'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '8px 12px',
        borderRadius: '20px',
        background: config.bgColor,
        border: `1px solid ${config.color}`,
        color: config.color,
        fontSize: '12px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onClick={() => {
        // Show auto-sync status in console when clicked
        const status = autoSyncService.getStatus();
        console.log('📊 Auto-sync status:', status);
        
        // Show a brief tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = `Last sync: ${lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}`;
        tooltip.style.cssText = `
          position: fixed;
          bottom: 60px;
          right: 20px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border-radius: 4px;
          font-size: 11px;
          z-index: 1001;
          pointer-events: none;
        `;
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
          if (document.body.contains(tooltip)) {
            document.body.removeChild(tooltip);
          }
        }, 2000);
      }}
      title="Click for sync status"
    >
      <span>{config.icon}</span>
      <span>{config.text}</span>
    </div>
  );
};

export default AutoSyncIndicator; 