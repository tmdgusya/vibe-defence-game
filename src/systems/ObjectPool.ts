/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import Phaser from 'phaser';

type AnyGameObject = any;

export class ObjectPool<T extends Phaser.GameObjects.GameObject> {
  private scene: Phaser.Scene;
  private createObject: (scene: Phaser.Scene) => T;
  private pool: T[] = [];
  private activeCount: number = 0;

  constructor(
    scene: Phaser.Scene,
    createObject: (scene: Phaser.Scene) => T,
    initialSize: number = 10
  ) {
    this.scene = scene;
    this.createObject = createObject;

    for (let i = 0; i < initialSize; i++) {
      const obj: AnyGameObject = createObject(scene);
      obj.active = false;
      obj.setVisible(false);
      this.pool.push(obj);
    }

    console.log(`ObjectPool created with ${initialSize} objects`);
  }

  public get(..._args: any[]): T {
    let obj: T | undefined;

    for (let i = 0; i < this.pool.length; i++) {
      const candidate: AnyGameObject = this.pool[i];
      if (!candidate.active) {
        obj = candidate;
        break;
      }
    }

    if (!obj) {
      obj = this.createObject(this.scene);
      this.pool.push(obj);

      console.log(`ObjectPool grew to ${this.pool.length} objects`);
    }

    const objAsAny: AnyGameObject = obj as any;
    objAsAny.active = true;
    objAsAny.setVisible(true);
    this.activeCount++;

    return obj;
  }

  public release(obj: T): void {
    const objAsAny: AnyGameObject = obj as any;
    objAsAny.active = false;
    objAsAny.setVisible(false);
    this.activeCount--;
  }

  public releaseAll(): void {
    for (const obj of this.pool) {
      const objAsAny: AnyGameObject = obj as any;
      objAsAny.active = false;
      objAsAny.setVisible(false);
    }
    this.activeCount = 0;
  }

  public getActiveCount(): number {
    return this.activeCount;
  }

  public getInactiveCount(): number {
    return this.pool.length - this.activeCount;
  }

  public getTotalCount(): number {
    return this.pool.length;
  }

  public getUsedPercentage(): number {
    if (this.pool.length === 0) {
      return 0;
    }
    return (this.activeCount / this.pool.length) * 100;
  }

  public clear(): void {
    for (const obj of this.pool) {
      obj.destroy();
    }
    this.pool = [];
    this.activeCount = 0;
  }

  public getPoolStats(): {
    total: number;
    active: number;
    inactive: number;
    usedPercentage: number;
  } {
    return {
      total: this.getTotalCount(),
      active: this.getActiveCount(),
      inactive: this.getInactiveCount(),
      usedPercentage: this.getUsedPercentage(),
    };
  }
}
