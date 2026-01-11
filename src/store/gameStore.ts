import { create } from 'zustand';

interface GameState {
  score: number;
  level: number;
  lives: number;
  isPaused: boolean;
  isGameOver: boolean;
  fps: number;
  wave: number;
  enemiesKilled: number;
  towersPlaced: number;
}

interface GameActions {
  setScore: (score: number) => void;
  setLevel: (level: number) => void;
  setLives: (lives: number) => void;
  setPaused: (paused: boolean) => void;
  setGameOver: (gameOver: boolean) => void;
  setFps: (fps: number) => void;
  setWave: (wave: number) => void;
  incrementEnemiesKilled: () => void;
  incrementTowersPlaced: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  score: 0,
  level: 1,
  lives: 3,
  isPaused: false,
  isGameOver: false,
  fps: 60,
  wave: 1,
  enemiesKilled: 0,
  towersPlaced: 0,
};

export const useGameStore = create<GameState & GameActions>((set) => ({
  ...initialState,

  setScore: (score) => set({ score }),
  setLevel: (level) => set({ level }),
  setLives: (lives) => set({ lives }),
  setPaused: (isPaused) => set({ isPaused }),
  setGameOver: (isGameOver) => set({ isGameOver }),
  setFps: (fps) => set({ fps }),
  setWave: (wave) => set({ wave }),
  incrementEnemiesKilled: () =>
    set((state) => ({
      enemiesKilled: state.enemiesKilled + 1,
    })),
  incrementTowersPlaced: () =>
    set((state) => ({
      towersPlaced: state.towersPlaced + 1,
    })),
  resetGame: () => set(initialState),
}));
