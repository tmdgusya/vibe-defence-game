import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnemySystem } from './EnemySystem';
import GameScene from '../scenes/GameScene';
import { EnemyType, GRID_CONFIG } from '../types';

// Mock the EventBus
vi.mock('../utils/EventBus', () => ({
  emitEvent: vi.fn(),
}));

// Mock the createEnemy function
vi.mock('../entities/EnemyTypes', () => ({
  createEnemy: vi.fn(() => ({
    getPath: vi.fn(() => []),
    moveAlongPath: vi.fn(),
    getData: vi.fn(() => ({
      type: EnemyType.BASIC,
      health: 100,
      maxHealth: 100,
      speed: 1,
      reward: 10,
      armor: 0,
    })),
    once: vi.fn(),
  })),
  BossEnemy: class BossEnemy {},
}));

// Mock GameScene
vi.mock('../scenes/GameScene', () => ({
  default: vi.fn().mockImplementation(() => ({
    time: {
      delayedCall: vi.fn((_delay, callback) => {
        // Immediately execute callback for testing
        callback();
        return { destroy: vi.fn() };
      }),
    },
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  })),
}));

describe('EnemySystem', () => {
  let enemySystem: EnemySystem;
  let mockScene: GameScene;

  beforeEach(() => {
    vi.clearAllMocks();
    mockScene = new GameScene();
    enemySystem = new EnemySystem(mockScene);
  });

  describe('Wave Configuration', () => {
    it('should return correct config for wave 1', () => {
      const config = enemySystem.getWaveConfig(1);

      expect(config.enemies).toHaveLength(1);
      expect(config.enemies[0].type).toBe(EnemyType.BASIC);
      expect(config.enemies[0].count).toBe(10); // Updated for balance patch!
      expect(config.spawnInterval).toBe(1500);
      expect(config.waveBonus).toBe(25);
    });

    it('should return correct config for wave 5', () => {
      const config = enemySystem.getWaveConfig(5);

      expect(config.enemies).toHaveLength(3);
      expect(config.enemies[0].type).toBe(EnemyType.BASIC);
      expect(config.enemies[1].type).toBe(EnemyType.FLYING);
      expect(config.enemies[2].type).toBe(EnemyType.BOSS);
      expect(config.waveBonus).toBe(75);
    });

    it('should return correct config for wave 10', () => {
      const config = enemySystem.getWaveConfig(10);

      expect(config.enemies).toHaveLength(4);
      expect(config.spawnInterval).toBe(800);
      expect(config.waveBonus).toBe(100);
    });

    it('should generate procedural config for waves beyond 10', () => {
      const config = enemySystem.getWaveConfig(15);

      expect(config.enemies.length).toBeGreaterThan(0);
      expect(config.spawnInterval).toBeLessThanOrEqual(800);
      expect(config.waveBonus).toBeGreaterThan(100);
    });

    it('should include boss in procedural waves every 5 waves', () => {
      const config15 = enemySystem.getWaveConfig(15);
      const config20 = enemySystem.getWaveConfig(20);

      const hasBoss15 = config15.enemies.some((e) => e.type === EnemyType.BOSS);
      const hasBoss20 = config20.enemies.some((e) => e.type === EnemyType.BOSS);

      expect(hasBoss15).toBe(true);
      expect(hasBoss20).toBe(true);
    });
  });

  describe('Difficulty Scaling', () => {
    it('should return 1 for wave 1', () => {
      const multiplier = enemySystem.getDifficultyMultiplier(1);
      expect(multiplier).toBe(1);
    });

    it('should increase difficulty with wave number', () => {
      const diff5 = enemySystem.getDifficultyMultiplier(5);
      const diff10 = enemySystem.getDifficultyMultiplier(10);
      const diff20 = enemySystem.getDifficultyMultiplier(20);

      expect(diff5).toBeGreaterThan(1);
      expect(diff10).toBeGreaterThan(diff5);
      expect(diff20).toBeGreaterThan(diff10);
    });
  });

  describe('Spawn Position', () => {
    it('should calculate correct spawn position for lane 0', () => {
      const pos = enemySystem.getSpawnPosition(0);

      expect(pos.x).toBe(GRID_CONFIG.WIDTH + GRID_CONFIG.CELL_SIZE / 2);
      expect(pos.y).toBe(GRID_CONFIG.CELL_SIZE / 2);
    });

    it('should calculate correct spawn position for lane 2 (middle)', () => {
      const pos = enemySystem.getSpawnPosition(2);

      expect(pos.x).toBe(GRID_CONFIG.WIDTH + GRID_CONFIG.CELL_SIZE / 2);
      expect(pos.y).toBe(2 * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2);
    });

    it('should calculate correct spawn position for lane 4 (bottom)', () => {
      const pos = enemySystem.getSpawnPosition(4);

      expect(pos.x).toBe(GRID_CONFIG.WIDTH + GRID_CONFIG.CELL_SIZE / 2);
      expect(pos.y).toBe(4 * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2);
    });
  });

  describe('Lane Selection', () => {
    it('should return a valid lane (0-4)', () => {
      for (let i = 0; i < 100; i++) {
        const lane = enemySystem.getRandomLane();
        expect(lane).toBeGreaterThanOrEqual(0);
        expect(lane).toBeLessThanOrEqual(4);
      }
    });
  });

  describe('Wave State Management', () => {
    it('should start with no wave in progress', () => {
      expect(enemySystem.isWaveInProgress()).toBe(false);
      expect(enemySystem.getCurrentWave()).toBe(0);
    });

    it('should track wave in progress after starting', () => {
      enemySystem.startWave(1);

      expect(enemySystem.isWaveInProgress()).toBe(true);
      expect(enemySystem.getCurrentWave()).toBe(1);
    });

    it('should not start a new wave while one is in progress', () => {
      enemySystem.startWave(1);
      enemySystem.startWave(2);

      expect(enemySystem.getCurrentWave()).toBe(1);
    });

    it('should stop wave when stopWave is called', () => {
      enemySystem.startWave(1);
      enemySystem.stopWave();

      expect(enemySystem.isWaveInProgress()).toBe(false);
    });
  });

  describe('Enemy Tracking', () => {
    it('should start with no active enemies', () => {
      expect(enemySystem.getActiveEnemyCount()).toBe(0);
      expect(enemySystem.getActiveEnemies()).toEqual([]);
    });

    it('should register enemies correctly', () => {
      const mockEnemy = { id: 1 } as any;

      enemySystem.registerEnemy(mockEnemy);

      expect(enemySystem.getActiveEnemyCount()).toBe(1);
      expect(enemySystem.getActiveEnemies()).toContain(mockEnemy);
    });

    it('should unregister enemies correctly', () => {
      const mockEnemy = { id: 1 } as any;

      enemySystem.registerEnemy(mockEnemy);
      enemySystem.unregisterEnemy(mockEnemy);

      expect(enemySystem.getActiveEnemyCount()).toBe(0);
      expect(enemySystem.getActiveEnemies()).not.toContain(mockEnemy);
    });

    it('should track multiple enemies', () => {
      const enemy1 = { id: 1 } as any;
      const enemy2 = { id: 2 } as any;
      const enemy3 = { id: 3 } as any;

      enemySystem.registerEnemy(enemy1);
      enemySystem.registerEnemy(enemy2);
      enemySystem.registerEnemy(enemy3);

      expect(enemySystem.getActiveEnemyCount()).toBe(3);

      enemySystem.unregisterEnemy(enemy2);

      expect(enemySystem.getActiveEnemyCount()).toBe(2);
      expect(enemySystem.getActiveEnemies()).toContain(enemy1);
      expect(enemySystem.getActiveEnemies()).not.toContain(enemy2);
      expect(enemySystem.getActiveEnemies()).toContain(enemy3);
    });
  });

  describe('Update Loop', () => {
    it('should not throw when update is called with no enemies', () => {
      expect(() => enemySystem.update(0, 16)).not.toThrow();
    });

    it('should not throw when update is called with regular enemies', () => {
      const mockEnemy = { id: 1 } as any;
      enemySystem.registerEnemy(mockEnemy);

      expect(() => enemySystem.update(0, 16)).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should clear all state on destroy', () => {
      const enemy1 = { id: 1 } as any;
      enemySystem.registerEnemy(enemy1);
      enemySystem.startWave(1);

      enemySystem.destroy();

      expect(enemySystem.getActiveEnemyCount()).toBe(0);
      expect(enemySystem.isWaveInProgress()).toBe(false);
    });
  });
});
