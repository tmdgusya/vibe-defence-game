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

// Event types for EventBus
export type GameEventType =
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
  | 'waveStarted'
  | 'waveCompleted'
  | 'goldChanged'
  | 'livesChanged'
  | 'gameOver'
  | 'gamePaused'
  | 'gameResumed';

// Event payload types
export interface GameEvents {
  towerPlaced: { tower: TowerData };
  towerMerged: { result: TowerData; consumed: TowerData[] };
  towerSold: { tower: TowerData; refund: number };
  towerSelected: { tower: TowerData };
  towerDeselected: Record<string, never>;
  towerUpgrade: { tower: TowerData; cost: number };
  mergeAvailable: { available: boolean };
  enemySpawned: { enemy: EnemyData };
  enemyKilled: { enemy: EnemyData; reward: number };
  enemyReachedEnd: { enemy: EnemyData; damage: number };
  waveStarted: { wave: number };
  waveCompleted: { wave: number; bonus: number };
  goldChanged: { gold: number; change: number };
  livesChanged: { lives: number; change: number };
  gameOver: { won: boolean; score: number };
  gamePaused: Record<string, never>;
  gameResumed: Record<string, never>;
}
