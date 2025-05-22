import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: ${props => props.thickness || '4px'} solid ${props => props.theme.colors.grayLight};
  border-top-color: ${props => props.color || props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spinAnimation} 0.8s linear infinite;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
`;

const Spinner = ({ size, thickness, color, centered = false, ...props }) => {
  if (centered) {
    return (
      <SpinnerWrapper {...props}>
        <SpinnerContainer size={size} thickness={thickness} color={color} />
      </SpinnerWrapper>
    );
  }
  return <SpinnerContainer size={size} thickness={thickness} color={color} {...props} />;
};

export default Spinner; 