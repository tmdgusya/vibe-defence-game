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

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  public update(time: number, _delta: number): void {
    // Process tower attacks
    this.processTowerAttacks(time);

    // Update all active projectiles
    this.updateProjectiles();

    // Clean up destroyed projectiles
    this.cleanupProjectiles();
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
  }

  public destroy(): void {
    this.clearAllProjectiles();
    this.towerCooldowns.clear();
  }
}
