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

    this.projectileData = data;
    this.target = target;

    this.createSprite();
    this.setupPhysics();

    scene.add.existing(this);
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
      this.destroy();
      return;
    }

    // Calculate direction to target
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if we've reached the target
    if (distance < 10) {
      this.onHitTarget();
      return;
    }

    // Normalize and apply velocity
    const vx = (dx / distance) * this.projectileData.speed;
    const vy = (dy / distance) * this.projectileData.speed;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vx, vy);

    // Rotate sprite to face direction of travel
    this.sprite.rotation = Math.atan2(dy, dx);
  }

  private onHitTarget(): void {
    if (this.isDestroyed || !this.target) return;

    // Apply damage to enemy
    this.target.takeDamage(this.projectileData.damage);

    // Destroy projectile
    this.destroy();
  }

  public getTarget(): Enemy | null {
    return this.target;
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
