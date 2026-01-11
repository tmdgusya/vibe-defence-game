import Phaser from 'phaser';
import { EnemyType, GRID_CONFIG } from '../types';
import { Enemy } from '../entities/Enemy';
import { BossEnemy, createEnemy } from '../entities/EnemyTypes';
import { emitEvent } from '../utils/EventBus';
import GameScene from '../scenes/GameScene';

/**
 * Configuration for a single enemy spawn entry within a wave
 */
interface EnemySpawnEntry {
  type: EnemyType;
  count: number;
  delay?: number; // ms delay before this group starts spawning
}

/**
 * Configuration for a complete wave
 */
interface WaveConfig {
  enemies: EnemySpawnEntry[];
  spawnInterval: number; // ms between individual enemy spawns
  waveBonus: number; // gold bonus for completing the wave
}

/**
 * Predefined wave configurations for waves 1-10
 * Each wave introduces new enemy types and increases difficulty
 */
const WAVE_CONFIGS: Record<number, WaveConfig> = {
  1: {
    enemies: [{ type: EnemyType.BASIC, count: 5 }],
    spawnInterval: 1500,
    waveBonus: 25,
  },
  2: {
    enemies: [{ type: EnemyType.BASIC, count: 8 }],
    spawnInterval: 1300,
    waveBonus: 30,
  },
  3: {
    enemies: [
      { type: EnemyType.BASIC, count: 6 },
      { type: EnemyType.TANK, count: 2, delay: 2000 },
    ],
    spawnInterval: 1200,
    waveBonus: 40,
  },
  4: {
    enemies: [
      { type: EnemyType.SWARM, count: 3 },
      { type: EnemyType.BASIC, count: 4, delay: 1500 },
    ],
    spawnInterval: 1100,
    waveBonus: 45,
  },
  5: {
    enemies: [
      { type: EnemyType.BASIC, count: 8 },
      { type: EnemyType.FLYING, count: 3, delay: 3000 },
      { type: EnemyType.BOSS, count: 1, delay: 5000 },
    ],
    spawnInterval: 1000,
    waveBonus: 75,
  },
  6: {
    enemies: [
      { type: EnemyType.BASIC, count: 10 },
      { type: EnemyType.TANK, count: 3, delay: 2000 },
    ],
    spawnInterval: 1000,
    waveBonus: 50,
  },
  7: {
    enemies: [
      { type: EnemyType.SWARM, count: 4 },
      { type: EnemyType.ARMORED, count: 2, delay: 3000 },
    ],
    spawnInterval: 900,
    waveBonus: 60,
  },
  8: {
    enemies: [
      { type: EnemyType.FLYING, count: 6 },
      { type: EnemyType.TANK, count: 4, delay: 2500 },
    ],
    spawnInterval: 900,
    waveBonus: 70,
  },
  9: {
    enemies: [
      { type: EnemyType.BASIC, count: 8 },
      { type: EnemyType.ARMORED, count: 4, delay: 2000 },
      { type: EnemyType.TANK, count: 2, delay: 4000 },
    ],
    spawnInterval: 800,
    waveBonus: 80,
  },
  10: {
    enemies: [
      { type: EnemyType.BASIC, count: 10 },
      { type: EnemyType.TANK, count: 3, delay: 2000 },
      { type: EnemyType.FLYING, count: 2, delay: 4000 },
      { type: EnemyType.BOSS, count: 1, delay: 6000 },
    ],
    spawnInterval: 800,
    waveBonus: 100,
  },
};

/**
 * Lane weights for spawn position selection
 * Middle lanes have higher probability to keep gameplay focused
 */
const LANE_WEIGHTS = [0.15, 0.25, 0.3, 0.2, 0.1];

/**
 * EnemySystem handles wave-based enemy spawning and AI behavior coordination
 * Follows the same pattern as TowerSystem for consistency
 */
