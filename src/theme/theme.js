const lightTheme = {
  colors: {
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#85c1e9',
    secondary: '#2ecc71',
    secondaryDark: '#27ae60',
    secondaryLight: '#82e0aa',
    accent: '#e74c3c',
    accentDark: '#c0392b',
    accentLight: '#f1948a',
    warning: '#f39c12',
    warningDark: '#d35400',
    warningLight: '#f8c471',
    gray: '#95a5a6',
    grayDark: '#7f8c8d',
    grayLight: '#ecf0f1',
    text: '#2c3e50',
    textLight: '#34495e',
    white: '#ffffff',
    background: '#f8f9fa',
    cardBackground: '#ffffff',
    border: '#dfe4ea',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', sans-serif",
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
      xxxl: '3rem',
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
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
  },
};

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#2c3e50',
    text: '#ecf0f1',
    textLight: '#bdc3c7',
    background: '#1e272e',
    cardBackground: '#2f3640',
    border: '#4b6584',
  },
};

// Blue theme with more vivid blue colors
const blueTheme = {
  ...lightTheme,
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
  colors: {
    ...lightTheme.colors,
    primary: '#43a047',
    primaryDark: '#2e7d32',
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