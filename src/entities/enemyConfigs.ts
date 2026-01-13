import { EnemyType } from '../types';
import { EnemyConfig } from './Enemy';

/**
 * Enemy Balance Design (Mathematical Foundation)
 * ================================================
 *
 * Base assumptions:
 * - PEASHOOTER BASIC: 10 DPS, 3-cell range
 * - Enemy path: 9 cells, time in range ≈ 6s at speed 1.0
 * - Formula: Max HP = DPS × time_in_range × tower_count_expected
 *
 * Wave difficulty scaling:
 * - Wave 1-3: 1 tower should kill basic enemies
 * - Wave 4-6: 2 towers needed for harder enemies
 * - Wave 7-10: Multiple towers + strategy required
 */
export const ENEMY_CONFIGS: Record<EnemyType, Omit<EnemyConfig, 'type'>> = {
  // BASIC: 1 PEASHOOTER kills easily (25 HP / 10 DPS = 2.5s)
  [EnemyType.BASIC]: {
    health: 25,
    speed: 1.0,
    reward: 10,
    armor: 0,
    spriteKey: 'enemy-basic',
    scale: 1.0,
  },

  // TANK: Slow, 1 tower can kill (50 HP, 12s in range = 108 damage after armor)
  [EnemyType.TANK]: {
    health: 50,
    speed: 0.5,
    reward: 20,
    armor: 1,
    spriteKey: 'enemy-tank',
    scale: 1.2,
  },

  // FLYING: Fast but fragile (20 HP in 4s = needs 20 damage)
  [EnemyType.FLYING]: {
    health: 20,
    speed: 1.5,
    reward: 12,
    armor: 0,
    spriteKey: 'enemy-flying',
    scale: 0.9,
  },

  // BOSS: Needs 2-3 towers focused (150 HP, 20s in range)
  [EnemyType.BOSS]: {
    health: 150,
    speed: 0.3,
    reward: 100,
    armor: 1,
    spriteKey: 'enemy-boss',
    scale: 1.5,
  },

  // SWARM: Very fast, very weak (10 HP)
  [EnemyType.SWARM]: {
    health: 10,
    speed: 2.0,
    reward: 5,
    armor: 0,
    spriteKey: 'enemy-swarm',
    scale: 0.7,
  },

  // ARMORED: Medium speed, some armor (40 HP)
  [EnemyType.ARMORED]: {
    health: 40,
    speed: 0.7,
    reward: 25,
    armor: 1,
    spriteKey: 'enemy-armored',
    scale: 1.1,
  },
};

export function getEnemyConfig(type: EnemyType): EnemyConfig {
  return {
    type,
    ...ENEMY_CONFIGS[type],
  };
}

export function getEnemySpriteKeys(): string[] {
  return Object.values(EnemyType).map((type) => ENEMY_CONFIGS[type].spriteKey);
}
