import Phaser from 'phaser';
import { GRID_CONFIG, TowerType, TowerLevel, TowerData } from '../types';
import {
  emitEvent,
  subscribeToEvent,
  type GameEvents,
} from '../utils/EventBus';
import { Tower } from '../entities/Tower';
import { TowerSystem } from '../systems/TowerSystem';
import { EnemySystem } from '../systems/EnemySystem';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { useGameStore } from '../store/gameStore';
import { CollisionSystem } from '../systems/CollisionSystem';
import { getAudioSystem } from '../systems/AudioSystem';

/**
 * Main Game Scene
 * Handles the core game rendering, grid system, and game loop
 */
export default class GameScene extends Phaser.Scene {
  private gridCells: Phaser.GameObjects.Image[][] = [];
  private towerSystem: TowerSystem;
  private enemySystem: EnemySystem;
  private projectileSystem: ProjectileSystem;
  private collisionSystem: CollisionSystem;
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

    // Restore state from Zustand store (hydrated from localStorage)
    this.restoreFromStore();

    this.createGrid();
    this.setupInput();
    this.setupEventListeners();

    // Initialize collision system after scene is ready
    this.collisionSystem.init();

    emitEvent('sceneReady', { scene: 'GameScene' });

    console.log('GameScene: Game world created successfully');
    console.log(
      `Grid: ${GRID_CONFIG.COLS}x${GRID_CONFIG.ROWS} (${GRID_CONFIG.WIDTH}x${GRID_CONFIG.HEIGHT}px)`
    );
  }

  /**
   * Restores game state from Zustand store (hydrated from localStorage)
   */
  private restoreFromStore(): void {
    const state = useGameStore.getState();

    // Sync local state with persisted store values
    this.currentGold = state.gold;
    this.currentWave = state.wave;
    this.isPaused = state.isPaused;
    this.selectedTowerType = state.selectedTowerType;

    console.log(
      `GameScene: Restored state - Gold: ${this.currentGold}, Wave: ${this.currentWave}, Paused: ${this.isPaused}`
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

    // Listen for game reset - restart the entire scene
    subscribeToEvent('gameReset', () => {
      console.log('GameScene: Received gameReset event, restarting scene...');
      this.scene.restart();
    });

    // Listen for wave completion to advance wave counter
    subscribeToEvent('waveCompleted', (data: GameEvents['waveCompleted']) => {
      this.currentWave = data.wave + 1;
    });

    const audioSystem = getAudioSystem();

    subscribeToEvent('projectileFired', () => {
      audioSystem.playSound('towerShoot');
    });

    subscribeToEvent('projectileHit', () => {
      audioSystem.playSound('towerHit');
    });

    subscribeToEvent('enemyKilled', () => {
      audioSystem.playSound('enemyDeath');
    });

    subscribeToEvent(
      'startWaveRequested',
      (data: GameEvents['startWaveRequested']) => {
        if (!this.enemySystem.isWaveInProgress()) {
          this.enemySystem.startWave(data.wave);
        }
      }
    );

    subscribeToEvent('waveStarted', () => {
      audioSystem.playSound('waveStart');
    });

    subscribeToEvent('waveCompleted', () => {
      audioSystem.playSound('waveComplete');
      audioSystem.playSound('goldEarned');
    });

    subscribeToEvent('towerPlaced', () => {
      audioSystem.playSound('towerPlace');
    });

    subscribeToEvent('towerUpgrade', () => {
      audioSystem.playSound('towerUpgrade');
    });

    subscribeToEvent('gameOver', (data: GameEvents['gameOver']) => {
      if (data.won) {
        audioSystem.playSound('victory');
      } else {
        audioSystem.playSound('gameOver');
      }
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

    this.checkForMerge(tower);

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

  private checkForMerge(tower: Tower): void {
    const towerData = tower.getData();
    const neighbors = this.getNeighbors(towerData.gridX, towerData.gridY);
    let mergeAvailable = false;

    for (const neighbor of neighbors) {
      if (
        neighbor &&
        this.towerSystem.canMerge(towerData, neighbor.getData())
      ) {
        mergeAvailable = true;
      }
    }

    tower.setCanMerge(mergeAvailable);

    for (const neighbor of neighbors) {
      if (neighbor) {
        const neighborData = neighbor.getData();
        const neighborNeighbors = this.getNeighbors(
          neighborData.gridX,
          neighborData.gridY
        );
        let neighborMergeAvailable = false;

        for (const nn of neighborNeighbors) {
          if (
            nn &&
            nn !== tower &&
            this.towerSystem.canMerge(neighborData, nn.getData())
          ) {
            neighborMergeAvailable = true;
          }
        }

        neighbor.setCanMerge(neighborMergeAvailable);
      }
    }

    for (const neighbor of neighbors) {
      if (
        neighbor &&
        this.towerSystem.canMerge(towerData, neighbor.getData())
      ) {
        this.performMerge(tower, neighbor);
        break;
      }
    }
  }

  private getNeighbors(gridX: number, gridY: number): Tower[] {
    const neighbors: Tower[] = [];
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dx, dy] of directions) {
      const nx = gridX + dx;
      const ny = gridY + dy;

      if (
        nx >= 0 &&
        nx < GRID_CONFIG.COLS &&
        ny >= 0 &&
        ny < GRID_CONFIG.ROWS
      ) {
        const cell = this.gridCells[ny][nx];
        if (cell.getData('occupied')) {
          const tower = cell.getData('tower') as Tower;
          if (tower) {
            neighbors.push(tower);
          }
        }
      }
    }

    return neighbors;
  }

  private performMerge(tower1: Tower, tower2: Tower): void {
    const data1 = tower1.getData();
    const data2 = tower2.getData();

    const result = this.towerSystem.getMergeResult(data1, data2);

    if (!result) {
      return;
    }

    this.createMergeParticles(tower1.x, tower1.y, tower2.x, tower2.y);

    this.animateMergeTransition(tower1, tower2, result);
  }

  private createMergeParticles(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): void {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;

    const particles = this.add.particles(0, 0, 'merge-particle', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      emitting: false,
    });

    particles.explode(20, centerX, centerY);
  }

  private animateMergeTransition(
    tower1: Tower,
    tower2: Tower,
    result: TowerData
  ): void {
    const centerX = (tower1.x + tower2.x) / 2;
    const centerY = (tower1.y + tower2.y) / 2;

    this.tweens.add({
      targets: [tower1, tower2],
      x: centerX,
      y: centerY,
      scale: { from: 1, to: 0 },
      alpha: { from: 1, to: 0 },
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        const data1 = tower1.getData();
        const data2 = tower2.getData();

        tower1.destroy();
        tower2.destroy();

        this.clearCells(data1.gridX, data1.gridY);
        this.clearCells(data2.gridX, data2.gridY);

        const newTower = new Tower(this, result);
        const cell = this.gridCells[result.gridY][result.gridX];
        cell.setData('occupied', true);
        cell.setData('tower', newTower);

        newTower.setScale(0);
        this.tweens.add({
          targets: newTower,
          scale: 1,
          duration: 200,
          ease: 'Back.out',
          onComplete: () => {
            emitEvent('towerMerged', {
              result,
              consumed: [data1, data2],
            });
            this.showMergeFlash(result.gridX, result.gridY);
          },
        });
      },
    });
  }

  private showMergeFlash(gridX: number, gridY: number): void {
    const cell = this.gridCells[gridY][gridX];
    cell.setTint(0xffd700);

    this.tweens.add({
      targets: cell,
      alpha: { from: 0.5, to: 1 },
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        cell.clearTint();
      },
    });
  }

  private clearCells(gridX: number, gridY: number): void {
    const cell = this.gridCells[gridY][gridX];
    cell.setData('occupied', false);
    cell.setData('tower', null);
  }

  /**
   * Returns to EnemySystem instance
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
   * Returns current gold amount
   */
  public getGold(): number {
    return this.currentGold;
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
