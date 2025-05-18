import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../theme/ThemeProvider';
import Button from './Button';

const ThemeSwitcherContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
`;

const ThemeOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.selected ? props.theme.colors.primaryLight : 'transparent'};
  
  &:hover {
    background-color: ${props => !props.selected ? props.theme.colors.grayLight : props.theme.colors.primaryLight};
  }
`;

const ColorPreview = styled.div`
  display: flex;
  gap: 4px;
`;

const ColorSwatch = styled.div`
  width: 16px;
  height: 16px;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.color};
  border: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  color: ${props => props.theme.colors.text};
`;

const ThemeSwitcher = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  
  return (
    <ThemeSwitcherContainer>
      <Title>Wähle dein Theme</Title>
      
      {availableThemes.map((themeName) => (
        <ThemeOption 
          key={themeName.id} 
          selected={theme === themeName.id}
          onClick={() => setTheme(themeName.id)}
        >
          <ColorPreview>
            <ColorSwatch color={themeName.preview.primary} />
            <ColorSwatch color={themeName.preview.background} />
            <ColorSwatch color={themeName.preview.accent} />
          </ColorPreview>
          {themeName.name}
        </ThemeOption>
      ))}
    </ThemeSwitcherContainer>
  );
};

export default ThemeSwitcher; 