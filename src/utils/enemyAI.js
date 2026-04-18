import { DIRECTIONS, TILE_TYPES } from './constants';

// Get random direction
export function getRandomDirection() {
  const dirs = Object.values(DIRECTIONS);
  return dirs[Math.floor(Math.random() * dirs.length)];
}

// Check if position is blocked
export function isBlocked(map, x, y) {
  if (x < 0 || x >= 13 || y < 0 || y >= 13) return true;
  const tile = map[y][x];
  return tile === TILE_TYPES.BRICK || tile === TILE_TYPES.STEEL || tile === TILE_TYPES.RIVER;
}

// Get distance between two points
export function getDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// AI decision making for enemy
export function decideEnemyAction(enemy, player, map) {
  const distToPlayer = getDistance(enemy.x, enemy.y, player.x, player.y);
  const distToBase = getDistance(enemy.x, enemy.y, 11, 12);
  
  // If close to player, chase and attack
  if (distToPlayer < 5) {
    return 'chase';
  }
  
  // If close to base, go for base
  if (distToBase < 4) {
    return 'attack';
  }
  
  // Otherwise patrol
  return 'patrol';
}

// Get next move towards target
export function getMoveTowardsTarget(enemy, targetX, targetY, map) {
  const dx = targetX - enemy.x;
  const dy = targetY - enemy.y;
  
  let preferredDir;
  if (Math.abs(dx) > Math.abs(dy)) {
    preferredDir = dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
  } else {
    preferredDir = dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
  }
  
  // Try preferred direction first
  const nextX = enemy.x + preferredDir.x;
  const nextY = enemy.y + preferredDir.y;
  
  if (!isBlocked(map, nextX, nextY)) {
    return { direction: preferredDir, x: nextX, y: nextY };
  }
  
  // Try other directions
  const allDirs = Object.values(DIRECTIONS).filter(d => d !== preferredDir);
  for (const dir of allDirs) {
    const nx = enemy.x + dir.x;
    const ny = enemy.y + dir.y;
    if (!isBlocked(map, nx, ny)) {
      return { direction: dir, x: nx, y: ny };
    }
  }
  
  // Can't move
  return { direction: enemy.direction, x: enemy.x, y: enemy.y };
}

// Patrol behavior
export function getPatrolMove(enemy, map) {
  // Try to continue in current direction
  const nextX = enemy.x + enemy.direction.x;
  const nextY = enemy.y + enemy.direction.y;
  
  if (!isBlocked(map, nextX, nextY)) {
    return { x: nextX, y: nextY };
  }
  
  // Turn to a random direction
  const newDir = getRandomDirection();
  const newNextX = enemy.x + newDir.x;
  const newNextY = enemy.y + newDir.y;
  
  if (!isBlocked(map, newNextX, newNextY)) {
    return { x: newNextX, y: newNextY, direction: newDir };
  }
  
  return { x: enemy.x, y: enemy.y };
}
