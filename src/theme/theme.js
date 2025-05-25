const lightTheme = {  name: 'light',  colors: {    primary: '#1a73e8',    primaryDark: '#1557b0',    primaryLight: '#4285f4',    secondary: '#00c853',    secondaryDark: '#00a644',    secondaryLight: '#4caf50',    accent: '#f44336',    accentDark: '#d32f2f',    accentLight: '#ff5722',    warning: '#ff9800',    warningDark: '#f57c00',    warningLight: '#ffb74d',    success: '#4caf50',    successDark: '#388e3c',    successLight: '#81c784',    error: '#f44336',    errorDark: '#d32f2f',    errorLight: '#ef5350',    info: '#2196f3',    infoDark: '#1976d2',    infoLight: '#64b5f6',    gray: '#9e9e9e',    grayDark: '#616161',    grayLight: '#f5f5f5',    text: '#212121',    textLight: '#757575',    textDark: '#000000',    white: '#ffffff',    background: '#fafafa',    backgroundSecondary: '#f5f5f5',    cardBackground: '#ffffff',    border: '#e0e0e0',    borderLight: '#f0f0f0',    inputBackground: '#ffffff',    focus: '#1a73e8',    focusLight: 'rgba(26, 115, 232, 0.12)',  },
    shadows: {    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',    medium: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',    large: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',    focus: '0 0 0 3px rgba(26, 115, 232, 0.2)',    card: '0 2px 4px rgba(0, 0, 0, 0.1)',    hover: '0 4px 8px rgba(0, 0, 0, 0.15)',  },
    borderRadius: {    small: '6px',    medium: '8px',    large: '12px',    xl: '16px',    round: '50%',    pill: '9999px',  },
  // Responsive breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    // Mobile-specific spacing
    mobile: {
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      xxl: '2rem',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
      xxxl: '3rem',
      // Mobile-specific font sizes
      mobile: {
        xs: '0.625rem',
        sm: '0.75rem',
        md: '0.875rem',
        lg: '1rem',
        xl: '1.25rem',
        xxl: '1.5rem',
        xxxl: '2rem',
      },
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  // Mobile-specific dimensions
  mobile: {
    headerHeight: '60px',
    bottomNavHeight: '70px',
    sidebarWidth: '280px',
    touchTarget: '44px', // Minimum touch target size
  },
  transitions: {
    short: '0.2s',
    medium: '0.3s',
    long: '0.5s',
  },
  zIndices: {
    base: 1,
    dropdown: 10,
    sticky: 100,
    fixed: 300,
    modal: 500,
    tooltip: 700,
    overlay: 800,
    mobileSidebar: 900,
  },
};

const darkTheme = {
  ...lightTheme,
  name: 'dark',
  colors: {
    // Primary colors - restored dark blue theme
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#5dade2',
    
    // Secondary colors - keeping green for success states
    secondary: '#00c853',
    secondaryDark: '#00a644',
    secondaryLight: '#4caf50',
    
    // Accent colors - warm contrast for dark theme
    accent: '#f44336',
    accentDark: '#d32f2f',
    accentLight: '#ff5722',
    
    // Status colors - adjusted for dark backgrounds
    warning: '#ff9800',
    warningDark: '#f57c00',
    warningLight: '#ffb74d',
    success: '#4caf50',
    successDark: '#388e3c',
    successLight: '#81c784',
    error: '#f44336',
    errorDark: '#d32f2f',
    errorLight: '#ef5350',
    info: '#2196f3',
    infoDark: '#1976d2',
    infoLight: '#64b5f6',
    
    // Gray scale - carefully chosen for dark theme
    gray: '#9e9e9e',
    grayDark: '#616161',
    grayLight: '#37474f',
    
    // Text colors - high contrast for readability
    text: '#ecf0f1',
    textLight: '#bdc3c7',
    textDark: '#ffffff',
    white: '#ffffff',
    
    // Background colors - dark blue theme
    background: '#1e272e',
    backgroundSecondary: '#2f3640',
    cardBackground: '#2f3640',
    
    // Border colors - subtle but visible
    border: '#4b6584',
    borderLight: '#57606f',
    
    // Input specific
    inputBackground: '#2f3640',
    
    // Focus states
    focus: '#3498db',
    focusLight: 'rgba(52, 152, 219, 0.12)',
  },
  shadows: {
    // Dark theme shadows - optimized for dark blue background
    small: '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.5)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.5), 0 3px 6px rgba(0, 0, 0, 0.6)',
    large: '0 10px 20px rgba(0, 0, 0, 0.6), 0 6px 6px rgba(0, 0, 0, 0.7)',
    focus: '0 0 0 3px rgba(52, 152, 219, 0.3)',
    card: '0 2px 4px rgba(0, 0, 0, 0.4)',
    hover: '0 4px 8px rgba(0, 0, 0, 0.5)',
  },
};

// Blue theme with more vivid blue colors
const blueTheme = {
  ...lightTheme,
  name: 'blue',
  colors: {
    ...lightTheme.colors,
    primary: '#1e88e5',
    primaryDark: '#0d47a1',
    primaryLight: '#64b5f6',
    secondary: '#00acc1',
    secondaryDark: '#007c91',
    secondaryLight: '#5ddef4',
    accent: '#ff6d00',
    accentDark: '#c43e00',
    accentLight: '#ff9e40',
    text: '#263238',
    textLight: '#455a64',
    background: '#e3f2fd',
    cardBackground: '#ffffff',
    border: '#bbdefb',
  },
};

// Green theme with nature-inspired colors
const greenTheme = {
  ...lightTheme,
  name: 'green',
  colors: {
    ...lightTheme.colors,
    primary: '#256d28',
    primaryDark: '#19501c',
    primaryLight: '#66bb6a',
    secondary: '#00897b',
    secondaryDark: '#00695c',
    secondaryLight: '#4db6ac',
    accent: '#ff5722',
    accentDark: '#d84315',
    accentLight: '#ff8a65',
    text: '#1b5e20',
    textLight: '#2e7d32',
    background: '#e8f5e9',
    cardBackground: '#ffffff',
    border: '#c8e6c9',
  },
};

export { lightTheme, darkTheme, blueTheme, greenTheme };
export default lightTheme; 