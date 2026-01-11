import Phaser from 'phaser';
import { TowerData } from '../types';

export class Tower extends Phaser.GameObjects.Container {
  private sprite!: Phaser.GameObjects.Image;
  private rangeIndicator!: Phaser.GameObjects.Graphics;
  private towerData: TowerData;
  private rangeVisible: boolean = false;

  constructor(scene: Phaser.Scene, data: TowerData) {
    const x = data.gridX * 80 + 40;
    const y = data.gridY * 80 + 40;

    super(scene, x, y);

    this.towerData = data;

    this.createSprite();
    this.createRangeIndicator();
    this.setupInteractions();

    scene.add.existing(this);
  }

  private createSprite(): void {
    const textureKey = this.getTextureKey();

    this.sprite = this.scene.add.image(0, 0, textureKey);
    this.sprite.setScale(0.8);
  }

  private createRangeIndicator(): void {
    this.rangeIndicator = this.scene.add.graphics();
    this.rangeIndicator.setVisible(false);
    this.updateRangeIndicator();
  }

  private updateRangeIndicator(): void {
    this.rangeIndicator.clear();

    const rangePixels = this.towerData.range * 80;

    this.rangeIndicator.lineStyle(2, 0x4a90d9, 0.3);
    this.rangeIndicator.strokeCircle(0, 0, rangePixels);

    this.rangeIndicator.fillStyle(0x4a90d9, 0.1);
    this.rangeIndicator.fillCircle(0, 0, rangePixels);
  }

  private getTextureKey(): string {
    const typePrefix = this.towerData.type;
    const levelSuffix =
      this.towerData.level > 1 ? `-${this.towerData.level}` : '';
    return `tower-${typePrefix}${levelSuffix}`;
  }

  private setupInteractions(): void {
    this.on('pointerover', () => {
      this.showRange();
    });

    this.on('pointerout', () => {
      this.hideRange();
    });
  }

  public showRange(): void {
    this.rangeVisible = true;
    this.rangeIndicator.setVisible(true);
  }

  public hideRange(): void {
    this.rangeVisible = false;
    this.rangeIndicator.setVisible(false);
  }

  public toggleRange(): void {
    if (this.rangeVisible) {
      this.hideRange();
    } else {
      this.showRange();
    }
  }

  public getData(): TowerData {
    return { ...this.towerData };
  }

  public updateData(newData: Partial<TowerData>): void {
    this.towerData = { ...this.towerData, ...newData };

    if (newData.type || newData.level) {
      const newTextureKey = this.getTextureKey();
      this.sprite.setTexture(newTextureKey);
    }

    if (newData.range) {
      this.updateRangeIndicator();
    }
  }

  public playAttackAnimation(): void {
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 100,
      yoyo: true,
      ease: 'Power2',
    });
  }

  public destroy(): void {
    this.rangeIndicator.destroy();
    this.sprite.destroy();
    super.destroy();
  }
}
