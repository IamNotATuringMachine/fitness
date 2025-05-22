import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${props => props.theme.typography.fontFamily};
    font-size: ${props => props.theme.typography.fontSizes.md};
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
    line-height: 1.6;
    transition: background-color ${props => props.theme.transitions.medium};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${props => props.theme.typography.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text};
  }
  
  h1 {
    font-size: ${props => props.theme.typography.fontSizes.xxxl};
  }
  
  h2 {
    font-size: ${props => props.theme.typography.fontSizes.xxl};
  }
  
  h3 {
    font-size: ${props => props.theme.typography.fontSizes.xl};
  }
  
  h4 {
    font-size: ${props => props.theme.typography.fontSizes.lg};
  }
  
  h5 {
    font-size: ${props => props.theme.typography.fontSizes.md};
  }
  
  p {
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color ${props => props.theme.transitions.short};
    
    &:hover {
      color: ${props => props.theme.colors.primaryDark};
    }
    
    &:focus {
      outline: 2px solid ${props => props.theme.colors.primary};
      outline-offset: 2px;
    }
  }
  
  button {
    font-family: ${props => props.theme.typography.fontFamily};
  }
  
  input, select, textarea {
    font-family: ${props => props.theme.typography.fontFamily};
    font-size: ${props => props.theme.typography.fontSizes.md};
    padding: ${props => props.theme.spacing.sm};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.medium};
    transition: border-color ${props => props.theme.transitions.short}, box-shadow ${props => props.theme.transitions.short};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}40`}; /* Using 40 for slightly more subtle than button's 50 */
    }
  }
  
  ul, ol {
    margin-bottom: ${props => props.theme.spacing.md};
    padding-left: ${props => props.theme.spacing.xl};
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  ::selection {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }
  
  /* Compact Mode Styles */
  .compact-mode {
    h1 {
      font-size: ${props => props.theme.typography.fontSizes.xxl};
      margin-bottom: ${props => props.theme.spacing.sm};
    }
    
    h2 {
      font-size: ${props => props.theme.typography.fontSizes.xl};
      margin-bottom: ${props => props.theme.spacing.sm};
    }
    
    h3 {
      font-size: ${props => props.theme.typography.fontSizes.lg};
      margin-bottom: ${props => props.theme.spacing.xs};
    }
    
    p {
      margin-bottom: ${props => props.theme.spacing.sm};
    }
    
    .card {
      padding: ${props => props.theme.spacing.sm};
    }
    
    .card-header {
      padding: ${props => props.theme.spacing.sm};
    }
    
    .card-body {
      padding: ${props => props.theme.spacing.sm};
    }
    
    .card-footer {
      padding: ${props => props.theme.spacing.sm};
    }
    
    /* Reduce spacing in all components */
    div, section, article, main {
      gap: ${props => props.theme.spacing.sm} !important;
      margin-bottom: ${props => props.theme.spacing.sm};
      
      & > * {
        margin-bottom: ${props => props.theme.spacing.xs};
      }
    }
  }
`;

export default GlobalStyles; 