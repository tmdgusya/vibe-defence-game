import Phaser from 'phaser';
import { GRID_CONFIG, TowerType, TowerLevel } from '../types';
import { EventBus } from '../utils/EventBus';
import { Tower } from '../entities/Tower';
import { TowerSystem } from '../systems/TowerSystem';

/**
 * Main Game Scene
 * Handles the core game rendering, grid system, and game loop
 */
export default class GameScene extends Phaser.Scene {
  private gridCells: Phaser.GameObjects.Image[][] = [];
  private towerSystem: TowerSystem;

  constructor() {
    super({ key: 'GameScene' });
    this.towerSystem = new TowerSystem(this);
  }

  create(): void {
    console.log('GameScene: Creating game world...');

    this.createGrid();
    this.setupInput();

    EventBus.emit('sceneReady', { scene: 'GameScene' });

    console.log('GameScene: Game world created successfully');
    console.log(
      `Grid: ${GRID_CONFIG.COLS}x${GRID_CONFIG.ROWS} (${GRID_CONFIG.WIDTH}x${GRID_CONFIG.HEIGHT}px)`
    );
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
      EventBus.emit('gamePaused', {});
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      console.log('Space pressed - Wave start (not implemented yet)');
    });
  }

  /**
   * Handles grid cell clicks
   */
  private onCellClick(gridX: number, gridY: number): void {
    const cell = this.gridCells[gridY][gridX];
    const isOccupied = cell.getData('occupied');

    console.log(`Cell clicked: (${gridX}, ${gridY}), occupied: ${isOccupied}`);

    if (!isOccupied) {
      this.placeTower(gridX, gridY);
    }
  }

  /**
   * Places a placeholder tower for demonstration
   */
  private placeTower(gridX: number, gridY: number): void {
    const validation = this.towerSystem.validatePlacement(gridX, gridY);

    if (!validation.valid) {
      console.log(`Invalid tower placement: ${validation.reason}`);
      return;
    }

    const towerData = this.towerSystem.createTowerData(
      TowerType.PEASHOOTER,
      TowerLevel.BASIC,
      gridX,
      gridY
    );

    const tower = new Tower(this, towerData);

    const cell = this.gridCells[gridY][gridX];
    cell.setData('occupied', true);
    cell.setData('tower', tower);

    EventBus.emit('towerPlaced', { tower: towerData });

    console.log(`Tower placed at (${gridX}, ${gridY})`);
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
