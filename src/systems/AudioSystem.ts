/* eslint-disable no-console, no-magic-numbers */
import { Howl, Howler } from 'howler';
import { useGameStore } from '../store/gameStore';

type SoundEffect =
  | 'towerShoot'
  | 'towerHit'
  | 'enemyDeath'
  | 'waveStart'
  | 'waveComplete'
  | 'gameOver'
  | 'victory'
  | 'towerPlace'
  | 'towerUpgrade'
  | 'goldEarned';

type BackgroundMusic = 'gameplay' | 'menu' | 'victory' | 'gameOver';

interface SoundConfig {
  volume?: number;
  loop?: boolean;
  rate?: number;
}

class AudioSystem {
  private soundEffects: Map<SoundEffect, Howl> = new Map();
  private backgroundMusic: Map<BackgroundMusic, Howl> = new Map();
  private currentMusic: Howl | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeSounds();
    this.initializeMusic();
  }

  private initializeSounds(): void {
    const sounds: Record<SoundEffect, string> = {
      towerShoot: '/assets/sounds/tower-shoot.wav',
      towerHit: '/assets/sounds/tower-hit.wav',
      enemyDeath: '/assets/sounds/enemy-death.wav',
      waveStart: '/assets/sounds/wave-start.wav',
      waveComplete: '/assets/sounds/wave-complete.wav',
      gameOver: '/assets/sounds/game-over.wav',
      victory: '/assets/sounds/victory.wav',
      towerPlace: '/assets/sounds/tower-place.wav',
      towerUpgrade: '/assets/sounds/tower-upgrade.wav',
      goldEarned: '/assets/sounds/gold-earned.wav',
    };

    for (const [key, src] of Object.entries(sounds)) {
      const soundKey = key as SoundEffect;
      this.soundEffects.set(
        soundKey,
        new Howl({
          src: [src],
          preload: true,
          volume: 0.5,
        })
      );
    }

    this.isInitialized = true;
  }

  private initializeMusic(): void {
    const music: Record<BackgroundMusic, string> = {
      gameplay: '/assets/sounds/music-gameplay.mp3',
      menu: '/assets/sounds/music-menu.mp3',
      victory: '/assets/sounds/music-victory.mp3',
      gameOver: '/assets/sounds/music-gameover.mp3',
    };

    for (const [key, src] of Object.entries(music)) {
      const musicKey = key as BackgroundMusic;
      this.backgroundMusic.set(
        musicKey,
        new Howl({
          src: [src],
          preload: true,
          loop: true,
          volume: 0.3,
        })
      );
    }
  }

  playSound(effect: SoundEffect, config?: SoundConfig): void {
    const state = useGameStore.getState();

    if (!state.settings.soundEnabled || !this.isInitialized) {
      return;
    }

    const sound = this.soundEffects.get(effect);

    if (!sound) {
      console.warn(`Sound effect not found: ${effect}`);
      return;
    }

    const soundInstance = sound.play();

    if (soundInstance !== undefined && config) {
      if (config.volume !== undefined) {
        sound.volume(config.volume, soundInstance);
      }
      if (config.rate !== undefined) {
        sound.rate(config.rate, soundInstance);
      }
    }
  }

  playMusic(music: BackgroundMusic): void {
    const state = useGameStore.getState();

    if (!state.settings.musicEnabled) {
      return;
    }

    if (this.currentMusic) {
      this.currentMusic.stop();
    }

    const track = this.backgroundMusic.get(music);

    if (!track) {
      console.warn(`Background music not found: ${music}`);
      return;
    }

    this.currentMusic = track;
    track.play();
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  setMusicVolume(volume: number): void {
    Howler.volume(volume);

    if (this.currentMusic) {
      this.currentMusic.volume(volume);
    }
  }

  setSoundVolume(volume: number): void {
    for (const sound of this.soundEffects.values()) {
      sound.volume(volume);
    }
  }

  muteAll(): void {
    Howler.mute(true);
  }

  unmuteAll(): void {
    Howler.mute(false);
  }

  updateSettings(soundEnabled: boolean, musicEnabled: boolean): void {
    if (!soundEnabled) {
      this.setSoundVolume(0);
    } else {
      this.setSoundVolume(0.5);
    }

    if (!musicEnabled) {
      this.stopMusic();
    }
  }

  destroy(): void {
    for (const sound of this.soundEffects.values()) {
      sound.unload();
    }
    for (const music of this.backgroundMusic.values()) {
      music.unload();
    }
    this.soundEffects.clear();
    this.backgroundMusic.clear();
    this.isInitialized = false;
  }
}

let audioSystemInstance: AudioSystem | null = null;

export const getAudioSystem = (): AudioSystem => {
  if (!audioSystemInstance) {
    audioSystemInstance = new AudioSystem();
  }
  return audioSystemInstance;
};

export const destroyAudioSystem = (): void => {
  if (audioSystemInstance) {
    audioSystemInstance.destroy();
    audioSystemInstance = null;
  }
};

export type { SoundEffect, BackgroundMusic, SoundConfig };
