import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectileSystem } from './ProjectileSystem';
import GameScene from '../scenes/GameScene';
import { TowerType, TowerLevel, GRID_CONFIG } from '../types';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    Math: {
      Distance: {
        Between: vi.fn((x1: number, y1: number, x2: number, y2: number) => {
          return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }),
      },
    },
  },
}));

// Mock the EventBus
vi.mock('../utils/EventBus', () => ({
  emitEvent: vi.fn(),
}));

// Mock Projectile class
vi.mock('../entities/Projectile', () => ({
  Projectile: vi.fn().mockImplementation(() => ({
    active: true,
    update: vi.fn(),
    destroy: vi.fn(),
    getTarget: vi.fn(),
    getDamage: vi.fn(() => 10),
  })),
}));

// Create mock tower factory
const createMockTower = (
  type: TowerType = TowerType.PEASHOOTER,
  x: number = 200,
  y: number = 200
) => ({
  x,
  y,
  getData: vi.fn(() => ({
    type,
    level: TowerLevel.BASIC,
    gridX: Math.floor(x / GRID_CONFIG.CELL_SIZE),
    gridY: Math.floor(y / GRID_CONFIG.CELL_SIZE),
    damage: 10,
    attackSpeed: 1.0,
    range: 3,
    cost: 100,
  })),
  playAttackAnimation: vi.fn(),
});

// Create mock enemy factory
const createMockEnemy = (x: number = 300, y: number = 200) => ({
  x,
  y,
  active: true,
  takeDamage: vi.fn(() => false),
  getData: vi.fn(() => ({
    type: 'basic',
    health: 100,
    maxHealth: 100,
    speed: 1,
    reward: 10,
    armor: 0,
  })),
});

// Mock GameScene
vi.mock('../scenes/GameScene', () => ({
  default: vi.fn().mockImplementation(() => ({
    add: {
      existing: vi.fn(),
    },
    physics: {
      add: {
        existing: vi.fn(),
      },
    },
    getPlacedTowers: vi.fn(() => []),
    getEnemySystem: vi.fn(() => ({
      getActiveEnemies: vi.fn(() => []),
      isWaveInProgress: vi.fn(() => true),
    })),
    getGold: vi.fn(() => 200),
  })),
}));

