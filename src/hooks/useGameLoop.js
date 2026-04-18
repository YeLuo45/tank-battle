import { useEffect, useRef } from 'react';

export function useGameLoop(callback, isRunning) {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const callbackRef = useRef(callback);

  // Update callback ref on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isRunning) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning]);
}
