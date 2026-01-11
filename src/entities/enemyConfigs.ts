import { EnemyType } from '../types';
import { EnemyConfig } from './Enemy';

export const ENEMY_CONFIGS: Record<EnemyType, Omit<EnemyConfig, 'type'>> = {
  [EnemyType.BASIC]: {
    health: 100,
    speed: 1.0,
    reward: 10,
    armor: 0,
    spriteKey: 'enemy-basic',
    scale: 1.0,
  },

  [EnemyType.TANK]: {
    health: 500,
    speed: 0.5,
    reward: 25,
    armor: 2,
    spriteKey: 'enemy-tank',
    scale: 1.2,
  },

  [EnemyType.FLYING]: {
    health: 75,
    speed: 1.5,
    reward: 15,
    armor: 0,
    spriteKey: 'enemy-flying',
    scale: 0.9,
  },

  [EnemyType.BOSS]: {
    health: 2000,
    speed: 0.3,
    reward: 100,
    armor: 5,
    spriteKey: 'enemy-boss',
    scale: 1.5,
  },

  [EnemyType.SWARM]: {
    health: 25,
    speed: 2.0,
    reward: 5,
    armor: 0,
    spriteKey: 'enemy-swarm',
    scale: 0.7,
  },

  [EnemyType.ARMORED]: {
    health: 300,
    speed: 0.7,
    reward: 35,
    armor: 3,
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
