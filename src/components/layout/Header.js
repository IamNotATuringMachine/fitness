import React from 'react';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';
import UserProfile from '../auth/UserProfile';

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
  position: relative;
  z-index: ${props => props.theme.zIndices.sticky};
  
  /* Prevent interference with mobile menu */
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  
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
  
  /* Ensure the button is clickable on mobile */
  position: relative;
  z-index: ${props => props.theme.zIndices.sticky + 1};
  
  /* Improve touch target */
  min-width: 48px;
  min-height: 48px;
  
  /* Prevent double-tap zoom on iOS */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  
  /* Visual feedback for touch */
  &:active {
    background-color: ${props => props.theme.colors.grayLight};
    transform: scale(0.95);
    transition: transform 0.1s ease-out;
  }
  
  /* Ensure no pointer events are blocked */
  pointer-events: auto;
  
  /* Prevent text selection on mobile */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  
  /* Force hardware acceleration */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform;
`;

const Header = ({ onMenuToggle, isMobileMenuOpen }) => {
  const handleMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMenuToggle) {
      onMenuToggle();
    }
  };
  
  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton 
          onClick={handleMenuToggle}
          title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <FaBars />
        </MenuButton>
        <HeaderTitle>FitTracker</HeaderTitle>
      </LeftSection>
      <HeaderActions>
        <UserProfile />
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header; 