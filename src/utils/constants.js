// Game Constants
export const GRID_SIZE = 13;
export const CELL_SIZE = 40;
export const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE;
export const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE;

// Tank Constants
export const PLAYER_SPEED = 1;
export const ENEMY_SPEED = 0.5;
export const BULLET_SPEED = 4;
export const SHOOT_COOLDOWN = 500; // ms
export const MOVE_COOLDOWN = 100; // ms
export const PLAYER_LIVES = 3;
export const GAME_DURATION = 180; // 3 minutes in seconds

// Directions
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

// Tile Types
export const TILE_TYPES = {
  EMPTY: 0,
  BRICK: 1,    // 可破坏
  STEEL: 2,    // 不可破坏
  GRASS: 3,    // 草丛（隐蔽）
  RIVER: 4,    // 河流（阻挡）
  BASE: 5      // 基地
};

// Game States
export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  WIN: 'win'
};

// Enemy AI States
export const ENEMY_STATES = {
  PATROL: 'patrol',
  CHASE: 'chase',
  ATTACK: 'attack'
};

// Scores
export const SCORES = {
  ENEMY_KILL: 100,
  WAVE_BONUS: 50
};
