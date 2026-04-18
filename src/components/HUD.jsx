import React from 'react';
import { PLAYER_LIVES, GAME_DURATION } from '../utils/constants';

export function HUD({ score, highScore, lives = PLAYER_LIVES, timeLeft = GAME_DURATION, wave = 1 }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-between items-center mb-4 px-4 py-3 bg-game-dark rounded-lg border-2 border-game-accent">
      <div className="flex items-center gap-6">
        {/* Score */}
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Score</div>
          <div className="text-2xl font-bold text-white">{score}</div>
        </div>
        
        {/* High Score */}
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Best</div>
          <div className="text-xl font-bold text-yellow-400">{highScore}</div>
        </div>
        
        {/* Wave */}
        <div className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Wave</div>
          <div className="text-xl font-bold text-green-400">{wave}</div>
        </div>
      </div>
      
      {/* Timer */}
      <div className="text-center">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Time</div>
        <div className={`text-3xl font-bold ${timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>
      
      {/* Lives */}
      <div className="flex items-center gap-2">
        <div className="text-xs text-gray-400 uppercase tracking-wider mr-2">Lives</div>
        {Array.from({ length: lives }).map((_, i) => (
          <div key={i} className="w-6 h-6">
            <svg viewBox="0 0 24 24" className="w-full h-full text-green-500">
              <path fill="currentColor" d="M12 2L4 7v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5z"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
