import Phaser from 'phaser';
import { TowerType, COLLISION_CONFIG } from '../types';
import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { emitEvent } from '../utils/EventBus';
import GameScene from '../scenes/GameScene';

export class CollisionSystem {
  private scene: GameScene;
  private debugGraphics: Phaser.GameObjects.Graphics | null = null;
  private debugEnabled: boolean = false;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  /**
   * Initialize debug graphics and keyboard toggle.
   * Must be called after scene.create() when scene.add and scene.input are available.
   */
  public init(): void {
    this.setupDebugGraphics();
    this.setupDebugToggle();
  }

  public update(_time: number, _delta: number): void {
    this.checkProjectileEnemyCollisions();
    this.checkTowerEnemyCollisions();

    if (this.debugEnabled) {
      this.drawDebugShapes();
    }
  }

  private checkProjectileEnemyCollisions(): void {
    const projectileSystem = this.scene.getProjectileSystem();
    const enemySystem = this.scene.getEnemySystem();

    const projectiles = projectileSystem.getActiveProjectiles();
    const enemies = enemySystem.getActiveEnemies();

    for (const projectile of projectiles) {
      if (!projectile.active) continue;

      for (const enemy of enemies) {
        if (!enemy.active) continue;

        const hitEnemies = projectile.getData().hitEnemies;
        if (hitEnemies.has(enemy)) continue;

        if (this.checkOverlap(projectile, enemy)) {
          const projectileTarget = projectile.getTarget();
          const isDirectHit = enemy === projectileTarget;
          this.handleProjectileCollision(projectile, enemy, isDirectHit);
        }
      }
    }
  }

  private checkTowerEnemyCollisions(): void {
    const towers = this.scene.getPlacedTowers();
    const enemies = this.scene.getEnemySystem().getActiveEnemies();

    for (const tower of towers) {
      const towerData = tower.getData();
      if (towerData.type !== TowerType.WALLNUT) continue;

      for (const enemy of enemies) {
        if (!enemy.active) continue;

        const distance = Phaser.Math.Distance.Between(
          tower.x,
          tower.y,
          enemy.x,
          enemy.y
        );

        if (distance < COLLISION_CONFIG.TOWER_BLOCK_DISTANCE) {
          this.handleTowerCollision(tower, enemy);
        }
      }
    }
  }

  private checkOverlap(obj1: any, obj2: any): boolean {
    const body1 = obj1.body;
    const body2 = obj2.body;

    if (!body1 || !body2) return false;

    return Phaser.Geom.Rectangle.Overlaps(
      body1 as Phaser.Geom.Rectangle,
      body2 as Phaser.Geom.Rectangle
    );
  }

  private handleProjectileCollision(
    projectile: Projectile,
    enemy: Enemy,
    isDirectHit: boolean
  ): void {
    const projectileData = projectile.getData();
    const enemyData = enemy.getData();

    projectileData.hitEnemies.add(enemy);

    const damage = isDirectHit
      ? projectileData.damage
      : (projectileData.splashDamage || 0) *
        (projectileData.splashDamageMultiplier || 0.5);

    enemy.takeDamage(damage);

    emitEvent('projectileHit', {
      enemy: enemyData,
      damage: Math.max(1, damage - enemyData.armor),
    });

    if (isDirectHit && !projectileData.splashRadius) {
      projectile.destroy();
    } else if (projectileData.splashRadius) {
      this.applySplashDamage(projectile);
      projectile.destroy();
    }
  }

  private applySplashDamage(projectile: Projectile): void {
    const projectileData = projectile.getData();
    const splashRadius = projectileData.splashRadius || 0;
    const splashRadiusPixels = splashRadius * 80;
    const enemies = this.scene.getEnemySystem().getActiveEnemies();
    const isElite = projectileData.damage > 10;

    this.createSplashVisual(
      projectile.x,
      projectile.y,
      splashRadiusPixels,
      isElite
    );

    for (const enemy of enemies) {
      if (!enemy.active) continue;
      if (projectileData.hitEnemies.has(enemy)) continue;

      const distance = Phaser.Math.Distance.Between(
        projectile.x,
        projectile.y,
        enemy.x,
        enemy.y
      );

      if (distance <= splashRadiusPixels) {
        const splashDamage =
          (projectileData.splashDamage || 0) *
          (projectileData.splashDamageMultiplier || 0.5);

        projectileData.hitEnemies.add(enemy);
        enemy.takeDamage(splashDamage);

        emitEvent('projectileHit', {
          enemy: enemy.getData(),
          damage: Math.max(1, splashDamage - enemy.getData().armor),
        });
      }
    }
  }

  private createSplashVisual(
    x: number,
    y: number,
    radiusPixels: number,
    isElite: boolean
  ): void {
    const splash = this.scene.add.graphics();
    splash.setDepth(1000);

    splash.fillStyle(0xffaa00, 0.8);
    splash.fillCircle(0, 0, 5);
    splash.setPosition(x, y);

    const splashRadius = radiusPixels / 5;

    this.scene.tweens.add({
      targets: splash,
      scaleX: splashRadius * 2,
      scaleY: splashRadius * 2,
      alpha: 0,
      duration: COLLISION_CONFIG.SPLASH_EFFECT_DURATION,
      ease: 'Quad.easeOut',
      onComplete: () => splash.destroy(),
    });

    if (isElite) {
      this.scene.cameras.main.shake(100, 0.005);
    }
  }

  private handleTowerCollision(tower: Tower, enemy: Enemy): void {
    const towerData = tower.getData();

    if (towerData.type === TowerType.WALLNUT) {
      enemy.stop();
    }
  }

  private setupDebugGraphics(): void {
    this.debugGraphics = this.scene.add.graphics();
    this.debugGraphics.setDepth(9999);
    this.debugGraphics.setVisible(false);
  }

  private setupDebugToggle(): void {
    this.scene.input.keyboard?.on('keydown-D', () => {
      this.toggleDebugMode();
    });
  }

  private toggleDebugMode(): void {
    this.debugEnabled = !this.debugEnabled;
    this.debugGraphics?.setVisible(this.debugEnabled);
  }

  private drawDebugShapes(): void {
    if (!this.debugGraphics) return;
    this.debugGraphics.clear();

    const towers = this.scene.getPlacedTowers();
    const enemies = this.scene.getEnemySystem().getActiveEnemies();
    const projectiles = this.scene.getProjectileSystem().getActiveProjectiles();

    for (const tower of towers) {
      this.debugGraphics.lineStyle(2, COLLISION_CONFIG.DEBUG_COLORS.TOWER, 1);
      this.debugGraphics.strokeCircle(tower.x, tower.y, 20);
    }

    for (const enemy of enemies) {
      this.debugGraphics.lineStyle(2, COLLISION_CONFIG.DEBUG_COLORS.ENEMY, 1);
      const body = enemy.body as Phaser.Physics.Arcade.Body;
      if (body) {
        this.debugGraphics.strokeRect(
          body.x - body.width / 2,
          body.y - body.height / 2,
          body.width,
          body.height
        );
      }
    }

    for (const projectile of projectiles) {
      this.debugGraphics.lineStyle(
        2,
        COLLISION_CONFIG.DEBUG_COLORS.PROJECTILE,
        1
      );
      const body = projectile.body as Phaser.Physics.Arcade.Body;
      if (body) {
        this.debugGraphics.strokeRect(
          body.x - body.width / 2,
          body.y - body.height / 2,
          body.width,
          body.height
        );
      }
    }
  }

  public destroy(): void {
    if (this.debugGraphics) {
      this.debugGraphics.destroy();
      this.debugGraphics = null;
    }
  }
}
