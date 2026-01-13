import Phaser from 'phaser';
import { EnemyData, EnemyType } from '../types';
import { emitEvent } from '../utils/EventBus';

export interface EnemyConfig {
  type: EnemyType;
  health: number;
  speed: number;
  reward: number;
  armor: number;
  spriteKey: string;
  scale?: number;
}

export class Enemy extends Phaser.GameObjects.Container {
  private sprite!: Phaser.GameObjects.Sprite;
  private healthBar!: Phaser.GameObjects.Graphics;
  private enemyData: EnemyData;
  private config: EnemyConfig;
  private moveTween?: Phaser.Tweens.TweenChain;
  private isStopped: boolean = false;

  constructor(
    scene: Phaser.Scene,
    config: EnemyConfig,
    startX: number,
    startY: number
  ) {
    super(scene, startX, startY);

    this.config = config;
    this.enemyData = {
      type: config.type,
      health: config.health,
      maxHealth: config.health,
      speed: config.speed,
      reward: config.reward,
      armor: config.armor,
    };

    this.createSprite();
    this.createHealthBar();
    this.setupAnimations();

    scene.add.existing(this);
  }

  private createSprite(): void {
    // Use scene.make to create without auto-adding to scene
    this.sprite = this.scene.make.sprite({
      x: 0,
      y: 0,
      key: this.config.spriteKey,
    });
    const scale = this.config.scale || 1.0;
    this.sprite.setScale(scale);
    this.sprite.setOrigin(0.5, 0.5);

    // Add sprite to container so it moves with the enemy
    this.add(this.sprite);

    this.scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    // Use scaled dimensions for physics body
    const scaledWidth = this.sprite.width * scale * 0.8;
    const scaledHeight = this.sprite.height * scale * 0.8;
    body.setSize(scaledWidth, scaledHeight);
  }

  private createHealthBar(): void {
    // Use scene.make to create without auto-adding to scene
    this.healthBar = this.scene.make.graphics({});
    // Add healthBar to container so it moves with the enemy
    this.add(this.healthBar);
    this.updateHealthBar();
  }

  private updateHealthBar(): void {
    const barWidth = 40;
    const barHeight = 4;
    const healthPercent = this.enemyData.health / this.enemyData.maxHealth;

    this.healthBar.clear();

    this.healthBar.fillStyle(0xff0000, 0.8);
    this.healthBar.fillRect(
      -barWidth / 2,
      -this.sprite.height / 2 - 10,
      barWidth,
      barHeight
    );

    this.healthBar.fillStyle(0x00ff00, 0.8);
    this.healthBar.fillRect(
      -barWidth / 2,
      -this.sprite.height / 2 - 10,
      barWidth * healthPercent,
      barHeight
    );
  }

  private setupAnimations(): void {
    const animKey = `${this.config.spriteKey}-idle`;
    if (this.sprite.anims.exists(animKey)) {
      this.sprite.play(animKey);
    }
    // If animation doesn't exist, sprite will display static texture
  }

  public getPath(): Phaser.Math.Vector2[] {
    const path: Phaser.Math.Vector2[] = [];
    const gridWidth = 80;

    // Generate path from RIGHT to LEFT (enemies enter from right, exit left)
    for (let i = 9; i >= 0; i--) {
      const x = i * gridWidth + 40;
      const y = this.y;
      path.push(new Phaser.Math.Vector2(x, y));
    }

    return path;
  }

  public moveAlongPath(path: Phaser.Math.Vector2[]): void {
    if (this.isStopped) {
      return;
    }

    if (this.moveTween) {
      this.moveTween.destroy();
    }

    const tweenChain = this.scene.tweens.chain({
      targets: this,
      tweens: path.map((point, index) => ({
        x: point.x,
        y: point.y,
        duration: 1000 / this.enemyData.speed,
        ease: 'Linear',
        onStart: () => {
          if (index > 0) {
            const prevPoint = path[index - 1];
            this.sprite.flipX = point.x < prevPoint.x;
          }
        },
      })),
    });

    tweenChain.on('complete', () => {
      this.onReachEnd();
    });

    this.moveTween = tweenChain;
  }

  public takeDamage(damage: number): boolean {
    const actualDamage = Math.max(1, damage - this.enemyData.armor);
    this.enemyData.health -= actualDamage;

    this.updateHealthBar();

    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.sprite.clearTint();
    });

    if (this.sprite.anims.exists(`${this.config.spriteKey}-hit`)) {
      this.sprite.play(`${this.config.spriteKey}-hit`);
    }

    if (this.enemyData.health <= 0) {
      this.onDeath();
      return true;
    }

    return false;
  }

  public onDeath(): void {
    // Emit enemyKilled event with reward
    emitEvent('enemyKilled', {
      enemy: this.getData(),
      reward: this.enemyData.reward,
    });

    // Emit scene event for EnemySystem tracking
    this.scene.events.emit('enemyKilled', {
      enemy: this.getData(),
      reward: this.enemyData.reward,
    });

    if (this.sprite.anims.exists(`${this.config.spriteKey}-death`)) {
      this.sprite.play(`${this.config.spriteKey}-death`);
      this.sprite.on('animationcomplete', () => {
        this.destroy();
      });
    } else {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          this.destroy();
        },
      });
    }
  }

  public onReachEnd(): void {
    // Emit to scene event system for EnemySystem tracking
    this.scene.events.emit('enemyReachedEnd', {
      enemy: this.getData(),
      damage: 1,
    });

    // Emit to EventBus for UI updates and game state
    emitEvent('enemyReachedEnd', {
      enemy: this.getData(),
      damage: 1,
    });

    // Delay destroy to next tick to avoid race condition
    // The TweenChain's complete callback must fully return before we destroy
    this.scene.time.delayedCall(0, () => {
      this.destroy();
    });
  }

  public getData(): EnemyData {
    return { ...this.enemyData };
  }

  public updateData(newData: Partial<EnemyData>): void {
    this.enemyData = { ...this.enemyData, ...newData };
    this.updateHealthBar();
  }

  public getSpeed(): number {
    return this.enemyData.speed;
  }

  public setSpeed(speed: number): void {
    const oldSpeed = this.enemyData.speed;
    this.enemyData.speed = speed;

    // If there's an active tween and speed changed, recreate path movement
    if (this.moveTween && oldSpeed !== speed) {
      // Get remaining path from current position
      const remainingPath = this.getPath().filter((point) => point.x <= this.x);
      if (remainingPath.length > 0) {
        this.moveAlongPath(remainingPath);
      }
    }
  }

  public stop(): void {
    this.isStopped = true;
    if (this.moveTween) {
      this.moveTween.pause();
    }
  }

  public resume(): void {
    this.isStopped = false;
    if (this.moveTween) {
      this.moveTween.resume();
    }
  }

  public isMovementStopped(): boolean {
    return this.isStopped;
  }

  public slowDown(factor: number, duration: number): void {
    const originalSpeed = this.enemyData.speed;
    this.setSpeed(originalSpeed * factor);

    this.scene.time.delayedCall(duration, () => {
      this.setSpeed(originalSpeed);
    });
  }

  public destroy(): void {
    if (this.moveTween) {
      this.moveTween.destroy();
    }

    if (this.healthBar) {
      this.healthBar.destroy();
    }

    if (this.sprite) {
      this.sprite.destroy();
    }

    super.destroy();
  }
}
