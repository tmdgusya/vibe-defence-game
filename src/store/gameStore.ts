import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { TowerType } from '../types';
import { EventBus } from '../utils/EventBus';

// Settings interface (persisted)
interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  showFPS: boolean;
}

// Statistics interface (persisted)
interface Statistics {
  gamesPlayed: number;
  bestWaveReached: number;
  highScore: number;
  totalEnemiesKilled: number;
  totalTowersPlaced: number;
}

// Session state (game progress)
interface SessionState {
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

// Full game state
interface GameState extends SessionState {
  settings: Settings;
  statistics: Statistics;
  _hasHydrated: boolean;
}

interface GameActions {
  // Session actions
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  setLevel: (level: number) => void;
  setLives: (lives: number) => void;
  setPaused: (paused: boolean) => void;
  setGameOver: (gameOver: boolean) => void;
  setFps: (fps: number) => void;
  setWave: (wave: number) => void;
  incrementEnemiesKilled: () => void;
  incrementTowersPlaced: () => void;
  setGold: (gold: number) => void;
  spendGold: (amount: number) => boolean;
  selectTowerType: (type: TowerType | null) => void;

  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void;

  // Statistics actions
  updateStatistics: (stats: Partial<Statistics>) => void;

  // Game lifecycle
  resetGame: () => void;

  // Hydration
  setHasHydrated: (hydrated: boolean) => void;
}

const initialSettings: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  showFPS: true,
};

const initialStatistics: Statistics = {
  gamesPlayed: 0,
  bestWaveReached: 0,
  highScore: 0,
  totalEnemiesKilled: 0,
  totalTowersPlaced: 0,
};

const initialSessionState: SessionState = {
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

const initialState: GameState = {
  ...initialSessionState,
  settings: initialSettings,
  statistics: initialStatistics,
  _hasHydrated: false,
};

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Session setters
        setScore: (score) => set({ score }),
        addScore: (points) =>
          set((state) => ({
            score: state.score + points,
          })),
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

        // Settings
        updateSettings: (newSettings) =>
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          })),

        // Statistics
        updateStatistics: (newStats) =>
          set((state) => ({
            statistics: { ...state.statistics, ...newStats },
          })),

        // Reset game - updates lifetime statistics, then resets session
        resetGame: () => {
          const state = get();

          // Update lifetime statistics before resetting
          const updatedStatistics: Statistics = {
            gamesPlayed: state.statistics.gamesPlayed + 1,
            highScore: Math.max(state.statistics.highScore, state.score),
            bestWaveReached: Math.max(
              state.statistics.bestWaveReached,
              state.wave
            ),
            totalEnemiesKilled:
              state.statistics.totalEnemiesKilled + state.enemiesKilled,
            totalTowersPlaced:
              state.statistics.totalTowersPlaced + state.towersPlaced,
          };

          // Reset to initial session state, keep settings and updated statistics
          set({
            ...initialSessionState,
            settings: state.settings,
            statistics: updatedStatistics,
            _hasHydrated: true,
          });
        },

        // Hydration flag
        setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      }),
      {
        name: 'defence-game-storage',
        version: 1,
        // Persist full game session (exclude transient fps state)
        partialize: (state) => ({
          score: state.score,
          level: state.level,
          lives: state.lives,
          gold: state.gold,
          wave: state.wave,
          enemiesKilled: state.enemiesKilled,
          towersPlaced: state.towersPlaced,
          isPaused: state.isPaused,
          isGameOver: state.isGameOver,
          selectedTowerType: state.selectedTowerType,
          settings: state.settings,
          statistics: state.statistics,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true;
          }
        },
      }
    ),
    { name: 'GameStore', enabled: import.meta.env.DEV }
  )
);

// Export types for use in other modules
export type { GameState, GameActions, Settings, Statistics, SessionState };

// Export initial state for testing
export {
  initialState,
  initialSessionState,
  initialSettings,
  initialStatistics,
};
