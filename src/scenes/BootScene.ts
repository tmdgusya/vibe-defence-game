import Phaser from 'phaser';

/**
 * Boot Scene - Initial loading and asset preloading
 * Displays loading progress and transitions to GameScene
 */
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

    // Placeholder: Add actual asset loading here in the future
    // For now, we simulate a brief loading period
    this.simulateLoading();
  }

  create(): void {
    // Log WebGL/Canvas renderer info
    const renderer = this.game.renderer;
    if (renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
      console.log('Renderer: WebGL');
    } else {
      console.log('Renderer: Canvas');
    }

    // Transition to GameScene
    this.scene.start('GameScene');
  }

  private createLoadingUI(): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Loading text
    this.loadingText = this.add.text(centerX, centerY - 50, 'Loading...', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
    });
    this.loadingText.setOrigin(0.5);

    // Loading bar background
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x222222, 0.8);
    this.loadingBar.fillRect(centerX - 150, centerY - 10, 300, 20);

    // Progress bar
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
    // Create placeholder graphics to simulate asset loading
    // These will be replaced with actual assets later
    const graphics = this.make.graphics({ x: 0, y: 0 });

    // Generate placeholder tower texture
    graphics.fillStyle(0x27ae60);
    graphics.fillRect(0, 0, 64, 64);
    graphics.generateTexture('tower-placeholder', 64, 64);

    // Generate placeholder enemy texture
    graphics.clear();
    graphics.fillStyle(0xe74c3c);
    graphics.fillCircle(32, 32, 24);
    graphics.generateTexture('enemy-placeholder', 64, 64);

    // Generate placeholder projectile texture
    graphics.clear();
    graphics.fillStyle(0xf39c12);
    graphics.fillCircle(8, 8, 6);
    graphics.generateTexture('projectile-placeholder', 16, 16);

    // Generate grid cell texture
    graphics.clear();
    graphics.lineStyle(2, 0x4a90d9, 0.5);
    graphics.strokeRect(1, 1, 78, 78);
    graphics.generateTexture('grid-cell', 80, 80);

    graphics.destroy();
  }
}