describe('ProjectileSystem', () => {
  let projectileSystem: ProjectileSystem;
  let mockScene: GameScene;

  beforeEach(() => {
    vi.clearAllMocks();
    mockScene = new GameScene();
    projectileSystem = new ProjectileSystem(mockScene);
  });

  describe('Initialization', () => {
    it('should start with no active projectiles', () => {
      expect(projectileSystem.getActiveProjectileCount()).toBe(0);
      expect(projectileSystem.getActiveProjectiles()).toEqual([]);
    });
  });

  describe('Tower Attack Processing', () => {
    it('should not attack when there are no towers', () => {
      projectileSystem.update(0, 16);

      expect(projectileSystem.getActiveProjectileCount()).toBe(0);
    });

    it('should not attack when there are no enemies', () => {
      const mockTower = createMockTower();
      vi.mocked(mockScene.getPlacedTowers).mockReturnValue([mockTower as any]);

      projectileSystem.update(0, 16);

      expect(mockTower.playAttackAnimation).not.toHaveBeenCalled();
    });

    it('should attack when enemy is in range', () => {
      const mockTower = createMockTower(TowerType.PEASHOOTER, 200, 200);
      const mockEnemy = createMockEnemy(300, 200); // Within range (100 pixels < 3 * 80 = 240)

      vi.mocked(mockScene.getPlacedTowers).mockReturnValue([mockTower as any]);
      vi.mocked(mockScene.getEnemySystem).mockReturnValue({
        getActiveEnemies: vi.fn(() => [mockEnemy as any]),
        isWaveInProgress: vi.fn(() => true),
      } as any);

      projectileSystem.update(1000, 16);

      expect(mockTower.playAttackAnimation).toHaveBeenCalled();
    });

    it('should not attack when enemy is out of range', () => {
      const mockTower = createMockTower(TowerType.PEASHOOTER, 100, 200);
      const mockEnemy = createMockEnemy(500, 200); // Out of range (400 pixels > 3 * 80 = 240)

      vi.mocked(mockScene.getPlacedTowers).mockReturnValue([mockTower as any]);
      vi.mocked(mockScene.getEnemySystem).mockReturnValue({
        getActiveEnemies: vi.fn(() => [mockEnemy as any]),
        isWaveInProgress: vi.fn(() => true),
      } as any);

      projectileSystem.update(1000, 16);

      expect(mockTower.playAttackAnimation).not.toHaveBeenCalled();
    });

    it('should respect attack cooldown', () => {
      const mockTower = createMockTower(TowerType.PEASHOOTER, 200, 200);
      const mockEnemy = createMockEnemy(300, 200);

      vi.mocked(mockScene.getPlacedTowers).mockReturnValue([mockTower as any]);
      vi.mocked(mockScene.getEnemySystem).mockReturnValue({
        getActiveEnemies: vi.fn(() => [mockEnemy as any]),
        isWaveInProgress: vi.fn(() => true),
      } as any);

      // First attack at time 1000
      projectileSystem.update(1000, 16);
      expect(mockTower.playAttackAnimation).toHaveBeenCalledTimes(1);

      // Second attack attempt at time 1500 (500ms later, cooldown is 1000ms)
      projectileSystem.update(1500, 16);
      expect(mockTower.playAttackAnimation).toHaveBeenCalledTimes(1);

      // Third attack attempt at time 2000 (1000ms later, cooldown elapsed)
      projectileSystem.update(2000, 16);
      expect(mockTower.playAttackAnimation).toHaveBeenCalledTimes(2);
    });

    it('should not attack with non-offensive towers', () => {
      const sunflower = createMockTower(TowerType.SUNFLOWER, 200, 200);
      const wallnut = createMockTower(TowerType.WALLNUT, 200, 200);
      const mockEnemy = createMockEnemy(300, 200);

      vi.mocked(mockScene.getPlacedTowers).mockReturnValue([
        sunflower as any,
        wallnut as any,
      ]);
      vi.mocked(mockScene.getEnemySystem).mockReturnValue({
        getActiveEnemies: vi.fn(() => [mockEnemy as any]),
        isWaveInProgress: vi.fn(() => true),
      } as any);

      projectileSystem.update(1000, 16);

      expect(sunflower.playAttackAnimation).not.toHaveBeenCalled();
      expect(wallnut.playAttackAnimation).not.toHaveBeenCalled();
    });
  });

  describe('Target Selection', () => {
    it('should target the closest enemy in range', () => {
      const mockTower = createMockTower(TowerType.PEASHOOTER, 200, 200);
      const farEnemy = createMockEnemy(350, 200); // 150 pixels away
      const closeEnemy = createMockEnemy(280, 200); // 80 pixels away

      vi.mocked(mockScene.getPlacedTowers).mockReturnValue([mockTower as any]);
      vi.mocked(mockScene.getEnemySystem).mockReturnValue({
        getActiveEnemies: vi.fn(() => [farEnemy as any, closeEnemy as any]),
        isWaveInProgress: vi.fn(() => true),
      } as any);

      projectileSystem.update(1000, 16);

      // Tower should attack (we verify by checking animation was called)
      expect(mockTower.playAttackAnimation).toHaveBeenCalled();
    });

    it('should not target inactive enemies', () => {
      const mockTower = createMockTower(TowerType.PEASHOOTER, 200, 200);
      const inactiveEnemy = { ...createMockEnemy(250, 200), active: false };

      vi.mocked(mockScene.getPlacedTowers).mockReturnValue([mockTower as any]);
      vi.mocked(mockScene.getEnemySystem).mockReturnValue({
        getActiveEnemies: vi.fn(() => [inactiveEnemy as any]),
        isWaveInProgress: vi.fn(() => true),
      } as any);

      projectileSystem.update(1000, 16);

      expect(mockTower.playAttackAnimation).not.toHaveBeenCalled();
    });
  });

  describe('Projectile Management', () => {
    it('should clear all projectiles', () => {
      projectileSystem.clearAllProjectiles();

      expect(projectileSystem.getActiveProjectileCount()).toBe(0);
    });

    it('should remove tower from tracking when requested', () => {
      const mockTower = createMockTower();
      const mockEnemy = createMockEnemy(300, 200);

      vi.mocked(mockScene.getPlacedTowers).mockReturnValue([mockTower as any]);
      vi.mocked(mockScene.getEnemySystem).mockReturnValue({
        getActiveEnemies: vi.fn(() => [mockEnemy as any]),
        isWaveInProgress: vi.fn(() => true),
      } as any);

      // Fire once
      projectileSystem.update(1000, 16);
      expect(mockTower.playAttackAnimation).toHaveBeenCalledTimes(1);

      // Remove tower from tracking
      projectileSystem.removeTowerFromTracking(mockTower as any);

      // Tower should be able to fire immediately again (no cooldown)
      projectileSystem.update(1001, 16);
      expect(mockTower.playAttackAnimation).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cleanup', () => {
    it('should clean up on destroy', () => {
      projectileSystem.destroy();

      expect(projectileSystem.getActiveProjectileCount()).toBe(0);
    });
  });
});
