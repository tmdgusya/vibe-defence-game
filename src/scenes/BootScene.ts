import Phaser from 'phaser';

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
    this.simulateLoading();
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

  private simulateLoading(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    this.generateTowerTextures(graphics);
    this.generateEnemyTextures(graphics);
    this.generateProjectileTextures(graphics);
    this.generateMergeParticleTexture(graphics);

    graphics.clear();
    graphics.lineStyle(2, 0x4a90d9, 0.5);
    graphics.strokeRect(1, 1, 78, 78);
    graphics.generateTexture('grid-cell', 80, 80);

    graphics.destroy();
  }

  private generateEnemyTextures(graphics: Phaser.GameObjects.Graphics): void {
    const enemyConfigs = {
      'enemy-basic': { color: 0xe74c3c, size: 24 },
      'enemy-tank': { color: 0x8b4513, size: 32 },
      'enemy-flying': { color: 0x9b59b6, size: 20 },
      'enemy-boss': { color: 0x2c3e50, size: 40 },
      'enemy-swarm': { color: 0xe67e22, size: 16 },
      'enemy-armored': { color: 0x34495e, size: 28 },
    };

    Object.entries(enemyConfigs).forEach(([key, config]) => {
      graphics.clear();
      graphics.fillStyle(config.color);
      graphics.fillCircle(32, 32, config.size);

      if (key === 'enemy-boss') {
        graphics.fillStyle(0xc0392b);
        graphics.fillCircle(32, 32, config.size * 0.7);
      } else if (key === 'enemy-armored') {
        graphics.lineStyle(2, 0xffffff, 0.8);
        graphics.strokeCircle(32, 32, config.size + 4);
      } else if (key === 'enemy-flying') {
        graphics.fillStyle(0x8e44ad);
        graphics.fillCircle(24, 24, config.size * 0.6);
        graphics.fillCircle(40, 24, config.size * 0.6);
      }

      graphics.generateTexture(key, 64, 64);
    });
  }

  private generateTowerTextures(graphics: Phaser.GameObjects.Graphics): void {
    const towerConfigs = {
      peashooter: { baseColor: 0x27ae60, accentColor: 0x229954 },
      sunflower: { baseColor: 0xf39c12, accentColor: 0xf1c40f },
      wallnut: { baseColor: 0x8b4513, accentColor: 0x6d4c41 },
    };

    Object.entries(towerConfigs).forEach(([type, config]) => {
      for (let level = 1; level <= 3; level++) {
        graphics.clear();
        graphics.fillStyle(config.baseColor);
        graphics.fillCircle(32, 32, 28 - (level - 1) * 2);

        if (level >= 2) {
          graphics.lineStyle(2, config.accentColor, 0.8);
          graphics.strokeCircle(32, 32, 30);
        }

        if (level >= 3) {
          graphics.lineStyle(2, config.accentColor, 0.9);
          graphics.strokeCircle(32, 32, 34);
        }

        const textureKey =
          level === 1 ? `tower-${type}` : `tower-${type}-${level}`;
        graphics.generateTexture(textureKey, 64, 64);
      }
    });

    graphics.clear();
    graphics.fillStyle(0x27ae60);
    graphics.fillRect(0, 0, 64, 64);
    graphics.generateTexture('tower-placeholder', 64, 64);
  }

  private generateProjectileTextures(
    graphics: Phaser.GameObjects.Graphics
  ): void {
    graphics.clear();
    graphics.fillStyle(0x8b4513);
    graphics.fillCircle(12, 12, 10);
    graphics.fillStyle(0xa0522d);
    graphics.fillCircle(12, 12, 6);
    graphics.generateTexture('mortar-projectile', 24, 24);

    graphics.clear();
    graphics.fillStyle(0xf39c12);
    graphics.fillCircle(8, 8, 6);
    graphics.generateTexture('projectile-placeholder', 16, 16);
  }

  private generateMergeParticleTexture(
    graphics: Phaser.GameObjects.Graphics
  ): void {
    graphics.clear();
    graphics.fillStyle(0xffd700, 0.8);
    graphics.fillCircle(8, 8, 8);
    graphics.fillStyle(0xffa500, 0.6);
    graphics.fillCircle(8, 8, 4);
    graphics.generateTexture('merge-particle', 16, 16);
  }
}
