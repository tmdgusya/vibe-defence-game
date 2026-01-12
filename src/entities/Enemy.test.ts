import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnemyType } from '../types';
import { createEnemy, getEnemyConfig } from '../entities';

describe('Enemy System', () => {
  let mockScene: any;

  beforeEach(() => {
    const createMockSprite = () => ({
      setScale: vi.fn().mockReturnThis(),
      setOrigin: vi.fn().mockReturnThis(),
      setTint: vi.fn().mockReturnThis(),
      clearTint: vi.fn().mockReturnThis(),
      play: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
      width: 64,
      height: 64,
      anims: {
        exists: vi.fn().mockReturnValue(false),
      },
    });

    const createMockGraphics = () => ({
      clear: vi.fn().mockReturnThis(),
      fillStyle: vi.fn().mockReturnThis(),
      fillRect: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
    });

    mockScene = {
      add: {
        existing: vi.fn(),
        sprite: vi.fn().mockImplementation(createMockSprite),
        graphics: vi.fn().mockImplementation(createMockGraphics),
      },
      // scene.make is used for Container children (doesn't auto-add to scene)
      make: {
        sprite: vi.fn().mockImplementation(createMockSprite),
        graphics: vi.fn().mockImplementation(createMockGraphics),
      },
      physics: {
        add: {
          existing: vi.fn(),
        },
      },
      tweens: {
        add: vi.fn(),
        chain: vi.fn().mockReturnValue({
          on: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
          restart: vi.fn(),
        }),
      },
      time: {
        delayedCall: vi.fn(),
      },
      events: {
        emit: vi.fn(),
      },
    };
  });

  it('should create enemy with correct config for each type', () => {
    const enemyTypes = Object.values(EnemyType);

    enemyTypes.forEach((type) => {
      const config = getEnemyConfig(type);
      expect(config.type).toBe(type);
      expect(config.health).toBeGreaterThan(0);
      expect(config.speed).toBeGreaterThan(0);
      expect(config.reward).toBeGreaterThan(0);
      expect(config.spriteKey).toBeDefined();
    });
  });

  it('should create different enemy types using factory', () => {
    const startX = 100;
    const startY = 200;

    const basicEnemy = createEnemy(mockScene, EnemyType.BASIC, startX, startY);
    const tankEnemy = createEnemy(mockScene, EnemyType.TANK, startX, startY);
    const flyingEnemy = createEnemy(
      mockScene,
      EnemyType.FLYING,
      startX,
      startY
    );
    const bossEnemy = createEnemy(mockScene, EnemyType.BOSS, startX, startY);
    const swarmEnemy = createEnemy(mockScene, EnemyType.SWARM, startX, startY);
    const armoredEnemy = createEnemy(
      mockScene,
      EnemyType.ARMORED,
      startX,
      startY
    );

    expect(basicEnemy.getData().type).toBe(EnemyType.BASIC);
    expect(tankEnemy.getData().type).toBe(EnemyType.TANK);
    expect(flyingEnemy.getData().type).toBe(EnemyType.FLYING);
    expect(bossEnemy.getData().type).toBe(EnemyType.BOSS);
    expect(swarmEnemy.getData().type).toBe(EnemyType.SWARM);
    expect(armoredEnemy.getData().type).toBe(EnemyType.ARMORED);
  });

  it('should have correct health values for each enemy type', () => {
    const basic = getEnemyConfig(EnemyType.BASIC);
    const tank = getEnemyConfig(EnemyType.TANK);
    const flying = getEnemyConfig(EnemyType.FLYING);
    const boss = getEnemyConfig(EnemyType.BOSS);
    const swarm = getEnemyConfig(EnemyType.SWARM);
    const armored = getEnemyConfig(EnemyType.ARMORED);

    expect(boss.health).toBeGreaterThan(tank.health);
    expect(tank.health).toBeGreaterThan(armored.health);
    expect(armored.health).toBeGreaterThan(basic.health);
    expect(basic.health).toBeGreaterThan(flying.health);
    expect(flying.health).toBeGreaterThan(swarm.health);
  });

  it('should have appropriate speed values for each enemy type', () => {
    const basic = getEnemyConfig(EnemyType.BASIC);
    const tank = getEnemyConfig(EnemyType.TANK);
    const flying = getEnemyConfig(EnemyType.FLYING);
    const boss = getEnemyConfig(EnemyType.BOSS);
    const swarm = getEnemyConfig(EnemyType.SWARM);
    const armored = getEnemyConfig(EnemyType.ARMORED);

    expect(swarm.speed).toBeGreaterThan(flying.speed);
    expect(flying.speed).toBeGreaterThan(basic.speed);
    expect(basic.speed).toBeGreaterThan(armored.speed);
    expect(armored.speed).toBeGreaterThan(tank.speed);
    expect(tank.speed).toBeGreaterThan(boss.speed);
  });

  it('should have appropriate reward values for each enemy type', () => {
    const basic = getEnemyConfig(EnemyType.BASIC);
    const tank = getEnemyConfig(EnemyType.TANK);
    const flying = getEnemyConfig(EnemyType.FLYING);
    const boss = getEnemyConfig(EnemyType.BOSS);
    const swarm = getEnemyConfig(EnemyType.SWARM);
    const armored = getEnemyConfig(EnemyType.ARMORED);

    expect(boss.reward).toBeGreaterThan(armored.reward);
    expect(armored.reward).toBeGreaterThan(tank.reward);
    expect(tank.reward).toBeGreaterThan(flying.reward);
    expect(flying.reward).toBeGreaterThan(basic.reward);
    expect(basic.reward).toBeGreaterThan(swarm.reward);
  });

  it('should have appropriate armor values for armored enemies', () => {
    const basic = getEnemyConfig(EnemyType.BASIC);
    const tank = getEnemyConfig(EnemyType.TANK);
    const flying = getEnemyConfig(EnemyType.FLYING);
    const boss = getEnemyConfig(EnemyType.BOSS);
    const swarm = getEnemyConfig(EnemyType.SWARM);
    const armored = getEnemyConfig(EnemyType.ARMORED);

    expect(boss.armor).toBeGreaterThanOrEqual(armored.armor);
    expect(armored.armor).toBeGreaterThanOrEqual(tank.armor);
    expect(tank.armor).toBeGreaterThanOrEqual(0);
    expect(basic.armor).toBe(0);
    expect(flying.armor).toBe(0);
    expect(swarm.armor).toBe(0);
  });
});
