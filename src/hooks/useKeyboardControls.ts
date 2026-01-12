import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useKeyboardControls = () => {
  const { setPaused } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Note: SPACE is handled by Phaser for starting waves
      // Only use P and Escape for pause at React level
      switch (event.key.toLowerCase()) {
        case 'p':
          event.preventDefault();
          setPaused(!useGameStore.getState().isPaused);
          break;
        case 'escape':
          event.preventDefault();
          setPaused(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setPaused]);
};