export class EnemySystem {
  private scene: GameScene;
  private activeEnemies: Set<Enemy> = new Set();
  private currentWave: number = 0;
  private isWaveActive: boolean = false;
  private spawningComplete: boolean = false;
  private spawnTimers: Phaser.Time.TimerEvent[] = [];

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  /**
   * Gets the wave configuration for a given wave number
   * Returns predefined config for waves 1-10, generates procedural config for 11+
   */
  public getWaveConfig(wave: number): WaveConfig {
    if (WAVE_CONFIGS[wave]) {
      return WAVE_CONFIGS[wave];
    }

    return this.generateProceduralWaveConfig(wave);
  }

  /**
   * Generates a procedural wave configuration for waves beyond 10
   * Difficulty scales with wave number
   */
  private generateProceduralWaveConfig(wave: number): WaveConfig {
    const baseWave = 10;

    const enemies: EnemySpawnEntry[] = [];

    // Base enemies scale with wave
    enemies.push({
      type: EnemyType.BASIC,
      count: Math.floor(5 + (wave - baseWave) * 1.5),
    });

    // Add tank every 2 waves
    if (wave % 2 === 0) {
      enemies.push({
        type: EnemyType.TANK,
        count: Math.floor(2 + (wave - baseWave) * 0.3),
        delay: 2000,
      });
    }

    // Add flying every 3 waves
    if (wave % 3 === 0) {
      enemies.push({
        type: EnemyType.FLYING,
        count: Math.floor(2 + (wave - baseWave) * 0.2),
        delay: 3000,
      });
    }

    // Add armored every 4 waves
    if (wave % 4 === 0) {
      enemies.push({
        type: EnemyType.ARMORED,
        count: Math.floor(1 + (wave - baseWave) * 0.2),
        delay: 4000,
      });
    }

    // Add swarm every 3 waves (offset from flying)
    if ((wave + 1) % 3 === 0) {
      enemies.push({
        type: EnemyType.SWARM,
        count: Math.floor(2 + (wave - baseWave) * 0.15),
        delay: 2500,
      });
    }

    // Add boss every 5 waves
    if (wave % 5 === 0) {
      enemies.push({
        type: EnemyType.BOSS,
        count: 1 + Math.floor((wave - baseWave) / 10),
        delay: 6000,
      });
    }

    return {
      enemies,
      spawnInterval: Math.max(500, 800 - (wave - baseWave) * 20),
      waveBonus: 25 + wave * 10,
    };
  }

  /**
   * Returns a difficulty multiplier based on wave number
   * Uses logarithmic scaling for diminishing returns
   */
  public getDifficultyMultiplier(wave: number): number {
    return 1 + Math.log2(wave) * 0.3;
  }

  /**
   * Starts a new wave of enemies
   */
  public startWave(wave: number): void {
    if (this.isWaveActive) {
      return;
    }

    this.currentWave = wave;
    this.isWaveActive = true;
    this.spawningComplete = false;

    const config = this.getWaveConfig(wave);
    emitEvent('waveStarted', { wave });

    this.processSpawnQueue(config);
  }

  /**
   * Stops the current wave, canceling all pending spawns
   */
  public stopWave(): void {
    this.spawnTimers.forEach((timer) => timer.destroy());
    this.spawnTimers = [];
    this.isWaveActive = false;
    this.spawningComplete = true;
  }

  /**
   * Processes the spawn queue for a wave configuration
   * Creates timed spawns for each enemy in the wave
   */
  private processSpawnQueue(config: WaveConfig): void {
    const spawnQueue: Array<{ type: EnemyType; time: number }> = [];
    let currentTime = 0;

    for (const entry of config.enemies) {
      currentTime += entry.delay || 0;

      for (let i = 0; i < entry.count; i++) {
        spawnQueue.push({ type: entry.type, time: currentTime });
        currentTime += config.spawnInterval;
      }
    }

    // Schedule all spawns
    for (const spawn of spawnQueue) {
      const timer = this.scene.time.delayedCall(spawn.time, () => {
        if (this.isWaveActive) {
          this.spawnEnemy(spawn.type);
        }
      });
      this.spawnTimers.push(timer);
    }

    // Mark spawning as complete after all enemies are spawned
    const totalSpawnTime = currentTime;
    const completionTimer = this.scene.time.delayedCall(totalSpawnTime, () => {
      this.spawningComplete = true;
      this.checkWaveComplete();
    });
    this.spawnTimers.push(completionTimer);
  }

