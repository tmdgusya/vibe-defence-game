import Phaser from 'phaser';
import { GRID_CONFIG, TowerType, TowerLevel } from '../types';
import {
  emitEvent,
  subscribeToEvent,
  type GameEvents,
} from '../utils/EventBus';
import { Tower } from '../entities/Tower';
import { TowerSystem } from '../systems/TowerSystem';
import { EnemySystem } from '../systems/EnemySystem';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { CollisionSystem } from '../systems/CollisionSystem';

/**
 * Main Game Scene
 * Handles the core game rendering, grid system, and game loop
 */
export default class GameScene extends Phaser.Scene {
  private gridCells: Phaser.GameObjects.Image[][] = [];
  private towerSystem: TowerSystem;
  private enemySystem: EnemySystem;
  private projectileSystem: ProjectileSystem;
  private selectedTowerType: TowerType | null = null;
  private currentGold: number = 200;
  private currentWave: number = 1;
  private isPaused: boolean = false;
  private draggedTowerType: TowerType | null = null;
  private ghostTower: Phaser.GameObjects.Sprite | null = null;
  private rangeIndicator: Phaser.GameObjects.Graphics | null = null;
  private previewCell: Phaser.GameObjects.Rectangle | null = null;

  constructor() {
    super({ key: 'GameScene' });
    this.towerSystem = new TowerSystem(this);
    this.enemySystem = new EnemySystem(this);
    this.projectileSystem = new ProjectileSystem(this);
    this.collisionSystem = new CollisionSystem(this);
  }

  create(): void {
    console.log('GameScene: Creating game world...');

    this.createGrid();
    this.setupInput();
    this.setupEventListeners();

    emitEvent('sceneReady', { scene: 'GameScene' });

    console.log('GameScene: Game world created successfully');
    console.log(
      `Grid: ${GRID_CONFIG.COLS}x${GRID_CONFIG.ROWS} (${GRID_CONFIG.WIDTH}x${GRID_CONFIG.HEIGHT}px)`
    );
  }

  private setupEventListeners(): void {
    subscribeToEvent('selectTower', (data: GameEvents['selectTower']) => {
      this.selectedTowerType = data.type;
      this.updateGridHighlighting();
    });

    subscribeToEvent('goldChanged', (data: GameEvents['goldChanged']) => {
      this.currentGold = data.gold;
    });

    subscribeToEvent('towerDragStart', (data: GameEvents['towerDragStart']) => {
      this.draggedTowerType = data.towerType;
      this.createDragPreview(data.towerType);
    });

    subscribeToEvent('towerDragEnd', () => {
      this.cleanupDragPreview();
      this.draggedTowerType = null;
    });

    subscribeToEvent('towerDrop', (data: GameEvents['towerDrop']) => {
      this.placeTower(data.gridX, data.gridY, data.towerType);
      this.cleanupDragPreview();
      this.draggedTowerType = null;
    });

    subscribeToEvent('towerDragOver', (data: GameEvents['towerDragOver']) => {
      this.updateDragPreview(data.gridX, data.gridY);
    });

    // Listen for pause/resume from React UI
    subscribeToEvent('gamePaused', () => {
      this.isPaused = true;
      this.scene.pause();
    });

    subscribeToEvent('gameResumed', () => {
      this.isPaused = false;
      this.scene.resume();
    });

    // Listen for wave completion to advance wave counter
    subscribeToEvent('waveCompleted', (data: GameEvents['waveCompleted']) => {
      this.currentWave = data.wave + 1;
    });
  }

  private updateGridHighlighting(): void {
    for (let row = 0; row < GRID_CONFIG.ROWS; row++) {
      for (let col = 0; col < GRID_CONFIG.COLS; col++) {
        const cell = this.gridCells[row][col];
        if (this.selectedTowerType && !cell.getData('occupied')) {
          cell.setAlpha(1.0);
        } else {
          cell.setAlpha(0.8);
        }
      }
    }
  }

  update(time: number, delta: number): void {
    if (!this.isPaused) {
      this.enemySystem.update(time, delta);
      this.projectileSystem.update(time, delta);
      this.collisionSystem.update(time, delta);
    }
  }

  /**
   * Creates the 5x9 grid for tower placement
   */
  private createGrid(): void {
    const startX = GRID_CONFIG.CELL_SIZE / 2;
    const startY = GRID_CONFIG.CELL_SIZE / 2;

    for (let row = 0; row < GRID_CONFIG.ROWS; row++) {
      this.gridCells[row] = [];

      for (let col = 0; col < GRID_CONFIG.COLS; col++) {
        const x = startX + col * GRID_CONFIG.CELL_SIZE;
        const y = startY + row * GRID_CONFIG.CELL_SIZE;

        // Create grid cell visual
        const cell = this.add.image(x, y, 'grid-cell');
        cell.setInteractive();
        cell.setData('gridX', col);
        cell.setData('gridY', row);
        cell.setData('occupied', false);

        // Hover effects
        cell.on('pointerover', () => {
          if (!cell.getData('occupied')) {
            cell.setTint(0x88ff88);
          }
        });

        cell.on('pointerout', () => {
          cell.clearTint();
        });

        // Click handler
        cell.on('pointerdown', () => {
          this.onCellClick(col, row);
        });

        this.gridCells[row][col] = cell;
      }
    }
  }

