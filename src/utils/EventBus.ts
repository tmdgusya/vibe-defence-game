import Phaser from 'phaser';
import { TowerType } from '../types';

/**
 * EventBus - Communication bridge between React and Phaser
 *
 * Uses Phaser's EventEmitter for type-safe event handling
 * between the React UI layer and the Phaser game engine.
 */
export const EventBus = new Phaser.Events.EventEmitter();

/**
 * Type definitions for event data
 */
export interface EventData {
  sceneReady: { scene: string };
  selectTower: {
    type: TowerType | null;
  };
  placementFailed: {
    reason:
      | 'insufficient_gold'
      | 'cell_occupied'
      | 'out_of_bounds'
      | 'no_tower_selected';
    message: string;
  };
  towerSelected: {
    tower: {
      type: string;
      level: number;
      gridX: number;
      gridY: number;
      damage: number;
      attackSpeed: number;
      range: number;
      cost: number;
    };
  };
  towerDeselected: Record<string, never>;
  towerUpgrade: {
    tower: {
      type: string;
      level: number;
      gridX: number;
      gridY: number;
      damage: number;
      attackSpeed: number;
      range: number;
      cost: number;
    };
    cost: number;
  };
  towerMerge: {
    tower: {
      type: string;
      level: number;
      gridX: number;
      gridY: number;
    };
  };
  mergeAvailable: {
    available: boolean;
  };
  towerPlaced: {
    tower: {
      type: string;
      level: number;
      gridX: number;
      gridY: number;
      damage: number;
      attackSpeed: number;
      range: number;
      cost: number;
    };
  };
  towerMerged: {
    result: {
      type: string;
      level: number;
      gridX: number;
      gridY: number;
    };
    consumed: Array<{
      type: string;
      level: number;
      gridX: number;
      gridY: number;
    }>;
  };
  towerSold: {
    tower: {
      type: string;
      level: number;
      gridX: number;
      gridY: number;
    };
    refund: number;
  };
  enemySpawned: {
    enemy: {
      type: string;
      health: number;
      speed: number;
    };
  };
  enemyKilled: {
    enemy: {
      type: string;
    };
    reward: number;
  };
  enemyReachedEnd: {
    enemy: {
      type: string;
    };
    damage: number;
  };
  waveStarted: {
    wave: number;
  };
  waveCompleted: {
    wave: number;
    bonus: number;
  };
  goldChanged: {
    gold: number;
    change: number;
  };
  livesChanged: {
    lives: number;
    change: number;
  };
  gameOver: {
    won: boolean;
    score: number;
  };
  gamePaused: Record<string, never>;
  gameResumed: Record<string, never>;
}

/**
 * Type-safe event subscription helper
 */
export function subscribeToEvent<K extends keyof EventData>(
  event: K,
  callback: (data: EventData[K]) => void
): void {
  EventBus.on(event, callback);
}

/**
 * Type-safe event emission helper
 */
export function emitEvent<K extends keyof EventData>(
  event: K,
  data: EventData[K]
): void {
  EventBus.emit(event, data);
}

/**
 * Unsubscribe from an event
 */
export function unsubscribeFromEvent<K extends keyof EventData>(
  event: K,
  callback?: (data: EventData[K]) => void
): void {
  if (callback) {
    EventBus.off(event, callback);
  } else {
    EventBus.off(event);
  }
}

export default EventBus;
