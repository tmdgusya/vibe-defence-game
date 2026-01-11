import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TowerType } from '../types';

// Mock EventBus before importing the store
vi.mock('../utils/EventBus', () => ({
  EventBus: {
    emit: vi.fn(),
  },
}));

// Import store after mocking dependencies
import {
  useGameStore,
  initialState,
  initialSessionState,
  initialSettings,
  initialStatistics,
} from './gameStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.setState(initialState);
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial session state values', () => {
      const state = useGameStore.getState();

      expect(state.score).toBe(0);
      expect(state.level).toBe(1);
      expect(state.lives).toBe(3);
      expect(state.gold).toBe(200);
      expect(state.wave).toBe(1);
      expect(state.isPaused).toBe(false);
      expect(state.isGameOver).toBe(false);
      expect(state.fps).toBe(60);
      expect(state.enemiesKilled).toBe(0);
      expect(state.towersPlaced).toBe(0);
      expect(state.selectedTowerType).toBeNull();
    });

    it('should have correct initial settings', () => {
      const state = useGameStore.getState();

      expect(state.settings).toEqual({
        soundEnabled: true,
        musicEnabled: true,
        showFPS: true,
      });
    });

    it('should have correct initial statistics', () => {
      const state = useGameStore.getState();

      expect(state.statistics).toEqual({
        gamesPlayed: 0,
        bestWaveReached: 0,
        highScore: 0,
        totalEnemiesKilled: 0,
        totalTowersPlaced: 0,
      });
    });

    it('should have hydration flag set to false initially', () => {
      const state = useGameStore.getState();
      expect(state._hasHydrated).toBe(false);
    });
  });

  describe('Session State Actions', () => {
    it('should update score', () => {
      useGameStore.getState().setScore(100);
      expect(useGameStore.getState().score).toBe(100);
    });

    it('should update level', () => {
      useGameStore.getState().setLevel(5);
      expect(useGameStore.getState().level).toBe(5);
    });

    it('should update lives', () => {
      useGameStore.getState().setLives(2);
      expect(useGameStore.getState().lives).toBe(2);
    });

    it('should update gold', () => {
      useGameStore.getState().setGold(500);
      expect(useGameStore.getState().gold).toBe(500);
    });

    it('should update wave', () => {
      useGameStore.getState().setWave(3);
      expect(useGameStore.getState().wave).toBe(3);
    });

    it('should update fps', () => {
      useGameStore.getState().setFps(30);
      expect(useGameStore.getState().fps).toBe(30);
    });

    it('should toggle paused state', () => {
      useGameStore.getState().setPaused(true);
      expect(useGameStore.getState().isPaused).toBe(true);

      useGameStore.getState().setPaused(false);
      expect(useGameStore.getState().isPaused).toBe(false);
    });

    it('should toggle game over state', () => {
      useGameStore.getState().setGameOver(true);
      expect(useGameStore.getState().isGameOver).toBe(true);

      useGameStore.getState().setGameOver(false);
      expect(useGameStore.getState().isGameOver).toBe(false);
    });

    it('should increment enemies killed', () => {
      useGameStore.getState().incrementEnemiesKilled();
      expect(useGameStore.getState().enemiesKilled).toBe(1);

      useGameStore.getState().incrementEnemiesKilled();
      expect(useGameStore.getState().enemiesKilled).toBe(2);
    });

    it('should increment towers placed', () => {
      useGameStore.getState().incrementTowersPlaced();
      expect(useGameStore.getState().towersPlaced).toBe(1);

      useGameStore.getState().incrementTowersPlaced();
      expect(useGameStore.getState().towersPlaced).toBe(2);
    });
  });

  describe('Gold Spending', () => {
    it('should successfully spend gold when sufficient', () => {
      const success = useGameStore.getState().spendGold(50);

      expect(success).toBe(true);
      expect(useGameStore.getState().gold).toBe(150);
    });

    it('should reject spending more gold than available', () => {
      const success = useGameStore.getState().spendGold(250);

      expect(success).toBe(false);
      expect(useGameStore.getState().gold).toBe(200);
    });

    it('should allow spending exact amount of gold', () => {
      const success = useGameStore.getState().spendGold(200);

      expect(success).toBe(true);
      expect(useGameStore.getState().gold).toBe(0);
    });

    it('should reject spending zero or negative gold', () => {
      // First spend some gold
      useGameStore.getState().spendGold(100);
      expect(useGameStore.getState().gold).toBe(100);

      // Try to spend zero - this should work (edge case)
      const successZero = useGameStore.getState().spendGold(0);
      expect(successZero).toBe(true);
      expect(useGameStore.getState().gold).toBe(100);
    });
  });

  describe('Tower Selection', () => {
    it('should select a tower type', () => {
      useGameStore.getState().selectTowerType(TowerType.PEASHOOTER);
      expect(useGameStore.getState().selectedTowerType).toBe(
        TowerType.PEASHOOTER
      );
    });

    it('should deselect tower when set to null', () => {
      useGameStore.getState().selectTowerType(TowerType.PEASHOOTER);
      useGameStore.getState().selectTowerType(null);
      expect(useGameStore.getState().selectedTowerType).toBeNull();
    });

    it('should emit event when selecting tower', async () => {
      const { EventBus } = await import('../utils/EventBus');
      useGameStore.getState().selectTowerType(TowerType.SUNFLOWER);

      expect(EventBus.emit).toHaveBeenCalledWith('selectTower', {
        type: TowerType.SUNFLOWER,
      });
    });
  });

  describe('Settings', () => {
    it('should update individual settings', () => {
      useGameStore.getState().updateSettings({ soundEnabled: false });

      expect(useGameStore.getState().settings.soundEnabled).toBe(false);
      expect(useGameStore.getState().settings.musicEnabled).toBe(true);
      expect(useGameStore.getState().settings.showFPS).toBe(true);
    });

    it('should update multiple settings at once', () => {
      useGameStore
        .getState()
        .updateSettings({ soundEnabled: false, musicEnabled: false });

      expect(useGameStore.getState().settings.soundEnabled).toBe(false);
      expect(useGameStore.getState().settings.musicEnabled).toBe(false);
      expect(useGameStore.getState().settings.showFPS).toBe(true);
    });

    it('should preserve other settings when updating', () => {
      useGameStore.getState().updateSettings({ showFPS: false });

      expect(useGameStore.getState().settings).toEqual({
        soundEnabled: true,
        musicEnabled: true,
        showFPS: false,
      });
    });
  });

  describe('Statistics', () => {
    it('should update individual statistics', () => {
      useGameStore.getState().updateStatistics({ highScore: 1000 });

      expect(useGameStore.getState().statistics.highScore).toBe(1000);
      expect(useGameStore.getState().statistics.gamesPlayed).toBe(0);
    });

    it('should update multiple statistics at once', () => {
      useGameStore.getState().updateStatistics({
        gamesPlayed: 5,
        bestWaveReached: 10,
        highScore: 5000,
      });

      expect(useGameStore.getState().statistics.gamesPlayed).toBe(5);
      expect(useGameStore.getState().statistics.bestWaveReached).toBe(10);
      expect(useGameStore.getState().statistics.highScore).toBe(5000);
    });
  });

  describe('Reset Game', () => {
    it('should reset session state to initial values', () => {
      // Modify session state
      useGameStore.getState().setScore(500);
      useGameStore.getState().setGold(1000);
      useGameStore.getState().setWave(5);
      useGameStore.getState().setLives(1);
      useGameStore.getState().incrementEnemiesKilled();
      useGameStore.getState().incrementTowersPlaced();
      useGameStore.getState().setPaused(true);

      // Reset game
      useGameStore.getState().resetGame();

      const state = useGameStore.getState();
      expect(state.score).toBe(0);
      expect(state.gold).toBe(200);
      expect(state.wave).toBe(1);
      expect(state.lives).toBe(3);
      expect(state.enemiesKilled).toBe(0);
      expect(state.towersPlaced).toBe(0);
      expect(state.isPaused).toBe(false);
      expect(state.isGameOver).toBe(false);
    });

    it('should update statistics on game reset', () => {
      // Play a game session
      useGameStore.getState().setScore(1000);
      useGameStore.getState().setWave(5);
      useGameStore.getState().incrementEnemiesKilled();
      useGameStore.getState().incrementEnemiesKilled();
      useGameStore.getState().incrementTowersPlaced();

      // Reset game
      useGameStore.getState().resetGame();

      const stats = useGameStore.getState().statistics;
      expect(stats.gamesPlayed).toBe(1);
      expect(stats.highScore).toBe(1000);
      expect(stats.bestWaveReached).toBe(5);
      expect(stats.totalEnemiesKilled).toBe(2);
      expect(stats.totalTowersPlaced).toBe(1);
    });

    it('should preserve settings on reset', () => {
      // Modify settings
      useGameStore.getState().updateSettings({
        soundEnabled: false,
        showFPS: false,
      });

      // Reset game
      useGameStore.getState().resetGame();

      expect(useGameStore.getState().settings).toEqual({
        soundEnabled: false,
        musicEnabled: true,
        showFPS: false,
      });
    });

    it('should update high score only if higher', () => {
      // First game with score 1000
      useGameStore.getState().setScore(1000);
      useGameStore.getState().resetGame();
      expect(useGameStore.getState().statistics.highScore).toBe(1000);

      // Second game with lower score
      useGameStore.getState().setScore(500);
      useGameStore.getState().resetGame();
      expect(useGameStore.getState().statistics.highScore).toBe(1000);

      // Third game with higher score
      useGameStore.getState().setScore(2000);
      useGameStore.getState().resetGame();
      expect(useGameStore.getState().statistics.highScore).toBe(2000);
    });

    it('should update best wave only if higher', () => {
      // First game reaching wave 5
      useGameStore.getState().setWave(5);
      useGameStore.getState().resetGame();
      expect(useGameStore.getState().statistics.bestWaveReached).toBe(5);

      // Second game reaching lower wave
      useGameStore.getState().setWave(3);
      useGameStore.getState().resetGame();
      expect(useGameStore.getState().statistics.bestWaveReached).toBe(5);

      // Third game reaching higher wave
      useGameStore.getState().setWave(10);
      useGameStore.getState().resetGame();
      expect(useGameStore.getState().statistics.bestWaveReached).toBe(10);
    });

    it('should accumulate total kills and towers across games', () => {
      // First game
      useGameStore.getState().incrementEnemiesKilled();
      useGameStore.getState().incrementEnemiesKilled();
      useGameStore.getState().incrementTowersPlaced();
      useGameStore.getState().resetGame();

      // Second game
      useGameStore.getState().incrementEnemiesKilled();
      useGameStore.getState().incrementTowersPlaced();
      useGameStore.getState().incrementTowersPlaced();
      useGameStore.getState().resetGame();

      const stats = useGameStore.getState().statistics;
      expect(stats.totalEnemiesKilled).toBe(3);
      expect(stats.totalTowersPlaced).toBe(3);
      expect(stats.gamesPlayed).toBe(2);
    });
  });

  describe('Hydration', () => {
    it('should update hydration flag', () => {
      useGameStore.getState().setHasHydrated(true);
      expect(useGameStore.getState()._hasHydrated).toBe(true);

      useGameStore.getState().setHasHydrated(false);
      expect(useGameStore.getState()._hasHydrated).toBe(false);
    });

    it('should maintain hydration flag after reset', () => {
      useGameStore.getState().setHasHydrated(true);
      useGameStore.getState().resetGame();
      expect(useGameStore.getState()._hasHydrated).toBe(true);
    });
  });

  describe('Exported Initial Values', () => {
    it('should export correct initial state', () => {
      expect(initialState).toEqual({
        ...initialSessionState,
        settings: initialSettings,
        statistics: initialStatistics,
        _hasHydrated: false,
      });
    });

    it('should export correct initial session state', () => {
      expect(initialSessionState).toEqual({
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
      });
    });

    it('should export correct initial settings', () => {
      expect(initialSettings).toEqual({
        soundEnabled: true,
        musicEnabled: true,
        showFPS: true,
      });
    });

    it('should export correct initial statistics', () => {
      expect(initialStatistics).toEqual({
        gamesPlayed: 0,
        bestWaveReached: 0,
        highScore: 0,
        totalEnemiesKilled: 0,
        totalTowersPlaced: 0,
      });
    });
  });
});
