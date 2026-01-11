/* eslint-disable no-undef, no-magic-numbers */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollisionSystem } from './CollisionSystem';
import { TowerType } from '../types';
import GameScene from '../scenes/GameScene';

const createMockProjectile = (
  x: number,
  y: number,
  damage: number,
  splashRadius?: number
) => ({
  active: true,
  x,
  y,
  getData: () => ({
    damage,
    splashDamage: splashRadius ? damage * 2 : 0,
    splashRadius,
    splashDamageMultiplier: 0.5,
    hitEnemies: new Set<any>(),
  }),
  destroy: vi.fn(),
});

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
          setDepth: vi.fn(),
          setVisible: vi.fn(),
          clear: vi.fn(),
          lineStyle: vi.fn(),
          strokeCircle: vi.fn(),
          strokeRect: vi.fn(),
          destroy: vi.fn(),
        }),
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
  });

  it('should apply damage to hit enemy', () => {
    const projectile = createMockProjectile(100, 100, 10);
    const enemy = createMockEnemy(105, 105, 0);

    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy],
    });

    collisionSystem.update(0, 16);

    expect(enemy.takeDamage).toHaveBeenCalledWith(10);
    expect(projectile.destroy).toHaveBeenCalled();
  });

  it('should reduce damage by armor', () => {
    const projectile = createMockProjectile(100, 100, 10);
    const enemy = createMockEnemy(105, 105, 2);

    mockScene.getEnemySystem = () => ({
      getActiveEnemies: () => [enemy],
    });

    collisionSystem.update(0, 16);

    expect(enemy.takeDamage).toHaveBeenCalledWith(8);
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
