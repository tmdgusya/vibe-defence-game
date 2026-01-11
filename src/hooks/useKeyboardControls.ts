import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useKeyboardControls = () => {
  const { setPaused } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'p':
        case ' ':
          event.preventDefault();
          setPaused((prev) => !prev);
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
