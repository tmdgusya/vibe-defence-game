/* eslint-disable no-undef, no-magic-numbers */
import { vi } from 'vitest';

// Mock Phaser Vector2 class
class MockVector2 {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

// Mock Phaser Container class
class MockContainer {
  scene: any;
  x: number;
  y: number;
  body: any;
  children: any[] = [];
  alpha: number = 1;

  constructor(scene: any, x: number, y: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.body = {
      setSize: vi.fn(),
    };
  }

  add(child: any) {
    this.children.push(child);
    return this;
  }

  // Don't define getData/setData here - let subclasses define their own
  destroy() {}
}

// Mock Phaser Sprite class
class MockSprite {
  x: number;
  y: number;
  width: number = 64;
  height: number = 64;
  anims: any;

  constructor(_scene: any, x: number, y: number, _key: string) {
    this.x = x;
    this.y = y;
    this.anims = {
      exists: vi.fn().mockReturnValue(false),
    };
  }

  setScale = vi.fn().mockReturnThis();
  setOrigin = vi.fn().mockReturnThis();
  setTint = vi.fn().mockReturnThis();
  clearTint = vi.fn().mockReturnThis();
  play = vi.fn().mockReturnThis();
  on = vi.fn().mockReturnThis();
  destroy = vi.fn();
  flipX = false;
}

// Mock Phaser Graphics class
class MockGraphics {
  clear = vi.fn().mockReturnThis();
  fillStyle = vi.fn().mockReturnThis();
  fillRect = vi.fn().mockReturnThis();
  destroy = vi.fn();
}

// Mock TweenChain
type TweenCallback = () => void;

class MockTweenChain {
  callbacks: Record<string, TweenCallback[]> = {};

  on(event: string, callback: TweenCallback): this {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
    return this;
  }

  destroy = vi.fn();
  restart = vi.fn();
}

vi.mock('phaser', () => {
  const mockPhaser = {
    Scene: vi.fn().mockImplementation(() => ({
      add: {
        image: vi.fn(),
        text: vi.fn(),
        rectangle: vi.fn(),
        existing: vi.fn(),
        sprite: vi
          .fn()
          .mockImplementation((x, y, key) => new MockSprite(null, x, y, key)),
        graphics: vi.fn().mockImplementation(() => new MockGraphics()),
      },
      load: {
        image: vi.fn(),
        audio: vi.fn(),
      },
      sound: {
        play: vi.fn(),
      },
      input: {
        keyboard: {
          addKey: vi.fn(),
        },
      },
      events: {
        on: vi.fn(),
        emit: vi.fn(),
      },
      physics: {
        add: {
          existing: vi.fn(),
        },
      },
      tweens: {
        add: vi.fn(),
        chain: vi.fn().mockImplementation(() => new MockTweenChain()),
      },
      time: {
        delayedCall: vi.fn(),
      },
    })),
    Game: vi.fn().mockImplementation(() => ({
      config: vi.fn(),
    })),
    GameObjects: {
      Container: MockContainer,
      Sprite: MockSprite,
      Graphics: MockGraphics,
    },
    Math: {
      Vector2: MockVector2,
    },
    Physics: {
      Arcade: {
        Body: vi.fn().mockImplementation(() => ({
          setSize: vi.fn(),
        })),
      },
    },
    Tweens: {
      TweenChain: MockTweenChain,
    },
    Events: {
      EventEmitter: vi.fn().mockImplementation(() => ({
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
        once: vi.fn(),
        removeListener: vi.fn(),
        removeAllListeners: vi.fn(),
      })),
    },
  };

  return {
    default: mockPhaser,
    ...mockPhaser,
  };
});

vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    stop: vi.fn(),
    volume: vi.fn(),
  })),
}));

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    createGain: vi.fn(),
    createOscillator: vi.fn(),
    createBuffer: vi.fn(),
    decodeAudioData: vi.fn(),
  })),
});

global.requestAnimationFrame = vi.fn((cb) =>
  setTimeout(cb, 16)
) as unknown as typeof requestAnimationFrame;
global.cancelAnimationFrame = vi.fn() as unknown as typeof cancelAnimationFrame;

Object.defineProperty(global.performance, 'now', {
  value: vi.fn(() => Date.now()),
});

HTMLCanvasElement.prototype.getContext = vi.fn(
  () =>
    ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Array(4) })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => ({ data: new Array(4) })),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    }) as unknown as CanvasRenderingContext2D
) as unknown as typeof HTMLCanvasElement.prototype.getContext;
