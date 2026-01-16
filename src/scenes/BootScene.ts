import Phaser from 'phaser';
import { GRID_CONFIG } from '../types';

export default class BootScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.createLoadingUI();
    this.setupLoadEvents();

    // Load actual image assets
    this.loadAssets();

    // Generate fallback textures for missing assets
    this.generateFallbackTextures();
  }

  create(): void {
    const renderer = this.game.renderer;
    if (renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
      console.log('Renderer: WebGL');
    } else {
      console.log('Renderer: Canvas');
    }

    this.scene.start('GameScene');
  }

  private createLoadingUI(): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    this.loadingText = this.add.text(centerX, centerY - 50, 'Loading...', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
    });
    this.loadingText.setOrigin(0.5);

    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x222222, 0.8);
    this.loadingBar.fillRect(centerX - 150, centerY - 10, 300, 20);

    this.progressBar = this.add.graphics();
  }

  private setupLoadEvents(): void {
    this.load.on('progress', (value: number) => {
      this.updateProgressBar(value);
    });

    this.load.on('complete', () => {
      this.loadingBar.destroy();
      this.progressBar.destroy();
      this.loadingText.destroy();
    });
  }

  private updateProgressBar(progress: number): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    this.progressBar.clear();
    this.progressBar.fillStyle(0x4a90d9, 1);
    this.progressBar.fillRect(centerX - 148, centerY - 8, 296 * progress, 16);

    this.loadingText.setText(`Loading... ${Math.floor(progress * 100)}%`);
  }

  private loadAssets(): void {
    // Load enemy sprites
    this.load.image('enemy-basic', '/assets/enemies/enemy-basic.png');
    this.load.image('enemy-tank', '/assets/enemies/enemy-tank.png');
    this.load.image('enemy-flying', '/assets/enemies/enemy-flying.png');
    this.load.image('enemy-swarm', '/assets/enemies/enemy-swarm.png');
    this.load.image('enemy-armored', '/assets/enemies/enemy-armored.png');

    // Load tower sprites - Sunflower (all 3 levels)
    this.load.image('tower-sunflower', '/assets/towers/tower-sunflower-1.png');
    this.load.image(
      'tower-sunflower-2',
      '/assets/towers/tower-sunflower-2.png'
    );
    this.load.image(
      'tower-sunflower-3',
      '/assets/towers/tower-sunflower-3.png'
    );

    // Load tower sprites - Peashooter (2 levels available)
    this.load.image(
      'tower-peashooter',
      '/assets/towers/tower-peashooter-1.png'
    );
    this.load.image(
      'tower-peashooter-2',
      '/assets/towers/tower-peashooter-2.png'
    );

    // Load tower sprites - Wallnut (2 levels available)
    this.load.image('tower-wallnut', '/assets/towers/tower-wallnut-1.png');
    this.load.image('tower-wallnut-2', '/assets/towers/tower-wallnut-2.png');

    // Load projectile sprites
    this.load.image(
      'projectile-placeholder',
      '/assets/projectiles/projectile-pea.png'
    );
    this.load.image(
      'mortar-projectile',
      '/assets/projectiles/projectile-mortar.png'
    );
  }

  private generateFallbackTextures(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    // Generate missing enemy textures (boss, armored)
    this.generateMissingEnemyTextures(graphics);

    // Generate missing tower textures (peashooter-3, wallnut-3, mortar series)
    this.generateMissingTowerTextures(graphics);

    // Generate projectile textures
    this.generateProjectileTextures(graphics);

    // Generate merge particle texture
    this.generateMergeParticleTexture(graphics);

    // Generate grid cell texture based on actual cell size
    graphics.clear();
    graphics.lineStyle(2, 0x4a90d9, 0.5);
    graphics.strokeRect(
      1,
      1,
      GRID_CONFIG.CELL_SIZE - 2,
      GRID_CONFIG.CELL_SIZE - 2
    );
    graphics.generateTexture(
      'grid-cell',
      GRID_CONFIG.CELL_SIZE,
      GRID_CONFIG.CELL_SIZE
    );

    graphics.destroy();
  }

  private generateMissingEnemyTextures(
    graphics: Phaser.GameObjects.Graphics
  ): void {
    // Generate only missing enemy textures (boss only, armored is now loaded)
    const enemyTextureSize = Math.floor(GRID_CONFIG.CELL_SIZE * 0.5);
    const center = enemyTextureSize / 2;
    const scale = enemyTextureSize / 64;

    // Boss enemy
    graphics.clear();
    graphics.fillStyle(0x2c3e50);
    graphics.fillCircle(center, center, 40 * scale);
    graphics.fillStyle(0xc0392b);
    graphics.fillCircle(center, center, 40 * scale * 0.7);
    graphics.generateTexture('enemy-boss', enemyTextureSize, enemyTextureSize);
  }

  private generateMissingTowerTextures(
    graphics: Phaser.GameObjects.Graphics
  ): void {
    // Generate only missing tower textures
    const towerSize = Math.floor(GRID_CONFIG.CELL_SIZE * 0.8);
    const center = towerSize / 2;
    const baseRadius = center * 0.7;

    // Peashooter level 3 (missing)
    graphics.clear();
    graphics.fillStyle(0x27ae60);
    graphics.fillCircle(center, center, baseRadius - 4);
    graphics.lineStyle(2, 0x229954, 0.8);
    graphics.strokeCircle(center, center, baseRadius + 2);
    graphics.lineStyle(2, 0x229954, 0.9);
    graphics.strokeCircle(center, center, baseRadius + 6);
    graphics.generateTexture('tower-peashooter-3', towerSize, towerSize);

    // Wallnut level 3 (missing)
    graphics.clear();
    graphics.fillStyle(0x8b4513);
    graphics.fillCircle(center, center, baseRadius - 4);
    graphics.lineStyle(2, 0x6d4c41, 0.8);
    graphics.strokeCircle(center, center, baseRadius + 2);
    graphics.lineStyle(2, 0x6d4c41, 0.9);
    graphics.strokeCircle(center, center, baseRadius + 6);
    graphics.generateTexture('tower-wallnut-3', towerSize, towerSize);

    // Mortar towers (all levels missing)
    const mortarColor = 0x556b2f;
    const mortarAccent = 0x6b8e23;

    for (let level = 1; level <= 3; level++) {
      graphics.clear();
      graphics.fillStyle(mortarColor);
      graphics.fillCircle(center, center, baseRadius - (level - 1) * 2);

      if (level >= 2) {
        graphics.lineStyle(2, mortarAccent, 0.8);
        graphics.strokeCircle(center, center, baseRadius + 2);
      }

      if (level >= 3) {
        graphics.lineStyle(2, mortarAccent, 0.9);
        graphics.strokeCircle(center, center, baseRadius + 6);
      }

      const textureKey = level === 1 ? 'tower-mortar' : `tower-mortar-${level}`;
      graphics.generateTexture(textureKey, towerSize, towerSize);
    }

    // Placeholder
    graphics.clear();
    graphics.fillStyle(0x27ae60);
    graphics.fillRect(0, 0, towerSize, towerSize);
    graphics.generateTexture('tower-placeholder', towerSize, towerSize);
  }

  private generateProjectileTextures(
    graphics: Phaser.GameObjects.Graphics
  ): void {
    // Scale projectile size (20% of cell size for mortar, 13% for regular)
    const mortarSize = Math.floor(GRID_CONFIG.CELL_SIZE * 0.2);
    const regularSize = Math.floor(GRID_CONFIG.CELL_SIZE * 0.13);

    graphics.clear();
    graphics.fillStyle(0x8b4513);
    graphics.fillCircle(mortarSize / 2, mortarSize / 2, mortarSize * 0.42);
    graphics.fillStyle(0xa0522d);
    graphics.fillCircle(mortarSize / 2, mortarSize / 2, mortarSize * 0.25);
    graphics.generateTexture('mortar-projectile', mortarSize, mortarSize);

    graphics.clear();
    graphics.fillStyle(0xf39c12);
    graphics.fillCircle(regularSize / 2, regularSize / 2, regularSize * 0.375);
    graphics.generateTexture(
      'projectile-placeholder',
      regularSize,
      regularSize
    );
  }

  private generateMergeParticleTexture(
    graphics: Phaser.GameObjects.Graphics
  ): void {
    // Scale particle size (13% of cell size)
    const particleSize = Math.floor(GRID_CONFIG.CELL_SIZE * 0.13);
    const center = particleSize / 2;

    graphics.clear();
    graphics.fillStyle(0xffd700, 0.8);
    graphics.fillCircle(center, center, center);
    graphics.fillStyle(0xffa500, 0.6);
    graphics.fillCircle(center, center, center * 0.5);
    graphics.generateTexture('merge-particle', particleSize, particleSize);
  }
}
