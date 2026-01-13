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

export const COLLISION_CONFIG = {
  PROJECTILE_HIT_DISTANCE: 10,
  TOWER_BLOCK_DISTANCE: 40,
  SPLASH_EFFECT_DURATION: 300,
  DEBUG_COLORS: {
    TOWER: 0x00ff00,
    ENEMY: 0xff0000,
    PROJECTILE: 0xffff00,
    SPLASH_ZONE: 0xffaa00,
  },
} as const;

// Tower types
export enum TowerType {
  PEASHOOTER = 'peashooter',
  SUNFLOWER = 'sunflower',
  WALLNUT = 'wallnut',
  MORTAR = 'mortar',
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
  splashDamage?: number;
  splashRadius?: number;
  pierceCount?: number;
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

// Projectile data
export interface ProjectileData {
  damage: number;
  speed: number;
  splashDamage?: number;
  splashRadius?: number;
  splashDamageMultiplier?: number;
  pierceCount?: number;
  hitEnemies: Set<any>;
  isMortar?: boolean;
}

// Grid cell
export interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
  tower: TowerData | null;
}

// Event types for EventBus
export type GameEventType =
  | 'sceneReady'
  | 'selectTower'
  | 'placementFailed'
  | 'towerPlaced'
  | 'towerMerged'
  | 'towerSold'
  | 'towerSelected'
  | 'towerDeselected'
  | 'towerUpgrade'
  | 'mergeAvailable'
  | 'enemySpawned'
  | 'enemyKilled'
  | 'enemyReachedEnd'
  | 'startWaveRequested'
  | 'waveStarted'
  | 'waveCompleted'
  | 'goldChanged'
  | 'livesChanged'
  | 'gameOver'
  | 'gamePaused'
  | 'gameResumed'
  | 'towerDragStart'
  | 'towerDragEnd'
  | 'towerDrop'
  | 'towerDragOver'
  | 'projectileFired'
  | 'projectileHit';

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
  towerSelected: { tower: TowerData };
  towerDeselected: Record<string, never>;
  towerUpgrade: { tower: TowerData; cost: number };
  mergeAvailable: { available: boolean };

  // Enemy events
  enemySpawned: { enemy: EnemyData };
  enemyKilled: { enemy: EnemyData; reward: number };
  enemyReachedEnd: { enemy: EnemyData; damage: number };

  // Wave events
  startWaveRequested: { wave: number };
  waveStarted: { wave: number };
  waveCompleted: { wave: number; bonus: number };

  // Resource events
  goldChanged: { gold: number; change: number };
  livesChanged: { lives: number; change: number };

  // Game state events
  gameOver: { won: boolean; score: number };
  gamePaused: Record<string, never>;
  gameResumed: Record<string, never>;

  // Drag and drop events
  towerDragStart: { towerType: TowerType };
  towerDragEnd: { success: boolean };
  towerDrop: { towerType: TowerType; gridX: number; gridY: number };
  towerDragOver: { gridX: number; gridY: number };

  // Projectile events
  projectileFired: { tower: TowerData; damage: number };
  projectileHit: { enemy: EnemyData; damage: number };
}
