import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animation keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

const wave = keyframes`
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-15px);
  }
`;

// Container for centering the spinner
const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.fullScreen ? '100vh' : '200px'};
  width: 100%;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

// Basic circular spinner
const CircularSpinner = styled.div`
  width: ${props => {
    switch (props.size) {
      case 'small': return '24px';
      case 'large': return '64px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '24px';
      case 'large': return '64px';
      default: return '40px';
    }
  }};
  border: ${props => {
    const width = props.size === 'small' ? '2px' : props.size === 'large' ? '4px' : '3px';
          return `${width} solid ${props.theme.colors.backgroundSecondary}`;
  }};
  border-top: ${props => {
    const width = props.size === 'small' ? '2px' : props.size === 'large' ? '4px' : '3px';
    return `${width} solid ${props.theme.colors.primary}`;
  }};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Dots spinner
const DotsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: center;
`;

const Dot = styled.div`
  width: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '16px' : '12px'};
  height: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '16px' : '12px'};
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${pulse} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay}s;
`;

// Bouncing balls
const BouncingBallsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: flex-end;
  height: ${props => props.size === 'small' ? '30px' : props.size === 'large' ? '60px' : '45px'};
`;

const BouncingBall = styled.div`
  width: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '16px' : '12px'};
  height: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '16px' : '12px'};
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${bounce} 2s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
`;

// Wave bars
const WaveBarsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: flex-end;
  height: ${props => props.size === 'small' ? '30px' : props.size === 'large' ? '60px' : '45px'};
`;

const WaveBar = styled.div`
  width: ${props => props.size === 'small' ? '4px' : props.size === 'large' ? '8px' : '6px'};
  height: ${props => props.size === 'small' ? '20px' : props.size === 'large' ? '40px' : '30px'};
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.small};
  animation: ${wave} 1.2s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
`;

// Loading text
const LoadingText = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.md};
  margin: 0;
  text-align: center;
  max-width: 300px;
`;

// Overlay for full-screen loading
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  z-index: ${props => props.theme.zIndices.modal || 500};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner = ({ 
  variant = 'circular', 
  size = 'medium', 
  text, 
  overlay = false,
  fullScreen = false,
  color 
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <DotsContainer>
            {[0, 1, 2].map(index => (
              <Dot key={index} size={size} delay={index * 0.16} />
            ))}
          </DotsContainer>
        );
      
      case 'bounce':
        return (
          <BouncingBallsContainer size={size}>
            {[0, 1, 2].map(index => (
              <BouncingBall key={index} size={size} delay={index * 0.16} />
            ))}
          </BouncingBallsContainer>
        );
      
      case 'wave':
        return (
          <WaveBarsContainer size={size}>
            {[0, 1, 2, 3, 4].map(index => (
              <WaveBar key={index} size={size} delay={index * 0.1} />
            ))}
          </WaveBarsContainer>
        );
      
      case 'circular':
      default:
        return <CircularSpinner size={size} color={color} />;
    }
  };

  const content = (
    <SpinnerContainer fullScreen={fullScreen && !overlay}>
      {renderSpinner()}
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );

  if (overlay) {
    return (
      <LoadingOverlay>
        {content}
      </LoadingOverlay>
    );
  }

  return content;
};

// Skeleton loading component for content placeholders
const SkeletonContainer = styled.div`
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonBox = styled.div`
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.small};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  margin-bottom: ${props => props.margin || '0'};
`;

export const Skeleton = ({ width, height, margin, count = 1 }) => {
  return (
    <SkeletonContainer>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBox 
          key={index} 
          width={width} 
          height={height} 
          margin={margin}
        />
      ))}
    </SkeletonContainer>
  );
};

// Loading button state
export const LoadingButton = styled.button`
  position: relative;
  pointer-events: ${props => props.loading ? 'none' : 'auto'};
  opacity: ${props => props.loading ? 0.7 : 1};
  
  ${props => props.loading && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: ${spin} 1s linear infinite;
    }
  `}
`;

export default LoadingSpinner; 