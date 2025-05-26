import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const VersionContainer = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-family: monospace;
  z-index: 1000;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 80px; /* Above mobile navigation */
    right: 12px;
  }
`;

const VersionCounter = () => {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/fitness/version.json');
        if (response.ok) {
          const data = await response.json();
          setVersion(data.version);
        }
      } catch (error) {
        console.log('Could not fetch version');
      }
    };

    fetchVersion();
  }, []);

  if (!version) {
    return null;
  }

  return (
    <VersionContainer>
      v{version}
    </VersionContainer>
  );
};

export default VersionCounter; 