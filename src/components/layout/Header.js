import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../theme/ThemeProvider';
import { Link } from 'react-router-dom';
import { FaCog, FaSun, FaMoon, FaBars } from 'react-icons/fa';

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
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const Header = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { theme, toggleTheme } = useTheme();
  
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
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header; 