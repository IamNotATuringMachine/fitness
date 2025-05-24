import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../theme/ThemeProvider';
import { Link } from 'react-router-dom';
import { FaCog, FaSun, FaMoon } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: ${props => props.theme.zIndices.sticky};
  position: relative;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  color: ${props => props.theme.colors.primary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
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
  
  &:hover {
    background-color: ${props => props.theme.colors.grayLight};
  }
  
  &:focus {
    outline: none;
    background-color: ${props => props.theme.colors.grayLight};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary} inset;
  }
`;

const SettingsLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
`;

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <HeaderContainer>
      <HeaderTitle>FitnessPro</HeaderTitle>
      <HeaderActions>
        <IconButton onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
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