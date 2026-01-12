import Phaser from 'phaser';
import { ProjectileData } from '../types';
import { Enemy } from './Enemy';

export class Projectile extends Phaser.GameObjects.Container {
  private sprite!: Phaser.GameObjects.Image;
  private projectileData: ProjectileData;
  private target: Enemy | null;
  private isDestroyed: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Enemy,
    data: ProjectileData
  ) {
    super(scene, x, y);

    this.target = target;

    const extendedData = {
      ...data,
      hitEnemies: new Set<any>(),
    };

    this.projectileData = extendedData;
    this.createSprite();
    this.setupPhysics();

    if (this.projectileData.isMortar) {
      this.setupArcAnimation();
    }

    scene.add.existing(this);
  }

  private setupArcAnimation(): void {
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: { from: 1.5, to: 0.8 },
      scaleY: { from: 1.5, to: 0.8 },
      duration: 800,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
  }

  private createSprite(): void {
    this.sprite = this.scene.add.image(0, 0, 'projectile-placeholder');
    this.sprite.setScale(1);
    this.add(this.sprite);
  }

  private setupPhysics(): void {
    this.scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 12);
    body.setOffset(-6, -6);
  }

  public update(): void {
    if (this.isDestroyed) return;

    // Check if target is still valid
    if (!this.target || !this.target.active) {
      if (!this.projectileData.splashRadius) {
        this.destroy();
        return;
      }
    }

    // Calculate direction to target position
    const targetPos = this.target
      ? { x: this.target.x, y: this.target.y }
      : { x: this.x + 100, y: this.y };

    const dx = targetPos.x - this.x;
    const dy = targetPos.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize and apply velocity
    const vx = (dx / distance) * this.projectileData.speed;
    const vy = (dy / distance) * this.projectileData.speed;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vx, vy);

    // Rotate sprite to face direction of travel
    this.sprite.rotation = Math.atan2(dy, dx);
  }

  public getTarget(): Enemy | null {
    return this.target;
  }

  public getData(): ProjectileData & { hitEnemies: Set<any> } {
    return this.projectileData as ProjectileData & { hitEnemies: Set<any> };
  }

  public getDamage(): number {
    return this.projectileData.damage;
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    // Stop physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setVelocity(0, 0);
    }

    // Destroy sprite
    if (this.sprite) {
      this.sprite.destroy();
    }

    this.target = null;
    super.destroy();
  }
}
