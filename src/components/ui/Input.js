import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  transition: border-color ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  transition: border-color ${props => props.theme.transitions.short};
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Input = React.forwardRef(({ multiline, rows, ...props }, ref) => {
  if (multiline) {
    return (
      <StyledTextArea
        ref={ref}
        rows={rows || 3}
        {...props}
      />
    );
  }
  
  return (
    <StyledInput
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input; 