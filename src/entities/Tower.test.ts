import { describe, it, expect } from 'vitest';
import { TowerType, TowerLevel } from '../types';

describe('Tower Types and Constants', () => {
  it('should have correct tower types', () => {
    expect(TowerType.PEASHOOTER).toBe('peashooter');
    expect(TowerType.SUNFLOWER).toBe('sunflower');
    expect(TowerType.WALLNUT).toBe('wallnut');
  });

  it('should have correct tower levels', () => {
    expect(TowerLevel.BASIC).toBe(1);
    expect(TowerLevel.ADVANCED).toBe(2);
    expect(TowerLevel.ELITE).toBe(3);
  });
});
