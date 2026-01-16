import Phaser from 'phaser';
import { TowerData, GRID_CONFIG } from '../types';

export class Tower extends Phaser.GameObjects.Container {
  private sprite!: Phaser.GameObjects.Image;
  private rangeIndicator!: Phaser.GameObjects.Graphics;
  private mergeIndicator!: Phaser.GameObjects.Graphics;
  private towerData: TowerData;
  private rangeVisible: boolean = false;
  private canMerge: boolean = false;
  private isDragging: boolean = false;
  private originalX: number = 0;
  private originalY: number = 0;

  constructor(scene: Phaser.Scene, data: TowerData) {
    const x = data.gridX * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2;
    const y = data.gridY * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2;

    super(scene, x, y);

    this.towerData = data;
    this.originalX = x;
    this.originalY = y;

    this.createSprite();
    this.createRangeIndicator();
    this.createMergeIndicator();
    this.setupInteractions();

    scene.add.existing(this);
  }

  private createSprite(): void {
    const textureKey = this.getTextureKey();

    // Use scene.make to create without auto-adding to scene
    this.sprite = this.scene.make.image({ x: 0, y: 0, key: textureKey });
    this.sprite.setScale(0.8);
    this.add(this.sprite); // Add to container, not scene
  }

  private createRangeIndicator(): void {
    this.rangeIndicator = this.scene.add.graphics();
    this.rangeIndicator.setVisible(false);
    this.updateRangeIndicator();
  }

  private updateRangeIndicator(): void {
    this.rangeIndicator.clear();

    const rangePixels = this.towerData.range * GRID_CONFIG.CELL_SIZE;

    // Draw at tower's position in scene coordinates
    this.rangeIndicator.lineStyle(2, 0x4a90d9, 0.3);
    this.rangeIndicator.strokeCircle(this.x, this.y, rangePixels);

    this.rangeIndicator.fillStyle(0x4a90d9, 0.1);
    this.rangeIndicator.fillCircle(this.x, this.y, rangePixels);
  }

  private createMergeIndicator(): void {
    this.mergeIndicator = this.scene.add.graphics();
    this.mergeIndicator.setVisible(false);
    this.updateMergeIndicator();
  }

  private updateMergeIndicator(): void {
    this.mergeIndicator.clear();

    const mergeRadius = GRID_CONFIG.CELL_SIZE * 0.48; // Slightly less than half cell size

    // Draw at tower's position in scene coordinates
    this.mergeIndicator.lineStyle(4, 0xffd700, 0.8);
    this.mergeIndicator.strokeCircle(this.x, this.y, mergeRadius);

    this.mergeIndicator.fillStyle(0xffd700, 0.2);
    this.mergeIndicator.fillCircle(this.x, this.y, mergeRadius);
  }

  private getTextureKey(): string {
    const typePrefix = this.towerData.type;
    const levelSuffix =
      this.towerData.level > 1 ? `-${this.towerData.level}` : '';
    return `tower-${typePrefix}${levelSuffix}`;
  }

  private setupInteractions(): void {
    // Make tower interactive with explicit bounds
    const cellSize = GRID_CONFIG.CELL_SIZE;
    this.setInteractive(
      new Phaser.Geom.Rectangle(
        -cellSize / 2,
        -cellSize / 2,
        cellSize,
        cellSize
      ),
      Phaser.Geom.Rectangle.Contains
    );

    // Enable dragging
    this.scene.input.setDraggable(this);

    // Hover effects
    this.on('pointerover', () => {
      if (!this.isDragging) {
        this.showRange();
      }
    });

    this.on('pointerout', () => {
      if (!this.isDragging) {
        this.hideRange();
      }
    });

    // Drag events
    this.on('dragstart', () => {
      this.onDragStart();
    });

    this.on('drag', (pointer: Phaser.Input.Pointer) => {
      this.onDrag(pointer);
    });

    this.on('dragend', () => {
      this.onDragEnd();
    });
  }

  private onDragStart(): void {
    this.isDragging = true;
    this.setAlpha(0.7);
    this.setDepth(1000);
    this.showRange();
    console.log(
      'Tower drag started:',
      this.towerData.type,
      this.towerData.level
    );
  }

  private onDrag(pointer: Phaser.Input.Pointer): void {
    this.x = pointer.x;
    this.y = pointer.y;

    // Update range indicator position
    this.rangeIndicator.setPosition(this.x, this.y);
    this.mergeIndicator.setPosition(this.x, this.y);
    this.updateRangeIndicator();
    this.updateMergeIndicator();
  }

  private onDragEnd(): void {
    this.isDragging = false;
    this.setAlpha(1);
    this.setDepth(0);
    console.log('Tower drag ended at:', this.x, this.y);
  }

  public resetPosition(): void {
    this.x = this.originalX;
    this.y = this.originalY;
    this.rangeIndicator.setPosition(this.x, this.y);
    this.mergeIndicator.setPosition(this.x, this.y);
    this.updateRangeIndicator();
    this.updateMergeIndicator();
  }

  public getOriginalPosition(): { x: number; y: number } {
    return { x: this.originalX, y: this.originalY };
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

  public setCanMerge(canMerge: boolean): void {
    this.canMerge = canMerge;

    if (this.canMerge) {
      this.showMergeIndicator();
    } else {
      this.hideMergeIndicator();
    }
  }

  private showMergeIndicator(): void {
    this.mergeIndicator.setVisible(true);
  }

  private hideMergeIndicator(): void {
    this.mergeIndicator.setVisible(false);
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
    this.mergeIndicator.destroy();
    this.sprite.destroy();
    super.destroy();
  }
}
