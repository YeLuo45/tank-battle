import React from 'react';
import { CELL_SIZE } from '../utils/constants';

export function Bullet({ x, y, direction, isEnemy = false }) {
  const bulletStyle = {
    position: 'absolute',
    left: x * CELL_SIZE + CELL_SIZE / 2 - 3,
    top: y * CELL_SIZE + CELL_SIZE / 2 - 3,
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: isEnemy ? '#ff5722' : '#ffeb3b',
    boxShadow: isEnemy 
      ? '0 0 4px #ff5722, 0 0 8px #ff5722' 
      : '0 0 4px #ffeb3b, 0 0 8px #ffeb3b',
    zIndex: 15
  };

  const getRotation = () => {
    if (direction.y === -1) return 0;
    if (direction.x === 1) return 90;
    if (direction.y === 1) return 180;
    if (direction.x === -1) return 270;
    return 0;
  };

  return (
    <div 
      style={{ 
        ...bulletStyle,
        transform: `rotate(${getRotation()}deg)`
      }} 
    />
  );
}
