import { TILE_TYPES } from './constants';

// 0 = 空, 1 = 砖墙, 2 = 钢墙, 3 = 草丛, 4 = 河流, 5 = 基地
// 13x13 地图
export const initialMapData = [
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 4, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 5, 5, 5, 1, 1, 1, 0, 0]
];

// Base position (bottom-right area)
export const BASE_POSITION = { x: 11, y: 12 };

// Spawn positions for enemies (top area)
export const ENEMY_SPAWN_POSITIONS = [
  { x: 1, y: 0 },
  { x: 5, y: 0 },
  { x: 7, y: 0 },
  { x: 11, y: 0 }
];

// Player spawn position
export const PLAYER_SPAWN_POSITION = { x: 5, y: 11 };
