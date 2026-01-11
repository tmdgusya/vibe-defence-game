import Phaser from 'phaser';
import { GAME_CONFIG } from '../types';
import BootScene from '../scenes/BootScene';
import GameScene from '../scenes/GameScene';

/**
 * Phaser game configuration
 * WebGL rendering with Canvas2D fallback
 */
export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas2D fallback
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  parent: 'phaser-container',
  backgroundColor: '#2c3e50',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: import.meta.env.DEV, // Debug in development only
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true,
  },
  scene: [BootScene, GameScene],
  fps: {
    target: GAME_CONFIG.FPS,
    forceSetTimeOut: false,
  },
};

export default phaserConfig;
