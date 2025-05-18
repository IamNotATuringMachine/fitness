import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
  transition: transform ${props => props.theme.transitions.short}, 
              box-shadow ${props => props.theme.transitions.short};
  
  ${props => props.hoverable && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${props.theme.shadows.medium};
    }
  `}
  
  ${props => props.clickable && `
    cursor: pointer;
  `}
  
  ${props => props.bordered && `
    border: 1px solid ${props.theme.colors.border};
  `}
`;

const CardHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  
  ${props => props.center && `
    text-align: center;
  `}
  
  ${props => props.accent && `
    background-color: ${props.theme.colors.primaryLight};
    color: ${props.theme.colors.primary};
  `}
`;

const CardBody = styled.div`
  padding: ${props => props.theme.spacing.md};
  
  ${props => props.center && `
    text-align: center;
  `}
`;

const CardFooter = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.grayLight};
  
  ${props => props.center && `
    text-align: center;
  `}
  
  ${props => props.actions && `
    display: flex;
    justify-content: flex-end;
    gap: ${props.theme.spacing.sm};
  `}
`;

export const Card = ({ 
  children, 
  hoverable = false, 
  clickable = false, 
  bordered = false,
  ...props 
}) => {
  return (
    <CardContainer 
      hoverable={hoverable} 
      clickable={clickable} 
      bordered={bordered} 
      {...props}
    >
      {children}
    </CardContainer>
  );
};

export const Header = ({ 
  children, 
  center = false, 
  accent = false, 
  ...props 
}) => {
  return (
    <CardHeader center={center} accent={accent} {...props}>
      {children}
    </CardHeader>
  );
};

export const Body = ({ 
  children, 
  center = false, 
  ...props 
}) => {
  return (
    <CardBody center={center} {...props}>
      {children}
    </CardBody>
  );
};

export const Footer = ({ 
  children, 
  center = false, 
  actions = false, 
  ...props 
}) => {
  return (
    <CardFooter center={center} actions={actions} {...props}>
      {children}
    </CardFooter>
  );
};

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card; 