  /**
   * Sets up global input handling
   */
  private setupInput(): void {
    // Keyboard shortcuts
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.draggedTowerType) {
        emitEvent('towerDragEnd', { success: false });
        this.cleanupDragPreview();
        this.draggedTowerType = null;
      } else {
        this.togglePause();
      }
    });

    this.input.keyboard?.on('keydown-P', () => {
      this.togglePause();
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (!this.enemySystem.isWaveInProgress()) {
        this.enemySystem.startWave(this.currentWave);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.draggedTowerType && pointer.rightButtonDown()) {
        emitEvent('towerDragEnd', { success: false });
        this.cleanupDragPreview();
        this.draggedTowerType = null;
      }
    });
  }

  /**
   * Toggles the game pause state
   */
  private togglePause(): void {
    if (this.isPaused) {
      emitEvent('gameResumed', {});
    } else {
      emitEvent('gamePaused', {});
    }
  }

  /**
   * Handles grid cell clicks
   */
  private onCellClick(gridX: number, gridY: number): void {
    const cell = this.gridCells[gridY][gridX];
    const isOccupied = cell.getData('occupied');

    console.log(`Cell clicked: (${gridX}, ${gridY}), occupied: ${isOccupied}`);

    if (isOccupied) {
      return;
    }

    if (!this.selectedTowerType) {
      emitEvent('placementFailed', {
        reason: 'no_tower_selected',
        message: 'Select a tower first!',
      });
      return;
    }

    const cost = this.towerSystem.getTowerCost(
      this.selectedTowerType,
      TowerLevel.BASIC
    );

    if (this.currentGold < cost) {
      emitEvent('placementFailed', {
        reason: 'insufficient_gold',
        message: `Not enough gold! Need ${cost}g`,
      });
      this.showErrorFlash(gridX, gridY);
      return;
    }

    this.placeTower(gridX, gridY, this.selectedTowerType);
  }

  /**
   * Places a tower at the specified grid position
   */
  private placeTower(gridX: number, gridY: number, towerType: TowerType): void {
    const validation = this.towerSystem.validatePlacement(gridX, gridY);

    if (!validation.valid) {
      emitEvent('placementFailed', {
        reason: 'cell_occupied',
        message: validation.reason!,
      });
      return;
    }

    const cost = this.towerSystem.getTowerCost(towerType, TowerLevel.BASIC);

    const towerData = this.towerSystem.createTowerData(
      towerType,
      TowerLevel.BASIC,
      gridX,
      gridY
    );

    const tower = new Tower(this, towerData);

    const cell = this.gridCells[gridY][gridX];
    cell.setData('occupied', true);
    cell.setData('tower', tower);

    emitEvent('towerPlaced', { tower: towerData });
    emitEvent('goldChanged', {
      gold: this.currentGold - cost,
      change: -cost,
    });

    this.showSuccessFlash(gridX, gridY);

    console.log(`Tower placed at (${gridX}, ${gridY})`);
  }

  private showSuccessFlash(gridX: number, gridY: number): void {
    const cell = this.gridCells[gridY][gridX];
    cell.setTint(0x00ff00);
    this.tweens.add({
      targets: cell,
      alpha: { from: 0.5, to: 1 },
      duration: 200,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        cell.clearTint();
      },
    });
  }

  private showErrorFlash(gridX: number, gridY: number): void {
    const cell = this.gridCells[gridY][gridX];
    const originalX = cell.x;
    cell.setTint(0xff0000);
    this.tweens.add({
      targets: cell,
      x: originalX + 5,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        cell.setTint(0x000000);
        cell.clearTint();
        cell.x = originalX;
      },
    });
  }

  /**
   * Gets the grid cell at specified coordinates
   */
  public getCell(
    gridX: number,
    gridY: number
  ): Phaser.GameObjects.Image | null {
    if (
      gridX >= 0 &&
      gridX < GRID_CONFIG.COLS &&
      gridY >= 0 &&
      gridY < GRID_CONFIG.ROWS
    ) {
      return this.gridCells[gridY][gridX];
    }
    return null;
  }

  /**
   * Checks if a cell is available for tower placement
   */
  public isCellAvailable(gridX: number, gridY: number): boolean {
    const cell = this.getCell(gridX, gridY);
    return cell !== null && !cell.getData('occupied');
  }

  /**
   * Creates drag preview elements
   */
  private createDragPreview(type: TowerType): void {
    const textureKey = `tower-${type}`;

    this.ghostTower = this.add.sprite(0, 0, textureKey);
    this.ghostTower.setAlpha(0.5);
    this.ghostTower.setDepth(1000);

    this.rangeIndicator = this.add.graphics();
    this.rangeIndicator.setDepth(999);
    this.updateRangeIndicator(type);

    this.previewCell = this.add.rectangle(0, 0, 80, 80, 0xffffff, 0);
    this.previewCell.setStrokeStyle(3, 0xffffff, 0.5);
    this.previewCell.setDepth(998);

    this.input.on('pointermove', this.onPointerMove, this);
  }

  /**
   * Handles pointer movement during drag
   */
  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.draggedTowerType) return;

    const gridX = Math.floor(pointer.x / GRID_CONFIG.CELL_SIZE);
    const gridY = Math.floor(pointer.y / GRID_CONFIG.CELL_SIZE);

    this.updateDragPreview(gridX, gridY);
  }

  /**
   * Updates drag preview position and appearance
   */
  private updateDragPreview(gridX: number, gridY: number): void {
    if (!this.ghostTower || !this.previewCell || !this.rangeIndicator) return;

    const x = gridX * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2;
    const y = gridY * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2;

    this.ghostTower.setPosition(x, y);
    this.rangeIndicator.setPosition(x, y);
    this.previewCell.setPosition(x, y);

    if (
      gridX < 0 ||
      gridX >= GRID_CONFIG.COLS ||
      gridY < 0 ||
      gridY >= GRID_CONFIG.ROWS
    ) {
      this.previewCell.setStrokeStyle(3, 0xff0000, 0.8);
      this.previewCell.setFillStyle(0xff0000, 0.2);
      return;
    }

    const validation = this.towerSystem.validatePlacement(gridX, gridY);
    const cost = this.towerSystem.getTowerCost(
      this.draggedTowerType!,
      TowerLevel.BASIC
    );
    const canAfford = this.currentGold >= cost;

    if (validation.valid && canAfford) {
      this.previewCell.setStrokeStyle(3, 0x00ff00, 0.8);
      this.previewCell.setFillStyle(0x00ff00, 0.2);
    } else {
      this.previewCell.setStrokeStyle(3, 0xff0000, 0.8);
      this.previewCell.setFillStyle(0xff0000, 0.2);
    }
  }

  /**
   * Updates range indicator for tower type
   */
  private updateRangeIndicator(type: TowerType): void {
    if (!this.rangeIndicator) return;

    const stats = this.towerSystem.getTowerStats(type, TowerLevel.BASIC);
    const rangePixels = stats.range * GRID_CONFIG.CELL_SIZE;

    this.rangeIndicator.clear();
    this.rangeIndicator.lineStyle(2, 0x4a90d9, 0.3);
    this.rangeIndicator.strokeCircle(0, 0, rangePixels);
    this.rangeIndicator.fillStyle(0x4a90d9, 0.1);
    this.rangeIndicator.fillCircle(0, 0, rangePixels);
  }

  /**
   * Cleans up drag preview elements
   */
  private cleanupDragPreview(): void {
    this.input.off('pointermove', this.onPointerMove);

    if (this.ghostTower) {
      this.ghostTower.destroy();
      this.ghostTower = null;
    }
    if (this.rangeIndicator) {
      this.rangeIndicator.destroy();
      this.rangeIndicator = null;
    }
    if (this.previewCell) {
      this.previewCell.destroy();
      this.previewCell = null;
    }
  }

  /**
   * Returns the EnemySystem instance
   */
  public getEnemySystem(): EnemySystem {
    return this.enemySystem;
  }

  /**
   * Returns the TowerSystem instance
   */
  public getTowerSystem(): TowerSystem {
    return this.towerSystem;
  }

  /**
   * Returns the ProjectileSystem instance
   */
  public getProjectileSystem(): ProjectileSystem {
    return this.projectileSystem;
  }

  public getCollisionSystem(): CollisionSystem {
    return this.collisionSystem;
  }

  /**
   * Returns all placed towers on the grid
   */
  public getPlacedTowers(): Tower[] {
    const towers: Tower[] = [];

    for (let row = 0; row < GRID_CONFIG.ROWS; row++) {
      for (let col = 0; col < GRID_CONFIG.COLS; col++) {
        const cell = this.gridCells[row][col];
        if (cell.getData('occupied')) {
          const tower = cell.getData('tower') as Tower;
          if (tower) {
            towers.push(tower);
          }
        }
      }
    }

    return towers;
  }
}
