import React from 'react';
import { CELL_SIZE, DIRECTIONS } from '../utils/constants';

export function Tank({ x, y, direction, isPlayer = false, isEnemy = false }) {
  const tankStyle = {
    position: 'absolute',
    left: x * CELL_SIZE,
    top: y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
    transition: 'left 0.05s, top 0.05s',
    zIndex: 10
  };

  const getRotation = () => {
    if (direction === DIRECTIONS.UP) return 0;
    if (direction === DIRECTIONS.RIGHT) return 90;
    if (direction === DIRECTIONS.DOWN) return 180;
    if (direction === DIRECTIONS.LEFT) return 270;
    return 0;
  };

  return (
    <div style={tankStyle}>
      <svg
        viewBox="0 0 40 40"
        width={CELL_SIZE}
        height={CELL_SIZE}
        style={{ transform: `rotate(${getRotation()}deg)` }}
      >
        {/* Tank body */}
        {isPlayer ? (
          <>
            {/* Player tank - green */}
            <rect x="8" y="12" width="24" height="16" fill="#4CAF50" rx="2" />
            <rect x="14" y="4" width="12" height="12" fill="#388E3C" rx="1" />
            <rect x="17" y="0" width="6" height="8" fill="#2E7D32" />
            {/* Tank tracks */}
            <rect x="4" y="12" width="4" height="16" fill="#333" rx="1" />
            <rect x="32" y="12" width="4" height="16" fill="#333" rx="1" />
          </>
        ) : isEnemy ? (
          <>
            {/* Enemy tank - red */}
            <rect x="8" y="12" width="24" height="16" fill="#f44336" rx="2" />
            <rect x="14" y="4" width="12" height="12" fill="#d32f2f" rx="1" />
            <rect x="17" y="0" width="6" height="8" fill="#b71c1c" />
            {/* Tank tracks */}
            <rect x="4" y="12" width="4" height="16" fill="#333" rx="1" />
            <rect x="32" y="12" width="4" height="16" fill="#333" rx="1" />
          </>
        ) : (
          <>
            {/* Default tank */}
            <rect x="8" y="12" width="24" height="16" fill="#666" rx="2" />
            <rect x="14" y="4" width="12" height="12" fill="#555" rx="1" />
            <rect x="17" y="0" width="6" height="8" fill="#444" />
            <rect x="4" y="12" width="4" height="16" fill="#333" rx="1" />
            <rect x="32" y="12" width="4" height="16" fill="#333" rx="1" />
          </>
        )}
      </svg>
    </div>
  );
}
