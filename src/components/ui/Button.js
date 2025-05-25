import React from 'react';
import styled from 'styled-components';

const ButtonStyles = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    if (props.$variant === 'primary' && props.theme.name === 'blue') {
      return `linear-gradient(to bottom, ${props.theme.colors.primaryLight}, ${props.theme.colors.primary})`;
    }
    if (props.$variant === 'primary') return props.theme.colors.primary;
    if (props.$variant === 'secondary') return props.theme.colors.secondary;
    if (props.$variant === 'accent') return props.theme.colors.accent;
    if (props.$variant === 'warning') return props.theme.colors.warning;
    if (props.$variant === 'outlined') return 'transparent';
    return props.theme.colors.primary;
  }};
  color: ${props => {
    if (props.$variant === 'outlined') return props.theme.colors.primary;
    return props.theme.colors.white;
  }};
  border: ${props => props.$variant === 'outlined' 
    ? `2px solid ${props.theme.colors.primary}` 
    : 'none'
  };
  padding: ${props => props.$size === 'small' 
    ? `${props.theme.spacing.xs} ${props.theme.spacing.sm}` 
    : props.$size === 'large' 
      ? `${props.theme.spacing.md} ${props.theme.spacing.lg}` 
      : `${props.theme.spacing.sm} ${props.theme.spacing.md}`
  };
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${props => {
    if (props.$size === 'small') return props.theme.typography.fontSizes.sm;
    if (props.$size === 'large') return props.theme.typography.fontSizes.lg;
    return props.theme.typography.fontSizes.md;
  }};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  text-align: center;
  text-decoration: none;
  transition: all ${props => props.theme.transitions.short};
  /* Ensure buttons are touch-friendly */
  min-height: ${props => props.theme.mobile?.touchTarget || '44px'};
  
  /* Mobile-specific styling */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => {
      if (props.$size === 'small') return props.theme.typography.fontSizes.mobile.sm;
      if (props.$size === 'large') return props.theme.typography.fontSizes.mobile.lg;
      return props.theme.typography.fontSizes.mobile.md;
    }};
    padding: ${props => props.$size === 'small' 
      ? `${props.theme.spacing.mobile.xs} ${props.theme.spacing.mobile.sm}` 
      : props.$size === 'large' 
        ? `${props.theme.spacing.mobile.md} ${props.theme.spacing.mobile.lg}` 
        : `${props.theme.spacing.mobile.sm} ${props.theme.spacing.mobile.md}`
    };
  }
  
  &:hover {
    background: ${props => {
      if (props.$variant === 'primary' && props.theme.name === 'blue') {
        return `linear-gradient(to bottom, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark})`;
      }
      if (props.$variant === 'primary') return props.theme.colors.primaryDark;
      if (props.$variant === 'secondary') return props.theme.colors.secondaryDark;
      if (props.$variant === 'accent') return props.theme.colors.accentDark;
      if (props.$variant === 'warning') return props.theme.colors.warningDark;
      if (props.$variant === 'outlined') return props.theme.colors.primaryLight;
      return props.theme.colors.primaryDark;
    }};
    color: ${props => props.$variant === 'outlined' 
      ? props.theme.colors.white 
      : props.theme.colors.white
    };
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.small};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}50`};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray};
    color: ${props => props.theme.colors.white};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  /* Remove hover effects on touch devices */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      background: ${props => {
        if (props.$variant === 'primary' && props.theme.name === 'blue') {
          return `linear-gradient(to bottom, ${props.theme.colors.primaryLight}, ${props.theme.colors.primary})`;
        }
        if (props.$variant === 'primary') return props.theme.colors.primary;
        if (props.$variant === 'secondary') return props.theme.colors.secondary;
        if (props.$variant === 'accent') return props.theme.colors.accent;
        if (props.$variant === 'warning') return props.theme.colors.warning;
        if (props.$variant === 'outlined') return 'transparent';
        return props.theme.colors.primary;
      }};
      color: ${props => {
        if (props.$variant === 'outlined') return props.theme.colors.primary;
        return props.theme.colors.white;
      }};
      transform: none;
      box-shadow: none;
    }
  }
  
  ${props => props.$fullWidth && `
    width: 100%;
  `}
  
  svg {
    margin-right: ${props => props.$iconOnly ? '0' : props.theme.spacing.xs};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      margin-right: ${props => props.$iconOnly ? '0' : props.theme.spacing.mobile.xs};
    }
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  fullWidth = false,
  iconOnly = false,
  ...props 
}) => {
  return (
    <ButtonStyles 
      type={type} 
      $variant={variant} 
      $size={size}
      $fullWidth={fullWidth}
      $iconOnly={iconOnly}
      {...props}
    >
      {children}
    </ButtonStyles>
  );
};

export default Button; 