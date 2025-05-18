import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../theme/ThemeProvider';
import Button from './Button';

const CustomizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const OptionLabel = styled.label`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
`;

const Title = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  color: ${props => props.theme.colors.text};
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  width: 40px;
  height: 20px;
  appearance: none;
  background-color: ${props => props.checked ? props.theme.colors.primary : props.theme.colors.gray};
  border-radius: 20px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:checked {
    background-color: ${props => props.theme.colors.primary};
  }
  
  &:before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all ${props => props.theme.transitions.short};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
  margin-right: ${props => props.theme.spacing.sm};
`;

const ViewCustomizer = () => {
  const { userPreferences, updateUserPreferences } = useTheme();
  
  const handleToggleChange = (event) => {
    const { name, checked } = event.target;
    updateUserPreferences({ [name]: checked });
  };
  
  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    updateUserPreferences({ [name]: value });
  };
  
  return (
    <CustomizerContainer>
      <Title>Ansicht anpassen</Title>
      
      <OptionGroup>
        <div>
          <Title as="h4">Dashboard-Layout</Title>
          <OptionLabel>
            <RadioInput
              name="dashboardLayout"
              value="grid"
              checked={userPreferences.dashboardLayout === 'grid'}
              onChange={handleRadioChange}
            />
            Grid-Ansicht
          </OptionLabel>
          <OptionLabel>
            <RadioInput
              name="dashboardLayout"
              value="list"
              checked={userPreferences.dashboardLayout === 'list'}
              onChange={handleRadioChange}
            />
            Listen-Ansicht
          </OptionLabel>
        </div>
      </OptionGroup>
      
      <OptionGroup>
        <OptionLabel>
          <ToggleSwitch
            name="compactMode"
            checked={userPreferences.compactMode}
            onChange={handleToggleChange}
          />
          Kompakter Modus
        </OptionLabel>
        
        <OptionLabel>
          <ToggleSwitch
            name="showDetailedStats"
            checked={userPreferences.showDetailedStats}
            onChange={handleToggleChange}
          />
          Detaillierte Statistiken anzeigen
        </OptionLabel>
        
        <OptionLabel>
          <ToggleSwitch
            name="sidebarCollapsed"
            checked={userPreferences.sidebarCollapsed}
            onChange={handleToggleChange}
          />
          Seitenleiste minimieren
        </OptionLabel>
      </OptionGroup>
    </CustomizerContainer>
  );
};

export default ViewCustomizer; 