import Phaser from 'phaser';
import { EnemyData, EnemyType } from '../types';

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
    this.sprite = this.scene.add.sprite(0, 0, this.config.spriteKey);
    const scale = this.config.scale || 1.0;
    this.sprite.setScale(scale);

    this.sprite.setOrigin(0.5, 0.5);

    this.scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.sprite.width * 0.8, this.sprite.height * 0.8);
  }

  private createHealthBar(): void {
    this.healthBar = this.scene.add.graphics();
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
    this.sprite.play(`${this.config.spriteKey}-idle`);
  }

  public getPath(): Phaser.Math.Vector2[] {
    const path: Phaser.Math.Vector2[] = [];
    const gridWidth = 80;

    for (let i = 0; i <= 9; i++) {
      const x = i * gridWidth + 40;
      const y = this.y;
      path.push(new Phaser.Math.Vector2(x, y));
    }

    return path;
  }

  public moveAlongPath(path: Phaser.Math.Vector2[]): void {
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
    this.scene.events.emit('enemyReachedEnd', {
      enemy: this.getData(),
      damage: 1,
    });

    this.destroy();
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
    this.enemyData.speed = speed;

    if (this.moveTween) {
      this.moveTween.restart();
    }
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
