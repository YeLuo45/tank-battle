import React from 'react';
import { GAME_STATES } from '../utils/constants';

export function GameOver({ gameState, score, highScore, onRestart }) {
  if (gameState !== GAME_STATES.GAME_OVER && gameState !== GAME_STATES.WIN) {
    return null;
  }

  const isWin = gameState === GAME_STATES.WIN;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 rounded-lg">
      <div className="text-center p-8 bg-game-dark border-4 border-game-accent rounded-xl">
        <h1 className={`text-5xl font-bold mb-4 ${isWin ? 'text-green-400' : 'text-red-500'}`}>
          {isWin ? '🎉 Victory! 🎉' : '💀 Game Over 💀'}
        </h1>
        
        <div className="mb-6">
          <div className="text-gray-400 text-lg mb-2">Final Score</div>
          <div className="text-5xl font-bold text-white mb-4">{score}</div>
          
          {score >= highScore && score > 0 && (
            <div className="text-yellow-400 text-xl mb-4">🏆 New High Score! 🏆</div>
          )}
          
          <div className="text-gray-400 text-sm mb-2">Best Score</div>
          <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
        </div>
        
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-game-accent hover:bg-red-600 text-white font-bold text-xl rounded-lg transition-colors"
        >
          Play Again
        </button>
        
        <div className="mt-4 text-gray-500 text-sm">
          Press SPACE or click to restart
        </div>
      </div>
    </div>
  );
}
