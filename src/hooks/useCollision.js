import { TILE_TYPES, CELL_SIZE } from '../utils/constants';

export function useCollision() {
  // Check if bullet hits a tank
  const bulletHitsTank = (bullet, tank) => {
    const bulletX = bullet.x * CELL_SIZE;
    const bulletY = bullet.y * CELL_SIZE;
    const tankX = tank.x * CELL_SIZE;
    const tankY = tank.y * CELL_SIZE;
    
    return (
      bulletX < tankX + CELL_SIZE &&
      bulletX + CELL_SIZE > tankX &&
      bulletY < tankY + CELL_SIZE &&
      bulletY + CELL_SIZE > tankY
    );
  };

  // Check if tank collides with map tile
  const tankCollidesWithMap = (x, y, map) => {
    if (x < 0 || x >= 13 || y < 0 || y >= 13) return true;
    const tile = map[y][x];
    return tile === TILE_TYPES.BRICK || tile === TILE_TYPES.STEEL || tile === TILE_TYPES.RIVER;
  };

  // Check if tank reaches base
  const tankReachesBase = (tank, baseX, baseY) => {
    return tank.x >= baseX - 1 && tank.x <= baseX + 1 &&
           tank.y >= baseY - 1 && tank.y <= baseY + 1;
  };

  return {
    bulletHitsTank,
    tankCollidesWithMap,
    tankReachesBase
  };
}
