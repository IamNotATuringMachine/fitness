import React, { useState } from 'react';
import styled from 'styled-components';

const DragContainer = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
`;

const DraggableItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.small};
  box-shadow: ${props => props.theme.shadows.small};
  cursor: grab;
  transition: all ${props => props.theme.transitions.short};
  user-select: none;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
  
  &:active {
    cursor: grabbing;
  }

  ${props => props.isDragging && `
    opacity: 0.5;
    transform: scale(1.05);
    box-shadow: ${props.theme.shadows.medium};
  `}
  
  ${props => props.isOver && `
    border: 2px dashed ${props.theme.colors.primary};
  `}
`;

const DropZone = styled.div`
  padding: ${props => props.theme.spacing.sm};
  margin: ${props => props.theme.spacing.xs} 0;
  background-color: ${props => 
    props.isOver 
      ? `${props.theme.colors.primaryLight}50` 
      : 'transparent'
  };
  border: 2px dashed ${props => 
    props.isOver 
      ? props.theme.colors.primary 
      : 'transparent'
  };
  border-radius: ${props => props.theme.borderRadius.small};
  transition: all ${props => props.theme.transitions.short};
  height: ${props => props.isExpanded ? '60px' : '10px'};
`;

// Component that supports drag and drop ordering of items
const DragDrop = ({ items, onOrderChange, renderItem }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(index);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDragEnd = (e) => {
    e.preventDefault();
    
    if (draggedItem !== null && dragOverIndex !== null && draggedItem !== dragOverIndex) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedItem, 1);
      newItems.splice(dragOverIndex, 0, removed);
      
      onOrderChange(newItems);
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
  };
  
  return (
    <DragContainer>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <DropZone 
            isOver={dragOverIndex === index}
            isExpanded={draggedItem !== null}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDragEnd}
          />
          <DraggableItem 
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            isDragging={draggedItem === index}
          >
            {renderItem(item, index)}
          </DraggableItem>
        </React.Fragment>
      ))}
      <DropZone 
        isOver={dragOverIndex === items.length}
        isExpanded={draggedItem !== null}
        onDragOver={(e) => handleDragOver(e, items.length)}
        onDrop={handleDragEnd}
      />
    </DragContainer>
  );
};

export default DragDrop; 