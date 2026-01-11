/**
 * Core type definitions for the Defence Game
 */

// Grid configuration
export const GRID_CONFIG = {
  ROWS: 5,
  COLS: 9,
  CELL_SIZE: 80,
  WIDTH: 720, // 9 * 80
  HEIGHT: 400, // 5 * 80
} as const;

// Game dimensions
export const GAME_CONFIG = {
  WIDTH: 720,
  HEIGHT: 400,
  FPS: 60,
} as const;

// Tower types
export enum TowerType {
  PEASHOOTER = 'peashooter',
  SUNFLOWER = 'sunflower',
  WALLNUT = 'wallnut',
}

// Tower levels (merge progression)
export enum TowerLevel {
  BASIC = 1,
  ADVANCED = 2,
  ELITE = 3,
}

// Enemy types
export enum EnemyType {
  BASIC = 'basic',
  TANK = 'tank',
  FLYING = 'flying',
  BOSS = 'boss',
  SWARM = 'swarm',
  ARMORED = 'armored',
}

// Game state
export interface GameState {
  gold: number;
  wave: number;
  lives: number;
  score: number;
  isPaused: boolean;
  isGameOver: boolean;
}

// Tower data
export interface TowerData {
  type: TowerType;
  level: TowerLevel;
  gridX: number;
  gridY: number;
  damage: number;
  attackSpeed: number;
  range: number;
  cost: number;
}

// Enemy data
export interface EnemyData {
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number;
  reward: number;
  armor: number;
}

// Grid cell
export interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
  tower: TowerData | null;
}

// Event types for EventBus (derived from GameEvents keys)
export type GameEventType = keyof GameEvents;

// Placement failure reasons
export type PlacementFailureReason =
  | 'insufficient_gold'
  | 'cell_occupied'
  | 'out_of_bounds'
  | 'no_tower_selected';

/**
 * EventBus Event Payload Types
 *
 * Centralized event definitions for React-Phaser communication.
 * All event payloads are defined here to ensure type safety across
 * both the React UI layer and the Phaser game engine.
 */
export interface GameEvents {
  // Scene lifecycle events
  sceneReady: { scene: string };

  // Tower selection (UI → Game)
  selectTower: { type: TowerType | null };

  // Placement feedback (Game → UI)
  placementFailed: { reason: PlacementFailureReason; message: string };

  // Tower events
  towerPlaced: { tower: TowerData };
  towerMerged: { result: TowerData; consumed: TowerData[] };
  towerSold: { tower: TowerData; refund: number };

  // Enemy events
  enemySpawned: { enemy: EnemyData };
  enemyKilled: { enemy: EnemyData; reward: number };
  enemyReachedEnd: { enemy: EnemyData; damage: number };

  // Wave events
  waveStarted: { wave: number };
  waveCompleted: { wave: number; bonus: number };

  // Resource events
  goldChanged: { gold: number; change: number };
  livesChanged: { lives: number; change: number };

  // Game state events
  gameOver: { won: boolean; score: number };
  gamePaused: Record<string, never>;
  gameResumed: Record<string, never>;
}
