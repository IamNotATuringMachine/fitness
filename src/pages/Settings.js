import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
  padding: ${props => props.theme.spacing.lg};
`;

const SectionHeader = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AdminLink = styled(Link)`
  display: inline-block;
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.default};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
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
        
        <SettingSection>
          <SectionHeader>Administration</SectionHeader>
          <SectionDescription>
            Zugriff auf administrative Funktionen für Systemverwalter.
          </SectionDescription>
          <AdminLink to="/feedback-management">Feedback-Management</AdminLink>
        </SettingSection>
      </SettingsContainer>
    </div>
  );
};

export default Settings; 