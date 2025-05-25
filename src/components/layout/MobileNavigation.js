import React, { useEffect } from 'react';
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
  display: ${props => props.isOpen ? 'block' : 'none'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity ${props => props.theme.transitions.medium};
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${props => props.theme.mobile?.sidebarWidth || '280px'};
  max-width: 85vw;
  background-color: ${props => props.theme.colors.cardBackground};
  z-index: ${props => props.theme.zIndices.mobileSidebar};
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform ${props => props.theme.transitions.medium};
  box-shadow: ${props => props.theme.shadows.large};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const MobileMenuHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: ${props => props.theme.mobile?.headerHeight || '60px'};
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
  
  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname, isOpen, onClose]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <MobileMenu isOpen={isOpen}>
        <MobileMenuHeader>
          <MenuTitle>FitTrack</MenuTitle>
          <CloseButton onClick={onClose} aria-label="Close navigation menu">
            <FaTimes />
          </CloseButton>
        </MobileMenuHeader>
        
        <NavList>
          <NavSection>
            <SectionTitle>Training</SectionTitle>
            <NavItem>
              <NavLink to="/" active={isActive('/')}>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/plans" active={isActive('/plans')}>
                Trainingspläne
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/templates" active={isActive('/templates')}>
                Trainingsvorlagen
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/create-plan" active={isActive('/create-plan')}>
                Plan erstellen
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/workout-tracker" active={isActive('/workout-tracker')}>
                Workout Tracker
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/workout-history" active={isActive('/workout-history')}>
                Workout Historie
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/calendar" active={isActive('/calendar')}>
                Trainingskalender
              </NavLink>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>KI & Personalisierung</SectionTitle>
            <NavItem>
              <NavLink to="/personalized-plans" active={isActive('/personalized-plans')}>
                Personalisierte Pläne
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/periodization" active={isActive('/periodization')}>
                Periodisierung
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/ai-assistant" active={isActive('/ai-assistant')}>
                KI-Trainingsassistent
              </NavLink>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>Analyse & Fortschritt</SectionTitle>
            <NavItem>
              <NavLink to="/analysis" active={isActive('/analysis') || isActive('/progress')}>
                Trainingsanalyse
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/nutrition" active={isActive('/nutrition')}>
                Ernährung
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/gamification" active={isActive('/gamification')}>
                Erfolge & Belohnungen
              </NavLink>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>Ressourcen</SectionTitle>
            <NavItem>
              <NavLink to="/exercises" active={isActive('/exercises')}>
                Übungsbibliothek
              </NavLink>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>System</SectionTitle>
            <NavItem>
              <NavLink to="/settings" active={isActive('/settings')}>
                Einstellungen
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/data-import-export" active={isActive('/data-import-export')}>
                Backup & Datenmanagement
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/data-repair" active={isActive('/data-repair')}>
                Datenreparatur
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/feedback" active={isActive('/feedback')}>
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