  /**
   * Spawns a single enemy of the given type
   */
  private spawnEnemy(type: EnemyType): void {
    const lane = this.getRandomLane();
    const pos = this.getSpawnPosition(lane);

    const enemy = createEnemy(this.scene, type, pos.x, pos.y);
    this.registerEnemy(enemy);

    // Start movement along path
    const path = enemy.getPath();
    enemy.moveAlongPath(path);

    // Emit spawn event
    emitEvent('enemySpawned', { enemy: enemy.getData() });

    // Setup enemy event handlers
    this.setupEnemyHandlers(enemy);
  }

  /**
   * Sets up event handlers for an enemy's lifecycle events
   */
  private setupEnemyHandlers(enemy: Enemy): void {
    // Use once to auto-cleanup, and track by the specific enemy instance
    enemy.once('destroy', () => {
      // Only handle if still in active set (wasn't already processed)
      if (this.activeEnemies.has(enemy)) {
        this.unregisterEnemy(enemy);
        this.checkWaveComplete();
      }
    });
  }

  /**
   * Handles an enemy being killed (public for external use if needed)
   */
  public handleEnemyDeath(enemy: Enemy): void {
    this.unregisterEnemy(enemy);
    this.checkWaveComplete();
  }

  /**
   * Checks if the wave is complete (all enemies spawned and cleared)
   */
  private checkWaveComplete(): void {
    if (
      this.spawningComplete &&
      this.activeEnemies.size === 0 &&
      this.isWaveActive
    ) {
      this.completeWave();
    }
  }

  /**
   * Completes the current wave and emits completion event
   */
  private completeWave(): void {
    this.isWaveActive = false;
    const config = this.getWaveConfig(this.currentWave);

    emitEvent('waveCompleted', {
      wave: this.currentWave,
      bonus: config.waveBonus,
    });
  }

  /**
   * Registers an enemy for tracking
   */
  public registerEnemy(enemy: Enemy): void {
    this.activeEnemies.add(enemy);
  }

  /**
   * Unregisters an enemy from tracking
   */
  public unregisterEnemy(enemy: Enemy): void {
    this.activeEnemies.delete(enemy);
  }

  /**
   * Returns an array of all active enemies
   */
  public getActiveEnemies(): Enemy[] {
    return Array.from(this.activeEnemies);
  }

  /**
   * Returns the count of active enemies
   */
  public getActiveEnemyCount(): number {
    return this.activeEnemies.size;
  }

  /**
   * Returns whether a wave is currently in progress
   */
  public isWaveInProgress(): boolean {
    return this.isWaveActive;
  }

  /**
   * Returns the current wave number
   */
  public getCurrentWave(): number {
    return this.currentWave;
  }

  /**
   * Selects a random lane with weighted probability
   * Middle lanes have higher weights to focus gameplay
   */
  public getRandomLane(): number {
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < LANE_WEIGHTS.length; i++) {
      cumulative += LANE_WEIGHTS[i];
      if (random < cumulative) {
        return i;
      }
    }

    return 2; // Fallback to middle lane
  }

  /**
   * Calculates the spawn position for a given lane
   */
  public getSpawnPosition(lane: number): { x: number; y: number } {
    const cellSize = GRID_CONFIG.CELL_SIZE;
    return {
      x: GRID_CONFIG.WIDTH + cellSize / 2, // Spawn just off-screen to the right
      y: lane * cellSize + cellSize / 2,
    };
  }

  /**
   * Updates the enemy system - called every frame
   * Handles AI updates for special enemy types like BossEnemy
   */
  public update(time: number, delta: number): void {
    for (const enemy of this.activeEnemies) {
      // Call update for enemies that have special behaviors (e.g., BossEnemy)
      if (enemy instanceof BossEnemy) {
        enemy.update(time, delta);
      }
    }
  }

  /**
   * Cleans up the enemy system
   */
  public destroy(): void {
    this.stopWave();
    this.activeEnemies.clear();
  }
}
