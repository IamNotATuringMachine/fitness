import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../theme/ThemeProvider';
import { Link } from 'react-router-dom';
import { FaCog, FaSun, FaMoon, FaBars } from 'react-icons/fa';
import UserProfile from '../auth/UserProfile';
import { createBackup, exportBackup } from '../../utils/backupUtils';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: ${props => props.theme.zIndices.sticky};
  position: relative;
  min-height: ${props => props.theme.mobile?.headerHeight || '60px'};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.mobile.md};
    position: sticky;
    top: 0;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: ${props => props.theme.spacing.mobile.md};
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSizes.mobile.xl};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.typography.fontSizes.mobile.lg};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: ${props => props.theme.spacing.mobile.sm};
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.lg};
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: all ${props => props.theme.transitions.short};
  min-width: ${props => props.theme.mobile?.touchTarget || '44px'};
  min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
  }
  
  &:focus {
    outline: none;
    background-color: ${props => props.theme.colors.grayLight};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary} inset;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSizes.mobile.lg};
    padding: ${props => props.theme.spacing.mobile.xs};
  }
  
  /* Remove hover effects on touch devices */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      background-color: transparent;
    }
  }
`;

const MenuButton = styled(IconButton)`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const SettingsLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
`;

const BackupButton = styled(IconButton)`
  position: relative;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  border-top: 2px solid ${props => props.theme.colors.primary};
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Header = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { theme, toggleTheme } = useTheme();
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
    <HeaderContainer>
      <LeftSection>
        <MenuButton 
          onClick={onMenuToggle} 
          title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <FaBars />
        </MenuButton>
        <HeaderTitle>FitnessPro</HeaderTitle>
      </LeftSection>
      <HeaderActions>
        <BackupButton
          onClick={handleQuickBackup}
          disabled={isBackingUp}
          title="Schnelles Backup erstellen"
          aria-label="Schnelles Backup erstellen"
        >
          {isBackingUp ? <LoadingSpinner /> : '💾'}
        </BackupButton>
        <IconButton 
          onClick={toggleTheme} 
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </IconButton>
        <SettingsLink to="/settings" title="Settings">
          <IconButton>
            <FaCog />
          </IconButton>
        </SettingsLink>
        <UserProfile />
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header; 