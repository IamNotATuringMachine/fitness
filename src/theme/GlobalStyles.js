import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    /* Improve text rendering on mobile */
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    /* Enable smooth scrolling */
    scroll-behavior: smooth;
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
    /* Prevent horizontal scrolling on mobile */
    overflow-x: hidden;
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSizes.mobile.md};
      line-height: 1.5;
    }
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${props => props.theme.typography.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      margin-bottom: ${props => props.theme.spacing.mobile.md};
    }
  }
  
  h1 {
    font-size: ${props => props.theme.typography.fontSizes.xxxl};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSizes.mobile.xxxl};
    }
  }
  
  h2 {
    font-size: ${props => props.theme.typography.fontSizes.xxl};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSizes.mobile.xxl};
    }
  }
  
  h3 {
    font-size: ${props => props.theme.typography.fontSizes.xl};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSizes.mobile.xl};
    }
  }
  
  h4 {
    font-size: ${props => props.theme.typography.fontSizes.lg};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSizes.mobile.lg};
    }
  }
  
  h5 {
    font-size: ${props => props.theme.typography.fontSizes.md};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSizes.mobile.md};
    }
  }
  
  p {
    margin-bottom: ${props => props.theme.spacing.md};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      margin-bottom: ${props => props.theme.spacing.mobile.md};
      font-size: ${props => props.theme.typography.fontSizes.mobile.md};
    }
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color ${props => props.theme.transitions.short};
    /* Improve touch targets on mobile */
    min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
    display: inline-flex;
    align-items: center;
    
    &:hover {
      color: ${props => props.theme.colors.primaryDark};
    }
    
    &:focus {
      outline: 2px solid ${props => props.theme.colors.primary};
      outline-offset: 2px;
    }
    
    /* Remove hover effects on touch devices */
    @media (hover: none) and (pointer: coarse) {
      &:hover {
        color: ${props => props.theme.colors.primary};
      }
    }
  }
  
  button {
    font-family: ${props => props.theme.typography.fontFamily};
    /* Ensure buttons are touch-friendly */
    min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
    cursor: pointer;
    
    /* Remove default button styling on iOS */
    -webkit-appearance: none;
    border-radius: ${props => props.theme.borderRadius.medium};
    
    /* Remove hover effects on touch devices */
    @media (hover: none) and (pointer: coarse) {
      &:hover {
        transform: none;
      }
    }
  }
  
  input, select, textarea {
    font-family: ${props => props.theme.typography.fontFamily};
    font-size: ${props => props.theme.typography.fontSizes.md};
    padding: ${props => props.theme.spacing.sm};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.medium};
    background-color: ${props => props.theme.colors.inputBackground};
    color: ${props => props.theme.colors.text};
    transition: border-color ${props => props.theme.transitions.short}, box-shadow ${props => props.theme.transitions.short};
    /* Improve touch targets */
    min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSizes.mobile.md};
      padding: ${props => props.theme.spacing.mobile.sm};
    }

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}40`}; /* Using 40 for slightly more subtle than button's 50 */
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textLight};
    }
  }
  
  ul, ol {
    margin-bottom: ${props => props.theme.spacing.md};
    padding-left: ${props => props.theme.spacing.xl};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      margin-bottom: ${props => props.theme.spacing.mobile.md};
      padding-left: ${props => props.theme.spacing.mobile.xl};
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  ::selection {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }
  
  /* Custom scrollbar for dark mode */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textLight};
  }
  
  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.colors.border} ${props => props.theme.colors.backgroundSecondary};
  }
  
  /* Mobile-specific optimizations */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    /* Improve tap targets */
    * {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
    }
    
    /* Optimize for mobile scrolling */
    body {
      -webkit-overflow-scrolling: touch;
    }
    
    /* Better mobile form styling */
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="number"],
    input[type="tel"],
    input[type="search"],
    textarea,
    select {
      -webkit-appearance: none;
      border-radius: ${props => props.theme.borderRadius.medium};
      background-color: ${props => props.theme.colors.inputBackground};
    }
    
    /* Prevent mobile menu interference during theme changes */
    [class*="Overlay"]:not([data-visible="true"]),
    [class*="MobileMenu"]:not([data-visible="true"]) {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    
    /* Ensure theme toggle doesn't trigger mobile menu */
    button[aria-label*="Dark Mode"],
    button[aria-label*="Light Mode"] {
      isolation: isolate;
      z-index: ${props => props.theme.zIndices.sticky + 1};
    }
  }

  /* Compact Mode Styles */
  .compact-mode {
    h1 {
      font-size: ${props => props.theme.typography.fontSizes.xxl};
      margin-bottom: ${props => props.theme.spacing.sm};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        font-size: ${props => props.theme.typography.fontSizes.mobile.xxl};
        margin-bottom: ${props => props.theme.spacing.mobile.sm};
      }
    }
    
    h2 {
      font-size: ${props => props.theme.typography.fontSizes.xl};
      margin-bottom: ${props => props.theme.spacing.sm};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        font-size: ${props => props.theme.typography.fontSizes.mobile.xl};
        margin-bottom: ${props => props.theme.spacing.mobile.sm};
      }
    }
    
    h3 {
      font-size: ${props => props.theme.typography.fontSizes.lg};
      margin-bottom: ${props => props.theme.spacing.xs};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        font-size: ${props => props.theme.typography.fontSizes.mobile.lg};
        margin-bottom: ${props => props.theme.spacing.mobile.xs};
      }
    }
    
    p {
      margin-bottom: ${props => props.theme.spacing.sm};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        margin-bottom: ${props => props.theme.spacing.mobile.sm};
      }
    }
    
    .card {
      padding: ${props => props.theme.spacing.sm};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        padding: ${props => props.theme.spacing.mobile.sm};
      }
    }
    
    .card-header {
      padding: ${props => props.theme.spacing.sm};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        padding: ${props => props.theme.spacing.mobile.sm};
      }
    }
    
    .card-body {
      padding: ${props => props.theme.spacing.sm};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        padding: ${props => props.theme.spacing.mobile.sm};
      }
    }
    
    .card-footer {
      padding: ${props => props.theme.spacing.sm};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        padding: ${props => props.theme.spacing.mobile.sm};
      }
    }
    
    /* Reduce spacing in all components */
    div, section, article, main {
      gap: ${props => props.theme.spacing.sm} !important;
      margin-bottom: ${props => props.theme.spacing.sm};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        gap: ${props => props.theme.spacing.mobile.sm} !important;
        margin-bottom: ${props => props.theme.spacing.mobile.sm};
      }
      
      & > * {
        margin-bottom: ${props => props.theme.spacing.xs};
        
        @media (max-width: ${props => props.theme.breakpoints.tablet}) {
          margin-bottom: ${props => props.theme.spacing.mobile.xs};
        }
      }
    }
  }
`;

export default GlobalStyles; 