import { create } from 'zustand';
import { TowerType } from '../types';
import { EventBus } from '../utils/EventBus';

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
  gold: number;
  selectedTowerType: TowerType | null;
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
  setGold: (gold: number) => void;
  spendGold: (amount: number) => boolean;
  selectTowerType: (type: TowerType | null) => void;
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
  gold: 200,
  selectedTowerType: null,
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
  setGold: (gold) => set({ gold }),
  spendGold: (amount) => {
    let success = false;
    set((state) => {
      if (state.gold >= amount) {
        success = true;
        return { gold: state.gold - amount };
      }
      return {};
    });
    return success;
  },
  selectTowerType: (type) => {
    set({ selectedTowerType: type });
    EventBus.emit('selectTower', { type });
  },
}));
