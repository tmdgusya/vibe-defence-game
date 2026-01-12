/* eslint-disable no-undef, no-magic-numbers */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollisionSystem } from './CollisionSystem';
import { TowerType } from '../types';
import Phaser from 'phaser';

// Mock Phaser - inline class definition since vi.mock is hoisted
vi.mock('phaser', () => {
  class MockEventEmitter {
    private listeners: Map<string, Function[]> = new Map();
    on(event: string, fn: Function) {
      if (!this.listeners.has(event)) this.listeners.set(event, []);
      this.listeners.get(event)!.push(fn);
      return this;
    }
    emit(event: string, ...args: any[]) {
      const fns = this.listeners.get(event) || [];
      fns.forEach((fn) => fn(...args));
      return this;
    }
    off() {
      return this;
    }
  }

  return {
    default: {
      Math: {
        Distance: {
          Between: (x1: number, y1: number, x2: number, y2: number) =>
            Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        },
      },
      Geom: {
        Rectangle: {
          Overlaps: (rect1: any, rect2: any) => {
            return !(
              rect1.x + rect1.width < rect2.x ||
              rect2.x + rect2.width < rect1.x ||
              rect1.y + rect1.height < rect2.y ||
              rect2.y + rect2.height < rect1.y
            );
          },
        },
      },
      Events: {
        EventEmitter: MockEventEmitter,
      },
    },
  };
});

const createMockProjectile = (
  x: number,
  y: number,
  damage: number,
  splashRadius?: number,
  target?: any
) => {
  // Create hitEnemies Set once to persist across getData() calls
  const hitEnemies = new Set<any>();
  const data = {
    damage,
    splashDamage: splashRadius ? damage * 2 : 0,
    splashRadius,
    splashDamageMultiplier: 0.5,
    hitEnemies,
  };

  return {
    active: true,
    x,
    y,
    body: { x: x - 6, y: y - 6, width: 12, height: 12 },
    getData: () => data,
    getTarget: () => target || null,
    destroy: vi.fn(),
  };
};

const createMockEnemy = (x: number, y: number, armor: number = 0) => ({
  active: true,
  x,
  y,
  body: { x: x - 6, y: y - 6, width: 12, height: 12 },
  getData: () => ({ armor, health: 100, type: 'basic' }),
  takeDamage: vi.fn().mockReturnValue(false),
});

describe('CollisionSystem', () => {
  let mockScene: any;
  let collisionSystem: CollisionSystem;

  beforeEach(() => {
    mockScene = {
      getProjectileSystem: () => ({
        getActiveProjectiles: () => [],
      }),
      getEnemySystem: () => ({
        getActiveEnemies: () => [],
      }),
      getPlacedTowers: () => [],
      add: {
        graphics: () => ({
          setDepth: vi.fn().mockReturnThis(),
          setVisible: vi.fn().mockReturnThis(),
          setPosition: vi.fn().mockReturnThis(),
          clear: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          fillStyle: vi.fn().mockReturnThis(),
          strokeCircle: vi.fn().mockReturnThis(),
          fillCircle: vi.fn().mockReturnThis(),
          strokeRect: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        }),
      },
      cameras: {
        main: {
          shake: vi.fn(),
        },
      },
      tweens: {
        add: vi.fn(() => ({
          targets: vi.fn(),
          duration: 300,
          ease: 'Quad.easeOut',
          onComplete: vi.fn(),
        })),
      },
      input: {
        keyboard: {
          on: vi.fn(),
        },
      },
    };

    collisionSystem = new CollisionSystem(mockScene);
    collisionSystem.init();
  });

  it('should apply damage to hit enemy', () => {
    const enemy = createMockEnemy(105, 105, 0);
    const projectile = createMockProjectile(100, 100, 10, undefined, enemy);

    mockScene.getProjectileSystem = () => ({
      getActiveProjectiles: () => [projectile],
    });
    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy],
    });

    collisionSystem.update(0, 16);

    expect(enemy.takeDamage).toHaveBeenCalledWith(10);
    expect(projectile.destroy).toHaveBeenCalled();
  });

  it('should reduce damage by armor', () => {
    const enemy = createMockEnemy(105, 105, 2);
    const projectile = createMockProjectile(100, 100, 10, undefined, enemy);

    mockScene.getProjectileSystem = () => ({
      getActiveProjectiles: () => [projectile],
    });
    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy],
    });

    collisionSystem.update(0, 16);

    expect(enemy.takeDamage).toHaveBeenCalledWith(10);
    expect(projectile.destroy).toHaveBeenCalled();
  });

  it('should apply splash damage to multiple enemies', () => {
    const projectile = createMockProjectile(100, 100, 10, 1.5);
    const enemy1 = createMockEnemy(100, 100, 0);
    const enemy2 = createMockEnemy(100, 120, 0);

    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy1, enemy2],
    });

    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy1, enemy2],
    });

    mockScene.getProjectileSystem = () => ({
      getActiveProjectiles: () => [projectile],
    });

    collisionSystem.update(0, 16);

    expect(enemy1.takeDamage).toHaveBeenCalledWith(10);
    expect(enemy2.takeDamage).toHaveBeenCalledWith(10);
    expect(projectile.destroy).toHaveBeenCalled();
  });

  it('should prevent double damage to same enemy', () => {
    const projectile = createMockProjectile(100, 100, 10, 1.5);
    const enemy = createMockEnemy(105, 105, 0);

    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy],
    });

    mockScene.getProjectileSystem = () => ({
      getActiveProjectiles: () => [projectile],
    });

    collisionSystem.update(0, 16);

    collisionSystem.update(0, 16);

    expect(enemy.takeDamage).toHaveBeenCalledTimes(1);
  });

  it('should stop enemy when blocked by wallnut', () => {
    const tower = {
      getData: () => ({ type: TowerType.WALLNUT }),
      x: 100,
      y: 100,
    };

    // Enemy within TOWER_BLOCK_DISTANCE (40) of tower
    const enemy = {
      active: true,
      x: 130,
      y: 100,
      stop: vi.fn(),
    };

    mockScene.getPlacedTowers = () => [tower];
    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy],
    });

    collisionSystem.update(0, 16);

    expect(enemy.stop).toHaveBeenCalled();
  });

  it('should not block enemy for non-wallnut towers', () => {
    const tower = {
      getData: () => ({ type: TowerType.PEASHOOTER }),
      x: 100,
      y: 100,
    };

    const enemy = {
      active: true,
      x: 145,
      y: 105,
      stop: vi.fn(),
    };

    mockScene.getPlacedTowers = () => [tower];
    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy],
    });

    collisionSystem.update(0, 16);

    expect(enemy.stop).not.toHaveBeenCalled();
  });
});
