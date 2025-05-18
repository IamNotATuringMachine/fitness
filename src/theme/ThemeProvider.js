import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, blueTheme, greenTheme } from './theme';
import GlobalStyles from './GlobalStyles';

// Theme definitions with preview colors for the theme switcher
const themeOptions = [
  { 
    id: 'light', 
    name: 'Light', 
    theme: lightTheme,
    preview: {
      primary: lightTheme.colors.primary,
      background: lightTheme.colors.background,
      accent: lightTheme.colors.accent
    }
  },
  { 
    id: 'dark', 
    name: 'Dark', 
    theme: darkTheme,
    preview: {
      primary: darkTheme.colors.primary,
      background: darkTheme.colors.background,
      accent: darkTheme.colors.accent
    }
  },
  { 
    id: 'blue', 
    name: 'Blue', 
    theme: blueTheme,
    preview: {
      primary: blueTheme.colors.primary,
      background: blueTheme.colors.background,
      accent: blueTheme.colors.accent
    }
  },
  { 
    id: 'green', 
    name: 'Green', 
    theme: greenTheme,
    preview: {
      primary: greenTheme.colors.primary,
      background: greenTheme.colors.background,
      accent: greenTheme.colors.accent
    }
  }
];

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  availableThemes: themeOptions,
  userPreferences: {},
  updateUserPreferences: () => {}
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [userPreferences, setUserPreferences] = useState({
    dashboardLayout: 'grid', // can be 'grid' or 'list'
    sidebarCollapsed: false,
    compactMode: false,
    showDetailedStats: true
  });
  
  // Check if user has saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('fitnessAppTheme');
    const savedPreferences = localStorage.getItem('fitnessAppPreferences');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference as fallback
      setTheme('dark');
    }
    
    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error('Failed to parse saved preferences', e);
      }
    }
  }, []);
  
  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('fitnessAppTheme', theme);
    localStorage.setItem('fitnessAppPreferences', JSON.stringify(userPreferences));
  }, [theme, userPreferences]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const updateUserPreferences = (newPreferences) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };
  
  // Find the current theme object
  const currentTheme = themeOptions.find(t => t.id === theme)?.theme || lightTheme;
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      availableThemes: themeOptions,
      userPreferences,
      updateUserPreferences
    }}>
      <StyledThemeProvider theme={currentTheme}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 