import React from 'react';
import styled from 'styled-components';
import Card from '../components/ui/Card';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';
import ViewCustomizer from '../components/ui/ViewCustomizer';
import { useTheme } from '../theme/ThemeProvider';

const SettingsContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SettingsHeader = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  grid-column: 1 / -1;
`;

const SettingSection = styled(Card)`
  height: fit-content;
`;

const Settings = () => {
  const { userPreferences } = useTheme();
  
  return (
    <div>
      <SettingsContainer className={userPreferences.compactMode ? 'compact-mode' : ''}>
        <SettingsHeader>Einstellungen</SettingsHeader>
        
        <SettingSection>
          <ThemeSwitcher />
        </SettingSection>
        
        <SettingSection>
          <ViewCustomizer />
        </SettingSection>
      </SettingsContainer>
    </div>
  );
};

export default Settings; 