import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../theme/ThemeProvider';

const SidebarContainer = styled.aside`
  background-color: ${props => props.theme.colors.cardBackground};
  width: ${props => props.collapsed ? '70px' : '250px'};
  height: 100%;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.small};
  transition: all ${props => props.theme.transitions.medium};
  position: relative;
  z-index: ${props => props.theme.zIndices.sticky};
  
  /* Hide sidebar on mobile devices */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
  
  /* Optimize scrolling on touch devices */
  -webkit-overflow-scrolling: touch;
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  margin: 0;
  color: ${props => props.theme.colors.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity ${props => props.theme.transitions.short};
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  transition: all ${props => props.theme.transitions.short};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary} inset;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: ${props => props.collapsed ? `${props.theme.spacing.md} 0` : props.theme.spacing.md};
  margin: 0;
`;

const NavSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SectionTitle = styled.h6`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: ${props => props.theme.spacing.sm} 0;
  padding: 0 ${props => props.theme.spacing.md};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const NavItem = styled.li`
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.short};
  position: relative;

  // Default (expanded) padding and hover effect
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  border-radius: ${props => props.theme.borderRadius.small};

  &:hover {
    background-color: ${props => !props.collapsed ? props.theme.colors.grayLight : 'transparent'};
    transform: ${props => !props.collapsed ? 'translateX(4px)' : 'none'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary} inset;
  }
  
  span { // Text label
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: ${props => props.collapsed ? 'none' : 'inline'};
  }
  
  ${props => props.collapsed && `
    padding: ${props.theme.spacing.md} 0; // Vertical padding, use full width
    justify-content: center; // Center the (now invisible) content area where tooltip attaches
    min-height: 50px; // Make it a substantial clickable block
    border-radius: 0; // Flat look for collapsed items

    &::after { // Tooltip
      content: attr(data-tooltip);
      position: absolute;
      left: calc(100% + 5px); // Position next to the 70px bar
      top: 50%;
      transform: translateY(-50%);
      background-color: ${props.theme.colors.text}; // Tooltip background
      color: ${props.theme.colors.background};       // Tooltip text color
      padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
      border-radius: ${props.theme.borderRadius.small};
      font-size: ${props.theme.typography.fontSizes.sm};
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity ${props.theme.transitions.short} ease-in-out;
      z-index: ${props.theme.zIndices.tooltip || 1000}; // Ensure tooltip is on top
      box-shadow: ${props.theme.shadows.small}; // Add a little shadow to tooltip
    }

    &:hover::after {
      opacity: 1;
      transition-delay: 0.3s; // Slight delay before tooltip appears
    }
  `}
  
  ${props => props.active && `
    background-color: ${!props.collapsed ? props.theme.colors.primary : 'transparent'};
    color: ${!props.collapsed ? props.theme.colors.white : props.theme.colors.text};
    
    &:hover { // For active items
      background-color: ${!props.collapsed ? props.theme.colors.primaryDark : 'transparent'};
      color: ${!props.collapsed ? props.theme.colors.white : props.theme.colors.text}; // Ensure text color reverts on hover if not expanded
    }

    // When collapsed and active, still use primary color for tooltip indication or a subtle border if preferred
    ${props.collapsed && `
      // Option 1: If you want a very subtle indicator, like a left border
      // border-left: 3px solid ${props.theme.colors.primary};
      // Option 2: Or rely purely on tooltip for active state when collapsed
      // No specific background for active item when collapsed to keep it clean
    `}
  `}
`;

const Sidebar = () => {
  const location = useLocation();
  const { /* theme, */ /* toggleTheme, */ userPreferences, updateUserPreferences } = useTheme();
  const collapsed = userPreferences.sidebarCollapsed;
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const toggleSidebar = () => {
    updateUserPreferences({ sidebarCollapsed: !collapsed });
  };
  
  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader>
        <Logo collapsed={collapsed}>{collapsed ? '' : 'FitTrack'}</Logo>
        <CollapseButton onClick={toggleSidebar} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? '→' : '←'}
        </CollapseButton>
      </SidebarHeader>
      
      <NavList>
        <NavSection>
          <SectionTitle collapsed={collapsed}>Training</SectionTitle>
          <NavItem>
            <NavLink to="/" active={isActive('/')} collapsed={collapsed} data-tooltip="Dashboard">
              <span>Dashboard</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/plans" active={isActive('/plans')} collapsed={collapsed} data-tooltip="Trainingspläne">
              <span>Trainingspläne</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/templates" active={isActive('/templates')} collapsed={collapsed} data-tooltip="Trainingsvorlagen">
              <span>Trainingsvorlagen</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/create-plan" active={isActive('/create-plan')} collapsed={collapsed} data-tooltip="Plan erstellen">
              <span>Plan erstellen</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/workout-tracker" active={isActive('/workout-tracker')} collapsed={collapsed} data-tooltip="Workout Tracker">
              <span>Workout Tracker</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/workout-history" active={isActive('/workout-history')} collapsed={collapsed} data-tooltip="Workout Historie">
              <span>Workout Historie</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/calendar" active={isActive('/calendar')} collapsed={collapsed} data-tooltip="Trainingskalender">
              <span>Trainingskalender</span>
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle collapsed={collapsed}>KI & Personalisierung</SectionTitle>
          <NavItem>
            <NavLink to="/personalized-plans" active={isActive('/personalized-plans')} collapsed={collapsed} data-tooltip="Personalisierte Pläne">
              <span>Personalisierte Pläne</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/periodization" active={isActive('/periodization')} collapsed={collapsed} data-tooltip="Periodisierung">
              <span>Periodisierung</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/ai-assistant" active={isActive('/ai-assistant')} collapsed={collapsed} data-tooltip="KI-Trainingsassistent">
              <span>KI-Trainingsassistent</span>
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle collapsed={collapsed}>Analyse & Fortschritt</SectionTitle>
          <NavItem>
            <NavLink to="/analysis" active={isActive('/analysis') || isActive('/progress')} collapsed={collapsed} data-tooltip="Trainingsanalyse">
              <span>Trainingsanalyse</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/nutrition" active={isActive('/nutrition')} collapsed={collapsed} data-tooltip="Ernährung">
              <span>Ernährung</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/gamification" active={isActive('/gamification')} collapsed={collapsed} data-tooltip="Erfolge & Belohnungen">
              <span>Erfolge & Belohnungen</span>
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle collapsed={collapsed}>Ressourcen</SectionTitle>
          <NavItem>
            <NavLink to="/exercises" active={isActive('/exercises')} collapsed={collapsed} data-tooltip="Übungsbibliothek">
              <span>Übungsbibliothek</span>
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle collapsed={collapsed}>System</SectionTitle>
          <NavItem>
            <NavLink to="/settings" active={isActive('/settings')} collapsed={collapsed} data-tooltip="Einstellungen">
              <span>Einstellungen</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/data-import-export" active={isActive('/data-import-export')} collapsed={collapsed} data-tooltip="Backup & Datenmanagement">
              <span>Backup & Datenmanagement</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/data-repair" active={isActive('/data-repair')} collapsed={collapsed} data-tooltip="Datenreparatur">
              <span>Datenreparatur</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/feedback" active={isActive('/feedback')} collapsed={collapsed} data-tooltip="Feedback geben">
              <span>Feedback geben</span>
            </NavLink>
          </NavItem>
        </NavSection>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar; 