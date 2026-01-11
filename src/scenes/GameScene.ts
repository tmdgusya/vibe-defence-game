import Phaser from 'phaser';
import { GRID_CONFIG, TowerType, TowerLevel } from '../types';
import {
  emitEvent,
  subscribeToEvent,
  type GameEvents,
} from '../utils/EventBus';
import { Tower } from '../entities/Tower';
import { TowerSystem } from '../systems/TowerSystem';

/**
 * Main Game Scene
 * Handles the core game rendering, grid system, and game loop
 */
export default class GameScene extends Phaser.Scene {
  private gridCells: Phaser.GameObjects.Image[][] = [];
  private towerSystem: TowerSystem;
  private selectedTowerType: TowerType | null = null;
  private currentGold: number = 200;
  private isPaused: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
    this.towerSystem = new TowerSystem(this);
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

    // Listen for pause/resume from React UI
    subscribeToEvent('gamePaused', () => {
      this.isPaused = true;
      this.scene.pause();
    });

    subscribeToEvent('gameResumed', () => {
      this.isPaused = false;
      this.scene.resume();
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

  update(_time: number, _delta: number): void {
    // Game loop - will be expanded with game logic
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
      this.togglePause();
    });

    this.input.keyboard?.on('keydown-P', () => {
      this.togglePause();
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      console.log('Space pressed - Wave start (not implemented yet)');
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
  private placeTower(
    gridX: number,
    gridY: number,
    towerType: TowerType
  ): void {
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
}
