import React, { useRef, useEffect } from 'react';
import { GRID_SIZE, CELL_SIZE, TILE_TYPES, GAME_STATES } from '../utils/constants';
import { initialMapData } from '../utils/mapData';

export function GameCanvas({ gameState, children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = GRID_SIZE * CELL_SIZE;
    const height = GRID_SIZE * CELL_SIZE;
    
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Draw map tiles
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const tile = initialMapData[y][x];
        drawTile(ctx, x, y, tile);
      }
    }
  }, []);

  const drawTile = (ctx, x, y, tile) => {
    const px = x * CELL_SIZE;
    const py = y * CELL_SIZE;
    
    switch (tile) {
      case TILE_TYPES.BRICK:
        // 砖墙 - 橙红色方块
        ctx.fillStyle = '#c44536';
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#8b2500';
        ctx.lineWidth = 2;
        // 画砖块纹理
        ctx.beginPath();
        ctx.moveTo(px, py + CELL_SIZE / 2);
        ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE / 2);
        ctx.moveTo(px + CELL_SIZE / 2, py);
        ctx.lineTo(px + CELL_SIZE / 2, py + CELL_SIZE / 2);
        ctx.moveTo(px + CELL_SIZE / 4, py + CELL_SIZE / 2);
        ctx.lineTo(px + CELL_SIZE / 4, py + CELL_SIZE);
        ctx.moveTo(px + CELL_SIZE * 3 / 4, py + CELL_SIZE / 2);
        ctx.lineTo(px + CELL_SIZE * 3 / 4, py + CELL_SIZE);
        ctx.stroke();
        break;
        
      case TILE_TYPES.STEEL:
        // 钢墙 - 灰蓝色方块
        ctx.fillStyle = '#4a6fa5';
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#2d4a6f';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        // 内部十字
        ctx.beginPath();
        ctx.moveTo(px + CELL_SIZE / 2, py);
        ctx.lineTo(px + CELL_SIZE / 2, py + CELL_SIZE);
        ctx.moveTo(px, py + CELL_SIZE / 2);
        ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE / 2);
        ctx.stroke();
        break;
        
      case TILE_TYPES.GRASS:
        // 草丛 - 绿色
        ctx.fillStyle = '#2d5a27';
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        // 画草丛纹理
        ctx.fillStyle = '#3d7a37';
        for (let i = 0; i < 5; i++) {
          const gx = px + 5 + (i * 7);
          const gy = py + CELL_SIZE - 5;
          ctx.beginPath();
          ctx.moveTo(gx, gy);
          ctx.lineTo(gx + 2, py + 10);
          ctx.lineTo(gx + 4, gy);
          ctx.fill();
        }
        break;
        
      case TILE_TYPES.RIVER:
        // 河流 - 蓝色波浪
        ctx.fillStyle = '#1e5f8a';
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = '#2e8fba';
        ctx.beginPath();
        ctx.moveTo(px, py + CELL_SIZE / 3);
        ctx.quadraticCurveTo(px + CELL_SIZE / 4, py, px + CELL_SIZE / 2, py + CELL_SIZE / 3);
        ctx.quadraticCurveTo(px + CELL_SIZE * 3 / 4, py + CELL_SIZE * 2 / 3, px + CELL_SIZE, py + CELL_SIZE / 3);
        ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE * 2 / 3);
        ctx.quadraticCurveTo(px + CELL_SIZE * 3 / 4, py + CELL_SIZE, px + CELL_SIZE / 2, py + CELL_SIZE * 2 / 3);
        ctx.quadraticCurveTo(px + CELL_SIZE / 4, py + CELL_SIZE / 3, px, py + CELL_SIZE * 2 / 3);
        ctx.fill();
        break;
        
      case TILE_TYPES.BASE:
        // 基地 - 灰色方块
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        // 画老鹰图标 (简化)
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(px + CELL_SIZE / 2, py + 5);
        ctx.lineTo(px + CELL_SIZE - 5, py + CELL_SIZE - 8);
        ctx.lineTo(px + CELL_SIZE / 2, py + CELL_SIZE - 15);
        ctx.lineTo(px + 5, py + CELL_SIZE - 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(px + CELL_SIZE / 2 - 3, py + CELL_SIZE - 15, 6, 10);
        break;
        
      default:
        // 空地 - 深色格子
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#252540';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border-4 border-game-accent rounded-lg"
        style={{ 
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          imageRendering: 'pixelated'
        }}
      />
      {children}
    </div>
  );
}
