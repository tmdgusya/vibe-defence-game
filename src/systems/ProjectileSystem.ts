import Phaser from 'phaser';
import { TowerType, GRID_CONFIG } from '../types';
import { Projectile } from '../entities/Projectile';
import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { emitEvent } from '../utils/EventBus';
import GameScene from '../scenes/GameScene';

const PROJECTILE_SPEED = 400; // pixels per second

export class ProjectileSystem {
  private scene: GameScene;
  private activeProjectiles: Set<Projectile> = new Set();
  private towerCooldowns: Map<Tower, number> = new Map();
  private sunflowerTimers: Map<Tower, number> = new Map();

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  public update(time: number, _delta: number): void {
    // Process tower attacks
    this.processTowerAttacks(time);

    // Process sunflower resource generation
    this.processSunflowerGeneration(time);

    // Update all active projectiles
    this.updateProjectiles();

    // Clean up destroyed projectiles
    this.cleanupProjectiles();
  }

  private processSunflowerGeneration(time: number): void {
    // Only generate resources during active waves
    if (!this.scene.getEnemySystem().isWaveInProgress()) return;

    const towers = this.scene.getPlacedTowers();

    for (const tower of towers) {
      const towerData = tower.getData();

      // Only process sunflowers
      if (towerData.type !== TowerType.SUNFLOWER) continue;

      // Check if tower has resource generation configured
      if (!towerData.resourceGeneration || !towerData.resourceInterval)
        continue;

      // Check timer
      const lastGeneration = this.sunflowerTimers.get(tower) || 0;

      if (time - lastGeneration >= towerData.resourceInterval) {
        // Generate resources
        const goldToAdd = towerData.resourceGeneration;

        // Update timer
        this.sunflowerTimers.set(tower, time);

        // Play generation animation
        tower.playAttackAnimation();

        // Emit gold changed event
        emitEvent('goldChanged', {
          gold: this.scene.getGold() + goldToAdd,
          change: goldToAdd,
        });
      }
    }
  }

  private processTowerAttacks(time: number): void {
    const towers = this.scene.getPlacedTowers();
    const enemies = this.scene.getEnemySystem().getActiveEnemies();

    if (enemies.length === 0) return;

    for (const tower of towers) {
      const towerData = tower.getData();

      if (
        towerData.type !== TowerType.PEASHOOTER &&
        towerData.type !== TowerType.MORTAR
      )
        continue;

      // Check cooldown
      const lastAttack = this.towerCooldowns.get(tower) || 0;
      const cooldownMs = 1000 / towerData.attackSpeed;

      if (time - lastAttack < cooldownMs) continue;

      // Find target
      const target = this.findTarget(tower, enemies);

      if (target) {
        this.spawnProjectile(tower, target);
        this.towerCooldowns.set(tower, time);
        tower.playAttackAnimation();

        emitEvent('projectileFired', {
          tower: towerData,
          damage: towerData.damage,
        });
      }
    }
  }

  private findTarget(tower: Tower, enemies: Enemy[]): Enemy | null {
    const towerData = tower.getData();
    const rangePixels = towerData.range * GRID_CONFIG.CELL_SIZE;

    let closestEnemy: Enemy | null = null;
    let closestDistance = Infinity;

    for (const enemy of enemies) {
      if (!enemy.active) continue;

      const distance = Phaser.Math.Distance.Between(
        tower.x,
        tower.y,
        enemy.x,
        enemy.y
      );

      if (distance <= rangePixels && distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    }

    return closestEnemy;
  }

  private spawnProjectile(tower: Tower, target: Enemy): Projectile {
    const towerData = tower.getData();

    const isMortar = towerData.type === TowerType.MORTAR;

    const projectileData = {
      damage: towerData.damage,
      speed: PROJECTILE_SPEED,
      splashDamage: towerData.splashDamage,
      splashRadius: towerData.splashRadius,
      splashDamageMultiplier: 0.5,
      pierceCount: towerData.pierceCount || 0,
      hitEnemies: new Set<any>(),
      isMortar,
    };

    const projectile = new Projectile(
      this.scene,
      tower.x,
      tower.y,
      target,
      projectileData
    );

    this.activeProjectiles.add(projectile);

    return projectile;
  }

  private updateProjectiles(): void {
    for (const projectile of this.activeProjectiles) {
      if (projectile.active) {
        projectile.update();
      }
    }
  }

  private cleanupProjectiles(): void {
    for (const projectile of this.activeProjectiles) {
      if (!projectile.active) {
        this.activeProjectiles.delete(projectile);
      }
    }
  }

  public getActiveProjectiles(): Projectile[] {
    return Array.from(this.activeProjectiles);
  }

  public getActiveProjectileCount(): number {
    return this.activeProjectiles.size;
  }

  public clearAllProjectiles(): void {
    for (const projectile of this.activeProjectiles) {
      projectile.destroy();
    }
    this.activeProjectiles.clear();
  }

  public removeTowerFromTracking(tower: Tower): void {
    this.towerCooldowns.delete(tower);
    this.sunflowerTimers.delete(tower);
  }

  public destroy(): void {
    this.clearAllProjectiles();
    this.towerCooldowns.clear();
    this.sunflowerTimers.clear();
  }
}
