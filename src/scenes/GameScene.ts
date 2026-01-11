import Phaser from 'phaser';
import { GRID_CONFIG } from '../types';
import { EventBus } from '../utils/EventBus';

/**
 * Main Game Scene
 * Handles the core game rendering, grid system, and game loop
 */
export default class GameScene extends Phaser.Scene {
  private gridCells: Phaser.GameObjects.Image[][] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    console.log('GameScene: Creating game world...');

    // Create the grid
    this.createGrid();

    // Set up input handling
    this.setupInput();

    // Emit scene ready event
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
      // For demo: place a placeholder tower
      this.placePlaceholderTower(gridX, gridY);
    }
  }

  /**
   * Places a placeholder tower for demonstration
   */
  private placePlaceholderTower(gridX: number, gridY: number): void {
    const cell = this.gridCells[gridY][gridX];
    const x = cell.x;
    const y = cell.y;

    // Create placeholder tower
    const tower = this.add.image(x, y, 'tower-placeholder');
    tower.setScale(0.8);

    // Mark cell as occupied
    cell.setData('occupied', true);
    cell.setData('tower', tower);

    // Emit tower placed event
    EventBus.emit('towerPlaced', {
      tower: {
        type: 'peashooter',
        level: 1,
        gridX,
        gridY,
        damage: 10,
        attackSpeed: 1,
        range: 3,
        cost: 100,
      },
    });

    console.log(`Placeholder tower placed at (${gridX}, ${gridY})`);
  }

  /**
   * Gets the grid cell at specified coordinates
   */
  public getCell(gridX: number, gridY: number): Phaser.GameObjects.Image | null {
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
