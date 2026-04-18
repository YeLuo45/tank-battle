import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameCanvas } from './GameCanvas';
import { Tank } from './Tank';
import { Bullet } from './Bullet';
import { HUD } from './HUD';
import { GameOver } from './GameOver';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { 
  CELL_SIZE, 
  GRID_SIZE, 
  GAME_STATES, 
  DIRECTIONS, 
  TILE_TYPES,
  PLAYER_LIVES,
  GAME_DURATION,
  PLAYER_SPEED,
  ENEMY_SPEED,
  BULLET_SPEED,
  SHOOT_COOLDOWN,
  SCORES
} from '../utils/constants';
import { initialMapData, PLAYER_SPAWN_POSITION, BASE_POSITION, ENEMY_SPAWN_POSITIONS } from '../utils/mapData';
import { decideEnemyAction, getMoveTowardsTarget, getPatrolMove } from '../utils/enemyAI';

const HIGH_SCORE_KEY = 'tank-battle-highscore';

function getHighScore() {
  try {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function setHighScore(score) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch {}
}

export function Game() {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(getHighScore);
  const [lives, setLives] = useState(PLAYER_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [wave, setWave] = useState(1);
  const [map, setMap] = useState(initialMapData);
  
  // Player state
  const [player, setPlayer] = useState({
    x: PLAYER_SPAWN_POSITION.x,
    y: PLAYER_SPAWN_POSITION.y,
    direction: DIRECTIONS.UP,
    isMoving: false
  });
  
  // Enemies state
  const [enemies, setEnemies] = useState([]);
  
  // Bullets state
  const [bullets, setBullets] = useState([]);
  
  // Cooldowns
  const lastShootTime = useRef(0);
  const lastMoveTime = useRef(0);
  const lastEnemyMoveTime = useRef(0);
  const lastBulletMoveTime = useRef(0);
  
  // Input state
  const keysPressed = useRef(new Set());
  const currentDirection = useRef(DIRECTIONS.UP);

  // Initialize enemies for a wave
  const spawnEnemies = useCallback((waveNum) => {
    const count = Math.min(2 + Math.floor(waveNum / 2), 4);
    const newEnemies = [];
    const usedPositions = [];
    
    for (let i = 0; i < count; i++) {
      let pos;
      let attempts = 0;
      do {
        pos = ENEMY_SPAWN_POSITIONS[i % ENEMY_SPAWN_POSITIONS.length];
        attempts++;
      } while (usedPositions.some(p => p.x === pos.x && p.y === pos.y) && attempts < 10);
      
      usedPositions.push(pos);
      newEnemies.push({
        id: Date.now() + i,
        x: pos.x,
        y: pos.y,
        direction: DIRECTIONS.DOWN,
        state: 'patrol',
        lastShot: 0
      });
    }
    
    return newEnemies;
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setScore(0);
    setLives(PLAYER_LIVES);
    setTimeLeft(GAME_DURATION);
    setWave(1);
    setMap(JSON.parse(JSON.stringify(initialMapData)));
    setPlayer({
      x: PLAYER_SPAWN_POSITION.x,
      y: PLAYER_SPAWN_POSITION.y,
      direction: DIRECTIONS.UP,
      isMoving: false
    });
    setEnemies(spawnEnemies(1));
    setBullets([]);
    lastShootTime.current = 0;
    lastMoveTime.current = 0;
    lastEnemyMoveTime.current = 0;
    lastBulletMoveTime.current = 0;
    currentDirection.current = DIRECTIONS.UP;
    keysPressed.current.clear();
  }, [spawnEnemies]);

  // Start game
  const startGame = useCallback(() => {
    resetGame();
    setGameState(GAME_STATES.PLAYING);
  }, [resetGame]);

  // Handle keyboard input
  const handleKeyDown = useCallback((code, keys) => {
    if (gameState === GAME_STATES.MENU) {
      if (code === 'Space' || code === 'Enter') {
        startGame();
      }
      return;
    }
    
    if (gameState === GAME_STATES.GAME_OVER || gameState === GAME_STATES.WIN) {
      if (code === 'Space' || code === 'Enter') {
        startGame();
      }
      return;
    }
    
    // Movement keys
    if (code === 'KeyW' || code === 'ArrowUp') {
      currentDirection.current = DIRECTIONS.UP;
    } else if (code === 'KeyS' || code === 'ArrowDown') {
      currentDirection.current = DIRECTIONS.DOWN;
    } else if (code === 'KeyA' || code === 'ArrowLeft') {
      currentDirection.current = DIRECTIONS.LEFT;
    } else if (code === 'KeyD' || code === 'ArrowRight') {
      currentDirection.current = DIRECTIONS.RIGHT;
    }
    
    // Shoot
    if (code === 'Space') {
      const now = Date.now();
      if (now - lastShootTime.current > SHOOT_COOLDOWN) {
        lastShootTime.current = now;
        setBullets(prev => [...prev, {
          id: now,
          x: player.x,
          y: player.y,
          direction: { ...currentDirection.current },
          isEnemy: false
        }]);
      }
    }
  }, [gameState, player, startGame]);

  const handleKeyUp = useCallback(() => {}, []);

  useKeyboard(handleKeyDown, handleKeyUp);

  // Check collision with map
  const canMoveTo = useCallback((x, y, currentMap) => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
    const tile = currentMap[y][x];
    return tile !== TILE_TYPES.BRICK && tile !== TILE_TYPES.STEEL && tile !== TILE_TYPES.RIVER;
  }, []);

  // Check if bullet hits something
  const processBullets = useCallback((currentBullets, currentMap, currentEnemies) => {
    const updatedBullets = [];
    const destroyedTiles = [];
    let hitEnemies = [];
    let hitPlayer = false;
    let baseDestroyed = false;
    
    for (const bullet of currentBullets) {
      let newX = bullet.x + bullet.direction.x * 0.5;
      let newY = bullet.y + bullet.direction.y * 0.5;
      
      // Check bounds
      if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
        continue;
      }
      
      const tileX = Math.floor(newX);
      const tileY = Math.floor(newY);
      const tile = currentMap[tileY]?.[tileX];
      
      // Check if bullet hits brick (destroy it)
      if (tile === TILE_TYPES.BRICK) {
        destroyedTiles.push({ x: tileX, y: tileY });
        continue;
      }
      
      // Check if bullet hits steel (don't destroy)
      if (tile === TILE_TYPES.STEEL) {
        continue;
      }
      
      // Check if bullet hits enemy
      if (!bullet.isEnemy) {
        for (const enemy of currentEnemies) {
          if (Math.abs(newX - enemy.x) < 0.8 && Math.abs(newY - enemy.y) < 0.8) {
            hitEnemies.push(enemy.id);
            newX = bullet.x;
            newY = bullet.y;
            break;
          }
        }
      }
      
      // Check if enemy bullet hits player
      if (bullet.isEnemy) {
        if (Math.abs(newX - player.x) < 0.8 && Math.abs(newY - player.y) < 0.8) {
          hitPlayer = true;
          continue;
        }
      }
      
      // Check if any bullet hits base
      if (tileX >= 10 && tileX <= 12 && tileY >= 11 && tileY <= 12) {
        baseDestroyed = true;
      }
      
      updatedBullets.push({ ...bullet, x: newX, y: newY });
    }
    
    return { bullets: updatedBullets, destroyedTiles, hitEnemies, hitPlayer, baseDestroyed };
  }, [player]);

  // Game loop
  const gameLoop = useCallback((deltaTime) => {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    const now = Date.now();
    
    // Update timer
    setTimeLeft(prev => {
      if (prev <= 1) {
        setGameState(GAME_STATES.GAME_OVER);
        return 0;
      }
      return prev - deltaTime / 1000 > prev - 1 ? prev - 1 : prev;
    });
    
    // Player movement (throttled)
    if (now - lastMoveTime.current > 100) {
      lastMoveTime.current = now;
      
      const dir = currentDirection.current;
      const newX = player.x + dir.x * PLAYER_SPEED * 0.5;
      const newY = player.y + dir.y * PLAYER_SPEED * 0.5;
      
      // Check collision
      const gridX = Math.floor(newX + 0.5);
      const gridY = Math.floor(newY + 0.5);
      
      if (canMoveTo(gridX, gridY, map)) {
        setPlayer(prev => ({
          ...prev,
          x: newX,
          y: newY,
          direction: dir
        }));
      } else {
        // Just update direction even if can't move
        setPlayer(prev => ({
          ...prev,
          direction: dir
        }));
      }
    }
    
    // Enemy movement (throttled)
    if (now - lastEnemyMoveTime.current > 200) {
      lastEnemyMoveTime.current = now;
      
      setEnemies(prevEnemies => {
        return prevEnemies.map(enemy => {
          const action = decideEnemyAction(enemy, player, map);
          
          if (action === 'chase' || action === 'attack') {
            const target = action === 'attack' ? BASE_POSITION : { x: player.x, y: player.y };
            const move = getMoveTowardsTarget(enemy, target.x, target.y, map);
            
            // Enemy shoots sometimes
            const shouldShoot = now - enemy.lastShot > 2000 + Math.random() * 1000;
            if (shouldShoot) {
              setBullets(b => [...b, {
                id: now + Math.random(),
                x: enemy.x,
                y: enemy.y,
                direction: { ...move.direction },
                isEnemy: true
              }]);
              enemy.lastShot = now;
            }
            
            return {
              ...enemy,
              x: move.x,
              y: move.y,
              direction: move.direction || enemy.direction
            };
          } else {
            const move = getPatrolMove(enemy, map);
            return {
              ...enemy,
              x: move.x,
              y: move.y,
              direction: move.direction || enemy.direction
            };
          }
        });
      });
    }
    
    // Process bullets
    if (now - lastBulletMoveTime.current > 50) {
      lastBulletMoveTime.current = now;
      
      setBullets(prev => {
        const result = processBullets(prev, map, enemies);
        
        // Handle destroyed tiles
        if (result.destroyedTiles.length > 0) {
          setMap(currentMap => {
            const newMap = currentMap.map(row => [...row]);
            for (const tile of result.destroyedTiles) {
              newMap[tile.y][tile.x] = TILE_TYPES.EMPTY;
            }
            return newMap;
          });
        }
        
        // Handle hit enemies
        if (result.hitEnemies.length > 0) {
          setScore(s => s + SCORES.ENEMY_KILL);
          setEnemies(prev => prev.filter(e => !result.hitEnemies.includes(e.id)));
        }
        
        // Handle player hit
        if (result.hitPlayer) {
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameState(GAME_STATES.GAME_OVER);
            } else {
              // Respawn player
              setPlayer({
                x: PLAYER_SPAWN_POSITION.x,
                y: PLAYER_SPAWN_POSITION.y,
                direction: DIRECTIONS.UP,
                isMoving: false
              });
            }
            return newLives;
          });
        }
        
        // Handle base destroyed
        if (result.baseDestroyed) {
          setGameState(GAME_STATES.GAME_OVER);
        }
        
        return result.bullets;
      });
    }
    
    // Check if all enemies defeated - spawn new wave
    if (enemies.length === 0 && gameState === GAME_STATES.PLAYING) {
      setWave(w => {
        const newWave = w + 1;
        setScore(s => s + SCORES.WAVE_BONUS * newWave);
        setEnemies(spawnEnemies(newWave));
        return newWave;
      });
    }
  }, [gameState, player, map, enemies, canMoveTo, processBullets, spawnEnemies]);

  useGameLoop(gameLoop, gameState === GAME_STATES.PLAYING);

  // Update high score on game over
  useEffect(() => {
    if (gameState === GAME_STATES.GAME_OVER || gameState === GAME_STATES.WIN) {
      if (score > highScore) {
        setHighScore(score);
        setHighScoreState(score);
      }
    }
  }, [gameState, score, highScore]);

  // Menu screen
  if (gameState === GAME_STATES.MENU) {
    return (
      <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-game-accent mb-4">🎮 Tank Battle 🎮</h1>
          <p className="text-gray-400 text-xl mb-8">Classic Tank vs Tank Combat</p>
          
          <div className="bg-game-light p-6 rounded-xl border-2 border-game-accent mb-8">
            <h2 className="text-white text-lg mb-4">Controls</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="bg-gray-700 px-3 py-1 rounded">W A S D</span>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-700 px-3 py-1 rounded">↑ ← ↓ →</span>
                <span>Move</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-700 px-3 py-1 rounded">SPACE</span>
                <span>Shoot</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-12 py-4 bg-game-accent hover:bg-red-600 text-white font-bold text-2xl rounded-lg transition-colors animate-pulse"
          >
            START GAME
          </button>
          
          <p className="text-gray-500 text-sm mt-4">Press SPACE or ENTER to start</p>
        </div>
        
        <div className="mt-8 text-gray-600 text-sm">
          High Score: {highScore}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center p-4">
      <HUD 
        score={score} 
        highScore={highScore} 
        lives={lives} 
        timeLeft={Math.floor(timeLeft)} 
        wave={wave} 
      />
      
      <GameCanvas gameState={gameState}>
        {/* Render player tank */}
        <Tank 
          x={player.x} 
          y={player.y} 
          direction={player.direction} 
          isPlayer={true} 
        />
        
        {/* Render enemy tanks */}
        {enemies.map(enemy => (
          <Tank 
            key={enemy.id} 
            x={enemy.x} 
            y={enemy.y} 
            direction={enemy.direction} 
            isEnemy={true} 
          />
        ))}
        
        {/* Render bullets */}
        {bullets.map(bullet => (
          <Bullet 
            key={bullet.id} 
            x={bullet.x} 
            y={bullet.y} 
            direction={bullet.direction}
            isEnemy={bullet.isEnemy}
          />
        ))}
        
        {/* Game over overlay */}
        <GameOver 
          gameState={gameState}
          score={score}
          highScore={highScore}
          onRestart={startGame}
        />
      </GameCanvas>
      
      <div className="mt-4 text-gray-500 text-sm">
        <span className="text-gray-400">TIP:</span> Destroy all enemies before they reach your base!
      </div>
    </div>
  );
}
