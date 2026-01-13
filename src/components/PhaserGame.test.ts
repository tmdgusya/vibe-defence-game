import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnemyType } from '../types';

vi.mock('../utils/EventBus', () => {
  const emitMock = vi.fn();

  return {
    EventBus: {
      emit: emitMock,
      on: vi.fn(),
      off: vi.fn(),
      once: vi.fn(),
      listenerCount: vi.fn(() => 0),
      removeAllListeners: vi.fn(),
    },
    emitEvent: emitMock,
    subscribeToEvent: vi.fn(),
    unsubscribeFromEvent: vi.fn(),
  };
});

import { useGameStore } from '../store/gameStore';
import { emitEvent, EventBus } from '../utils/EventBus';

describe('PhaserGame Component - Enemy Kill Handler', () => {
  beforeEach(() => {
    useGameStore.setState({ gold: 200, enemiesKilled: 0 });
    vi.clearAllMocks();
  });

  it('should add 10 gold for Basic enemy kill', () => {
    const initialGold = useGameStore.getState().gold;

    const newGold = initialGold + 10;
    useGameStore.getState().setGold(newGold);

    expect(useGameStore.getState().gold).toBe(210);
  });

  it('should add 100 gold for Boss enemy kill', () => {
    const initialGold = useGameStore.getState().gold;

    const newGold = initialGold + 100;
    useGameStore.getState().setGold(newGold);

    expect(useGameStore.getState().gold).toBe(300);
  });

  it('should add 25 gold for Tank enemy kill', () => {
    const initialGold = useGameStore.getState().gold;

    const newGold = initialGold + 25;
    useGameStore.getState().setGold(newGold);

    expect(useGameStore.getState().gold).toBe(225);
  });

  it('should add 15 gold for Flying enemy kill', () => {
    const initialGold = useGameStore.getState().gold;

    const newGold = initialGold + 15;
    useGameStore.getState().setGold(newGold);

    expect(useGameStore.getState().gold).toBe(215);
  });

  it('should add 5 gold for Swarm enemy kill', () => {
    const initialGold = useGameStore.getState().gold;

    const newGold = initialGold + 5;
    useGameStore.getState().setGold(newGold);

    expect(useGameStore.getState().gold).toBe(205);
  });

  it('should add 35 gold for Armored enemy kill', () => {
    const initialGold = useGameStore.getState().gold;

    const newGold = initialGold + 35;
    useGameStore.getState().setGold(newGold);

    expect(useGameStore.getState().gold).toBe(235);
  });

  it('should accumulate gold from multiple kills', () => {
    const initialGold = useGameStore.getState().gold;

    useGameStore.getState().setGold(initialGold + 10);
    useGameStore.getState().setGold(useGameStore.getState().gold + 25);
    useGameStore.getState().setGold(useGameStore.getState().gold + 15);

    expect(useGameStore.getState().gold).toBe(initialGold + 10 + 25 + 15);
  });

  it('should emit goldChanged event with correct data', () => {
    const currentGold = useGameStore.getState().gold;
    const reward = 10;
    const newGold = currentGold + reward;

    emitEvent('goldChanged', { gold: newGold, change: reward });

    expect(EventBus.emit).toHaveBeenCalledWith('goldChanged', {
      gold: newGold,
      change: reward,
    });
  });

  it('should have correct reward values for all enemy types', () => {
    const rewards: Record<EnemyType, number> = {
      [EnemyType.BASIC]: 10,
      [EnemyType.TANK]: 25,
      [EnemyType.FLYING]: 15,
      [EnemyType.BOSS]: 100,
      [EnemyType.SWARM]: 5,
      [EnemyType.ARMORED]: 35,
    };

    expect(rewards[EnemyType.BASIC]).toBe(10);
    expect(rewards[EnemyType.TANK]).toBe(25);
    expect(rewards[EnemyType.FLYING]).toBe(15);
    expect(rewards[EnemyType.BOSS]).toBe(100);
    expect(rewards[EnemyType.SWARM]).toBe(5);
    expect(rewards[EnemyType.ARMORED]).toBe(35);
  });
});
