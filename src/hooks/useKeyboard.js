import { useEffect, useRef, useCallback } from 'react';

export function useKeyboard(onKeyDown, onKeyUp) {
  const keysPressed = useRef(new Set());

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }
      keysPressed.current.add(e.code);
      onKeyDown(e.code, keysPressed.current);
    };

    const handleKeyUp = (e) => {
      keysPressed.current.delete(e.code);
      onKeyUp(e.code, keysPressed.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  return keysPressed;
}
