/* eslint-disable no-undef, no-magic-numbers */
import { vi } from 'vitest';

vi.mock('phaser', () => ({
  Scene: vi.fn().mockImplementation(() => ({
    add: {
      image: vi.fn(),
      text: vi.fn(),
      rectangle: vi.fn(),
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
  })),
  Game: vi.fn().mockImplementation(() => ({
    config: vi.fn(),
  })),
}));

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
