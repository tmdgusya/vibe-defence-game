import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useGameLoop = () => {
  const { fps, setFps, isPaused, isGameOver } = useGameStore();

  useEffect(() => {
    if (isPaused || isGameOver) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let fpsUpdateTime = lastTime;

    const calculateFPS = () => {
      const now = performance.now();
      frameCount++;

      if (now - fpsUpdateTime >= 1000) {
        const currentFPS = Math.round(
          (frameCount * 1000) / (now - fpsUpdateTime)
        );
        setFps(currentFPS);
        frameCount = 0;
        fpsUpdateTime = now;
      }

      lastTime = now;
      requestAnimationFrame(calculateFPS);
    };

    const animationId = requestAnimationFrame(calculateFPS);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused, isGameOver, setFps]);

  return { fps, isPaused, isGameOver };
};
