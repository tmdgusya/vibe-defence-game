import Phaser from 'phaser';

export interface EnemySpriteConfig {
  key: string;
  path: string;
  frameWidth?: number;
  frameHeight?: number;
  animations?: {
    [key: string]: {
      prefix?: string;
      start: number;
      end: number;
      frameRate?: number;
      repeat?: number;
    };
  };
}

export const ENEMY_SPRITES: EnemySpriteConfig[] = [
  {
    key: 'enemy-basic',
    path: 'assets/enemies/basic/enemy-basic.png',
    frameWidth: 64,
    frameHeight: 64,
    animations: {
      idle: { prefix: 'idle-', start: 0, end: 3, frameRate: 8, repeat: -1 },
      walk: { prefix: 'walk-', start: 0, end: 7, frameRate: 12, repeat: -1 },
      hit: { prefix: 'hit-', start: 0, end: 2, frameRate: 16 },
      death: { prefix: 'death-', start: 0, end: 5, frameRate: 12 },
    },
  },
  {
    key: 'enemy-tank',
    path: 'assets/enemies/tank/enemy-tank.png',
    frameWidth: 80,
    frameHeight: 80,
    animations: {
      idle: { prefix: 'idle-', start: 0, end: 3, frameRate: 6, repeat: -1 },
      walk: { prefix: 'walk-', start: 0, end: 6, frameRate: 8, repeat: -1 },
      hit: { prefix: 'hit-', start: 0, end: 2, frameRate: 12 },
      death: { prefix: 'death-', start: 0, end: 8, frameRate: 10 },
    },
  },
  {
    key: 'enemy-flying',
    path: 'assets/enemies/flying/enemy-flying.png',
    frameWidth: 56,
    frameHeight: 56,
    animations: {
      idle: { prefix: 'fly-', start: 0, end: 7, frameRate: 12, repeat: -1 },
      hit: { prefix: 'hit-', start: 0, end: 3, frameRate: 16 },
      death: { prefix: 'death-', start: 0, end: 6, frameRate: 14 },
    },
  },
  {
    key: 'enemy-boss',
    path: 'assets/enemies/boss/enemy-boss.png',
    frameWidth: 96,
    frameHeight: 96,
    animations: {
      idle: { prefix: 'idle-', start: 0, end: 4, frameRate: 5, repeat: -1 },
      walk: { prefix: 'walk-', start: 0, end: 8, frameRate: 6, repeat: -1 },
      hit: { prefix: 'hit-', start: 0, end: 3, frameRate: 10 },
      death: { prefix: 'death-', start: 0, end: 12, frameRate: 8 },
      special: { prefix: 'special-', start: 0, end: 6, frameRate: 12 },
    },
  },
  {
    key: 'enemy-swarm',
    path: 'assets/enemies/swarm/enemy-swarm.png',
    frameWidth: 48,
    frameHeight: 48,
    animations: {
      idle: { prefix: 'idle-', start: 0, end: 3, frameRate: 10, repeat: -1 },
      walk: { prefix: 'walk-', start: 0, end: 5, frameRate: 15, repeat: -1 },
      hit: { prefix: 'hit-', start: 0, end: 1, frameRate: 20 },
      death: { prefix: 'death-', start: 0, end: 4, frameRate: 16 },
    },
  },
  {
    key: 'enemy-armored',
    path: 'assets/enemies/armored/enemy-armored.png',
    frameWidth: 72,
    frameHeight: 72,
    animations: {
      idle: { prefix: 'idle-', start: 0, end: 3, frameRate: 6, repeat: -1 },
      walk: { prefix: 'walk-', start: 0, end: 6, frameRate: 8, repeat: -1 },
      hit: { prefix: 'hit-', start: 0, end: 2, frameRate: 14 },
      death: { prefix: 'death-', start: 0, end: 7, frameRate: 10 },
    },
  },
];

export function loadEnemySprites(scene: Phaser.Scene): void {
  ENEMY_SPRITES.forEach((spriteConfig) => {
    scene.load.spritesheet(spriteConfig.key, spriteConfig.path, {
      frameWidth: spriteConfig.frameWidth || 64,
      frameHeight: spriteConfig.frameHeight || 64,
    });
  });
}

export function createEnemyAnimations(scene: Phaser.Scene): void {
  ENEMY_SPRITES.forEach((spriteConfig) => {
    if (spriteConfig.animations) {
      Object.entries(spriteConfig.animations).forEach(
        ([animKey, animConfig]) => {
          const frames: number[] = [];

          for (let i = animConfig.start; i <= animConfig.end; i++) {
            frames.push(i);
          }

          scene.anims.create({
            key: `${spriteConfig.key}-${animKey}`,
            frames: (() => {
              const frames = [];
              for (let i = animConfig.start; i <= animConfig.end; i++) {
                frames.push({
                  key: spriteConfig.key,
                  frame: i,
                });
              }
              return frames;
            })(),
            frameRate: animConfig.frameRate || 10,
            repeat: animConfig.repeat || 0,
          });
        }
      );
    }
  });
}

export function getEnemyAssetPaths(): string[] {
  return ENEMY_SPRITES.map((sprite) => sprite.path);
}
