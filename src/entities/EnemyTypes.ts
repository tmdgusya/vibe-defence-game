import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../types';
import { getEnemyConfig } from './enemyConfigs';

export class BasicEnemy extends Enemy {
  constructor(scene: Phaser.Scene, startX: number, startY: number) {
    const config = getEnemyConfig(EnemyType.BASIC);
    super(scene, config, startX, startY);
  }
}

export class TankEnemy extends Enemy {
  constructor(scene: Phaser.Scene, startX: number, startY: number) {
    const config = getEnemyConfig(EnemyType.TANK);
    super(scene, config, startX, startY);
  }

  public takeDamage(damage: number): boolean {
    const reducedDamage = Math.floor(damage * 0.8);
    return super.takeDamage(reducedDamage);
  }
}

export class FlyingEnemy extends Enemy {
  constructor(scene: Phaser.Scene, startX: number, startY: number) {
    const config = getEnemyConfig(EnemyType.FLYING);
    super(scene, config, startX, startY);
  }

  public getPath(): Phaser.Math.Vector2[] {
    const path: Phaser.Math.Vector2[] = [];
    const gridWidth = 80;

    path.push(new Phaser.Math.Vector2(gridWidth * 9 + 40, this.y));
    path.push(new Phaser.Math.Vector2(gridWidth * 4.5 + 40, this.y - 100));
    path.push(new Phaser.Math.Vector2(40, this.y));

    return path;
  }

  public takeDamage(damage: number): boolean {
    return super.takeDamage(damage);
  }
}

export class BossEnemy extends Enemy {
  private specialAbilityTimer: number = 0;
  private hasUsedSpecialAbility: boolean = false;

  constructor(scene: Phaser.Scene, startX: number, startY: number) {
    const config = getEnemyConfig(EnemyType.BOSS);
    super(scene, config, startX, startY);
  }

  public update(time: number, delta: number): void {
    super.update?.(time, delta);

    this.specialAbilityTimer += delta;

    if (this.specialAbilityTimer > 5000 && !this.hasUsedSpecialAbility) {
      this.useSpecialAbility();
      this.hasUsedSpecialAbility = true;
    }
  }

  private useSpecialAbility(): void {
    const healAmount = Math.floor(this.getData().maxHealth * 0.2);
    this.updateData({
      health: Math.min(
        this.getData().health + healAmount,
        this.getData().maxHealth
      ),
    });
  }

  public takeDamage(damage: number): boolean {
    const currentData = this.getData();
    const enhancedArmor = currentData.armor + 2;

    const actualDamage = Math.max(1, damage - enhancedArmor);
    return super.takeDamage(actualDamage);
  }
}

export class SwarmEnemy extends Enemy {
  private swarmMembers: SwarmEnemy[] = [];
  private isSwarmLeader: boolean;

  constructor(
    scene: Phaser.Scene,
    startX: number,
    startY: number,
    isLeader: boolean = true
  ) {
    const config = getEnemyConfig(EnemyType.SWARM);
    super(scene, config, startX, startY);
    this.isSwarmLeader = isLeader;

    if (isLeader) {
      this.createSwarmMembers();
    }
  }

  private createSwarmMembers(): void {
    const swarmSize = 3;

    for (let i = 1; i < swarmSize; i++) {
      const offsetX = (i % 2 === 0 ? 1 : -1) * 20;
      const offsetY = Math.floor(i / 2) * 20;

      const swarmMember = new SwarmEnemy(
        this.scene,
        this.x + offsetX,
        this.y + offsetY,
        false
      );

      this.swarmMembers.push(swarmMember);
    }
  }

  public moveAlongPath(path: Phaser.Math.Vector2[]): void {
    super.moveAlongPath(path);

    // Propagate movement to swarm members with offset
    if (this.isSwarmLeader) {
      this.swarmMembers.forEach((member, index) => {
        const offsetX = ((index + 1) % 2 === 0 ? 1 : -1) * 20;
        const offsetY = Math.floor((index + 1) / 2) * 20;

        const memberPath = path.map(
          (point) =>
            new Phaser.Math.Vector2(point.x + offsetX, point.y + offsetY)
        );
        member.moveAlongPath(memberPath);
      });
    }
  }

  public onDeath(): void {
    if (this.isSwarmLeader) {
      this.swarmMembers.forEach((member) => member.destroy());
    }

    super.onDeath();
  }

  public takeDamage(damage: number): boolean {
    if (!this.isSwarmLeader) {
      return super.takeDamage(damage * 1.5);
    }

    return super.takeDamage(damage);
  }
}

export class ArmoredEnemy extends Enemy {
  constructor(scene: Phaser.Scene, startX: number, startY: number) {
    const config = getEnemyConfig(EnemyType.ARMORED);
    super(scene, config, startX, startY);
  }

  public takeDamage(damage: number): boolean {
    const currentData = this.getData();
    const blockedDamage = currentData.armor * 3;
    const actualDamage = Math.max(1, damage - blockedDamage);

    return super.takeDamage(actualDamage);
  }

  public slowDown(factor: number, duration: number): void {
    const reducedDuration = duration * 0.5;
    const reducedFactor = 1 - (1 - factor) * 0.5;

    super.slowDown(reducedFactor, reducedDuration);
  }
}

export function createEnemy(
  scene: Phaser.Scene,
  type: EnemyType,
  startX: number,
  startY: number
): Enemy {
  switch (type) {
    case EnemyType.BASIC:
      return new BasicEnemy(scene, startX, startY);
    case EnemyType.TANK:
      return new TankEnemy(scene, startX, startY);
    case EnemyType.FLYING:
      return new FlyingEnemy(scene, startX, startY);
    case EnemyType.BOSS:
      return new BossEnemy(scene, startX, startY);
    case EnemyType.SWARM:
      return new SwarmEnemy(scene, startX, startY);
    case EnemyType.ARMORED:
      return new ArmoredEnemy(scene, startX, startY);
    default:
      throw new Error(`Unknown enemy type: ${type}`);
  }
}
