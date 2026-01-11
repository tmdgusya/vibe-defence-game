import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TowerSystem } from './TowerSystem';
import GameScene from '../scenes/GameScene';
import { TowerType, TowerLevel } from '../types';

vi.mock('../scenes/GameScene', () => ({
  default: vi.fn().mockImplementation(() => ({
    isCellAvailable: vi.fn((x, y) => x >= 0 && x < 9 && y >= 0 && y < 5),
  })),
}));

describe('TowerSystem', () => {
  let towerSystem: TowerSystem;
  let mockScene: GameScene;

  beforeEach(() => {
    mockScene = new GameScene();
    towerSystem = new TowerSystem(mockScene);
  });

  describe('Tower Configuration', () => {
    it('should return correct stats for basic peashooter', () => {
      const stats = towerSystem.getTowerStats(
        TowerType.PEASHOOTER,
        TowerLevel.BASIC
      );

      expect(stats.damage).toBe(10);
      expect(stats.attackSpeed).toBe(1.0);
      expect(stats.range).toBe(3);
      expect(stats.cost).toBe(100);
    });

    it('should return correct stats for elite peashooter', () => {
      const stats = towerSystem.getTowerStats(
        TowerType.PEASHOOTER,
        TowerLevel.ELITE
      );

      expect(stats.damage).toBe(22);
      expect(stats.attackSpeed).toBe(1.44);
      expect(stats.range).toBe(3.63);
      expect(stats.cost).toBe(250);
    });

    it('should return correct stats for basic sunflower', () => {
      const stats = towerSystem.getTowerStats(
        TowerType.SUNFLOWER,
        TowerLevel.BASIC
      );

      expect(stats.damage).toBe(0);
      expect(stats.attackSpeed).toBe(0);
      expect(stats.range).toBe(1);
      expect(stats.cost).toBe(50);
    });

    it('should return correct stats for elite wallnut', () => {
      const stats = towerSystem.getTowerStats(
        TowerType.WALLNUT,
        TowerLevel.ELITE
      );

      expect(stats.damage).toBe(0);
      expect(stats.attackSpeed).toBe(0);
      expect(stats.range).toBe(0.5);
      expect(stats.cost).toBe(185);
    });
  });

  describe('Tower Data Creation', () => {
    it('should create tower data with correct properties', () => {
      const towerData = towerSystem.createTowerData(
        TowerType.PEASHOOTER,
        TowerLevel.ADVANCED,
        3,
        2
      );

      expect(towerData.type).toBe(TowerType.PEASHOOTER);
      expect(towerData.level).toBe(TowerLevel.ADVANCED);
      expect(towerData.gridX).toBe(3);
      expect(towerData.gridY).toBe(2);
      expect(towerData.damage).toBe(15);
      expect(towerData.attackSpeed).toBe(1.2);
      expect(towerData.range).toBe(3.3);
      expect(towerData.cost).toBe(175);
    });
  });

  describe('Placement Validation', () => {
    it('should validate valid placement positions', () => {
      const result = towerSystem.validatePlacement(2, 3);

      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should reject out of bounds positions', () => {
      const result1 = towerSystem.validatePlacement(-1, 0);
      const result2 = towerSystem.validatePlacement(9, 0);
      const result3 = towerSystem.validatePlacement(0, 5);

      expect(result1.valid).toBe(false);
      expect(result1.reason).toBe('Position out of bounds');

      expect(result2.valid).toBe(false);
      expect(result2.reason).toBe('Position out of bounds');

      expect(result3.valid).toBe(false);
      expect(result3.reason).toBe('Position out of bounds');
    });

    it('should reject occupied cells', () => {
      const mockSceneOccupied = {
        isCellAvailable: vi.fn(() => false),
      } as any;

      const towerSystemOccupied = new TowerSystem(mockSceneOccupied);
      const result = towerSystemOccupied.validatePlacement(2, 2);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Cell already occupied');
    });
  });

  describe('Economy Management', () => {
    it('should calculate correct upgrade costs', () => {
      const basicToAdvanced = towerSystem.getUpgradeCost(
        TowerType.PEASHOOTER,
        TowerLevel.BASIC
      );
      const advancedToElite = towerSystem.getUpgradeCost(
        TowerType.PEASHOOTER,
        TowerLevel.ADVANCED
      );
      const eliteUpgrade = towerSystem.getUpgradeCost(
        TowerType.PEASHOOTER,
        TowerLevel.ELITE
      );

      expect(basicToAdvanced).toBe(75);
      expect(advancedToElite).toBe(75);
      expect(eliteUpgrade).toBe(0);
    });

    it('should determine affordable towers', () => {
      const affordable75 = towerSystem.getAffordableTowers(75);
      const affordable100 = towerSystem.getAffordableTowers(100);
      const affordable25 = towerSystem.getAffordableTowers(25);

      expect(affordable25).toEqual([]);
      expect(affordable75).toEqual([TowerType.SUNFLOWER, TowerType.WALLNUT]);
      expect(affordable100).toEqual([
        TowerType.SUNFLOWER,
        TowerType.WALLNUT,
        TowerType.PEASHOOTER,
      ]);
    });

    it('should check upgrade affordability', () => {
      const canUpgrade = towerSystem.canAffordUpgrade(
        TowerType.PEASHOOTER,
        TowerLevel.BASIC,
        80
      );
      const cannotUpgrade = towerSystem.canAffordUpgrade(
        TowerType.PEASHOOTER,
        TowerLevel.BASIC,
        50
      );

      expect(canUpgrade).toBe(true);
      expect(cannotUpgrade).toBe(false);
    });
  });

  describe('Merge System', () => {
    it('should merge identical adjacent towers', () => {
      const tower1 = {
        type: TowerType.PEASHOOTER,
        level: TowerLevel.BASIC,
        gridX: 2,
        gridY: 2,
        damage: 10,
        attackSpeed: 1,
        range: 3,
        cost: 100,
      };

      const tower2 = {
        type: TowerType.PEASHOOTER,
        level: TowerLevel.BASIC,
        gridX: 3,
        gridY: 2,
        damage: 10,
        attackSpeed: 1,
        range: 3,
        cost: 100,
      };

      const result = towerSystem.getMergeResult(tower1, tower2);

      expect(result).not.toBeNull();
      expect(result!.type).toBe(TowerType.PEASHOOTER);
      expect(result!.level).toBe(TowerLevel.ADVANCED);
      expect(result!.gridX).toBe(2);
      expect(result!.gridY).toBe(2);
      expect(result!.damage).toBe(15);
    });

    it('should reject merging different tower types', () => {
      const tower1 = {
        type: TowerType.PEASHOOTER,
        level: TowerLevel.BASIC,
        gridX: 2,
        gridY: 2,
        damage: 10,
        attackSpeed: 1,
        range: 3,
        cost: 100,
      };

      const tower2 = {
        type: TowerType.SUNFLOWER,
        level: TowerLevel.BASIC,
        gridX: 3,
        gridY: 2,
        damage: 0,
        attackSpeed: 0,
        range: 1,
        cost: 50,
      };

      const result = towerSystem.getMergeResult(tower1, tower2);
      expect(result).toBeNull();
    });

    it('should check merge validity correctly', () => {
      const tower1 = {
        type: TowerType.PEASHOOTER,
        level: TowerLevel.BASIC,
        gridX: 2,
        gridY: 2,
        damage: 10,
        attackSpeed: 1,
        range: 3,
        cost: 100,
      };

      const adjacentTower = {
        type: TowerType.PEASHOOTER,
        level: TowerLevel.BASIC,
        gridX: 3,
        gridY: 2,
        damage: 10,
        attackSpeed: 1,
        range: 3,
        cost: 100,
      };

      const distantTower = {
        type: TowerType.PEASHOOTER,
        level: TowerLevel.BASIC,
        gridX: 5,
        gridY: 2,
        damage: 10,
        attackSpeed: 1,
        range: 3,
        cost: 100,
      };

      expect(towerSystem.canMerge(tower1, adjacentTower)).toBe(true);
      expect(towerSystem.canMerge(tower1, distantTower)).toBe(false);
    });
  });

  describe('Tower Information', () => {
    it('should provide tower descriptions', () => {
      expect(towerSystem.getTowerDescription(TowerType.PEASHOOTER)).toBe(
        'Basic offensive tower that shoots projectiles at enemies'
      );
      expect(towerSystem.getTowerDescription(TowerType.SUNFLOWER)).toBe(
        'Economy tower that generates resources over time'
      );
      expect(towerSystem.getTowerDescription(TowerType.WALLNUT)).toBe(
        'Defensive barrier that blocks enemy progress'
      );
    });

    it('should provide tower abilities', () => {
      expect(towerSystem.getTowerAbility(TowerType.PEASHOOTER)).toBe(
        'Ranged Attack'
      );
      expect(towerSystem.getTowerAbility(TowerType.SUNFLOWER)).toBe(
        'Resource Generation'
      );
      expect(towerSystem.getTowerAbility(TowerType.WALLNUT)).toBe('Block Path');
    });
  });
});
