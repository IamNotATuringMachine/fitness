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
`;

const LogoContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  margin: 0;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NavList = styled.ul`
  list-style: none;
  padding: ${props => props.theme.spacing.md};
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
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
    transform: translateX(4px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary} inset;
  }
  
  svg {
    margin-right: ${props => props.collapsed ? '0' : props.theme.spacing.sm};
    font-size: 1.2rem;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.white} inset;
  }
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: ${props => props.collapsed ? 'none' : 'inline'};
  }
  
  ${props => props.active && `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.white};
    
    &:hover {
      background-color: ${props.theme.colors.primaryDark};
    }
  `}
`;

const ThemeToggleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: center;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  font-family: inherit;
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary} inset;
  }
  
  svg {
    margin-right: ${props => props.collapsed ? '0' : props.theme.spacing.sm};
  }
  
  span {
    display: ${props => props.collapsed ? 'none' : 'inline'};
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme, userPreferences } = useTheme();
  const collapsed = userPreferences.sidebarCollapsed;
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <SidebarContainer collapsed={collapsed}>
      <LogoContainer>
        <Logo>{collapsed ? 'F' : 'FitTrack'}</Logo>
      </LogoContainer>
      
      <NavList>
        <NavSection>
          <SectionTitle collapsed={collapsed}>Training</SectionTitle>
          <NavItem>
            <NavLink to="/" active={isActive('/')} collapsed={collapsed}>
              {collapsed ? '📊' : <span>📊 Dashboard</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/plans" active={isActive('/plans')} collapsed={collapsed}>
              {collapsed ? '📝' : <span>📝 Trainingspläne</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/templates" active={isActive('/templates')} collapsed={collapsed}>
              {collapsed ? '📋' : <span>📋 Trainingsvorlagen</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/create-plan" active={isActive('/create-plan')} collapsed={collapsed}>
              {collapsed ? '➕' : <span>➕ Plan erstellen</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/workout-tracker" active={isActive('/workout-tracker')} collapsed={collapsed}>
              {collapsed ? '📝' : <span>📝 Workout Tracker</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/calendar" active={isActive('/calendar')} collapsed={collapsed}>
              {collapsed ? '📅' : <span>📅 Trainingskalender</span>}
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle collapsed={collapsed}>KI & Personalisierung</SectionTitle>
          <NavItem>
            <NavLink to="/personalized-plans" active={isActive('/personalized-plans')} collapsed={collapsed}>
              {collapsed ? '🎯' : <span>🎯 Personalisierte Pläne</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/periodization" active={isActive('/periodization')} collapsed={collapsed}>
              {collapsed ? '📈' : <span>📈 Periodisierung</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/ai-assistant" active={isActive('/ai-assistant')} collapsed={collapsed}>
              {collapsed ? '🤖' : <span>🤖 KI-Trainingsassistent</span>}
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle collapsed={collapsed}>Analyse & Ernährung</SectionTitle>
          <NavItem>
            <NavLink to="/progress" active={isActive('/progress')} collapsed={collapsed}>
              {collapsed ? '📊' : <span>📊 Fortschrittsverfolgung</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/analysis" active={isActive('/analysis')} collapsed={collapsed}>
              {collapsed ? '📉' : <span>📉 Trainingsanalyse</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/nutrition" active={isActive('/nutrition')} collapsed={collapsed}>
              {collapsed ? '🍎' : <span>🍎 Ernährung</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/gamification" active={isActive('/gamification')} collapsed={collapsed}>
              {collapsed ? '🏆' : <span>🏆 Erfolge & Belohnungen</span>}
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle collapsed={collapsed}>Ressourcen</SectionTitle>
          <NavItem>
            <NavLink to="/exercises" active={isActive('/exercises')} collapsed={collapsed}>
              {collapsed ? '💪' : <span>💪 Übungsbibliothek</span>}
            </NavLink>
          </NavItem>
        </NavSection>
        
        <NavSection>
          <SectionTitle collapsed={collapsed}>System</SectionTitle>
          <NavItem>
            <NavLink to="/settings" active={isActive('/settings')} collapsed={collapsed}>
              {collapsed ? '⚙️' : <span>⚙️ Einstellungen</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/data-import-export" active={isActive('/data-import-export')} collapsed={collapsed}>
              {collapsed ? '📤' : <span>📤 Datenimport/-export</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/data-repair" active={isActive('/data-repair')} collapsed={collapsed}>
              {collapsed ? '🔧' : <span>🔧 Datenreparatur</span>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/feedback" active={isActive('/feedback')} collapsed={collapsed}>
              {collapsed ? '💬' : <span>💬 Feedback geben</span>}
            </NavLink>
          </NavItem>
        </NavSection>
      </NavList>
      
      <ThemeToggleContainer>
        <ThemeToggle onClick={toggleTheme} collapsed={collapsed}>
          {theme === 'light' 
            ? (collapsed ? '🌙' : <span>🌙 Dunkelmodus</span>)
            : (collapsed ? '☀️' : <span>☀️ Hellmodus</span>)
          }
        </ThemeToggle>
      </ThemeToggleContainer>
    </SidebarContainer>
  );
};

export default Sidebar; 