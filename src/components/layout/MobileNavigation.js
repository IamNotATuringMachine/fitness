import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.theme.zIndices.overlay};
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: opacity ${props => props.theme.transitions.medium}, visibility 0s ${props => props.isOpen ? '0s' : props.theme.transitions.medium};
  
  /* Ensure touch events work */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  
  /* Prevent accidental visibility during theme changes */
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background-color: ${props => props.theme.colors.cardBackground};
  z-index: ${props => props.theme.zIndices.mobileSidebar};
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform ${props => props.theme.transitions.medium};
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.large};
  
  /* Prevent text selection */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
`;

const MenuTitle = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.mobile.lg};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.typography.fontSizes.mobile.lg};
  cursor: pointer;
  padding: ${props => props.theme.spacing.mobile.xs};
  border-radius: ${props => props.theme.borderRadius.small};
  min-width: ${props => props.theme.mobile?.touchTarget || '44px'};
  min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.white};
    outline-offset: 2px;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.mobile.lg};
`;

const SectionTitle = styled.h6`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.mobile.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: ${props => props.theme.spacing.mobile.md} 0 ${props => props.theme.spacing.mobile.sm} 0;
  padding: 0 ${props => props.theme.spacing.mobile.md};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.mobile.md};
  transition: all ${props => props.theme.transitions.short};
  position: relative;
  min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
  font-size: ${props => props.theme.typography.fontSizes.mobile.md};
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
  }
  
  &:focus {
    outline: none;
    background-color: ${props => props.theme.colors.grayLight};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary} inset;
  }
  
  ${props => props.active && `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.white};
    
    &:hover {
      background-color: ${props.theme.colors.primaryDark};
    }
  `}
  
  /* Remove hover effects on touch devices */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
    }
  }
`;

const MobileNavigation = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    // Close menu when a link is clicked
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={handleOverlayClick} />
      <MobileMenu isOpen={isOpen}>
        <MenuHeader>
          <MenuTitle>Navigation</MenuTitle>
          <CloseButton onClick={onClose} aria-label="Close navigation menu">
            <FaTimes />
          </CloseButton>
        </MenuHeader>
        <NavList>
          <NavSection>
            <SectionTitle>Training</SectionTitle>
            <NavItem>
              <NavLink to="/" active={isActive('/')} onClick={handleLinkClick}>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/plans" active={isActive('/plans')} onClick={handleLinkClick}>
                Trainingspläne
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/templates" active={isActive('/templates')} onClick={handleLinkClick}>
                Trainingsvorlagen
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/create-plan" active={isActive('/create-plan')} onClick={handleLinkClick}>
                Plan erstellen
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/workout-tracker" active={isActive('/workout-tracker')} onClick={handleLinkClick}>
                Workout Tracker
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/workout-history" active={isActive('/workout-history')} onClick={handleLinkClick}>
                Workout Historie
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/calendar" active={isActive('/calendar')} onClick={handleLinkClick}>
                Trainingskalender
              </NavLink>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>KI & Personalisierung</SectionTitle>
            <NavItem>
              <NavLink to="/personalized-plans" active={isActive('/personalized-plans')} onClick={handleLinkClick}>
                Personalisierte Pläne
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/periodization" active={isActive('/periodization')} onClick={handleLinkClick}>
                Periodisierung
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/ai-assistant" active={isActive('/ai-assistant')} onClick={handleLinkClick}>
                KI-Trainingsassistent
              </NavLink>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>Analyse & Fortschritt</SectionTitle>
            <NavItem>
              <NavLink to="/analysis" active={isActive('/analysis') || isActive('/progress')} onClick={handleLinkClick}>
                Trainingsanalyse
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/nutrition" active={isActive('/nutrition')} onClick={handleLinkClick}>
                Ernährung
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/gamification" active={isActive('/gamification')} onClick={handleLinkClick}>
                Erfolge & Belohnungen
              </NavLink>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>Ressourcen</SectionTitle>
            <NavItem>
              <NavLink to="/exercises" active={isActive('/exercises')} onClick={handleLinkClick}>
                Übungsbibliothek
              </NavLink>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>System</SectionTitle>
            <NavItem>
              <NavLink to="/settings" active={isActive('/settings')} onClick={handleLinkClick}>
                Einstellungen
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/data-import-export" active={isActive('/data-import-export')} onClick={handleLinkClick}>
                Backup & Datenmanagement
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/data-repair" active={isActive('/data-repair')} onClick={handleLinkClick}>
                Datenreparatur
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/feedback" active={isActive('/feedback')} onClick={handleLinkClick}>
                Feedback geben
              </NavLink>
            </NavItem>
          </NavSection>
        </NavList>
      </MobileMenu>
    </>
  );
};

export default MobileNavigation; 