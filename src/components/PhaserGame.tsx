import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import Phaser from 'phaser';
import phaserConfig from '../config/PhaserConfig';
import {
  EventBus,
  subscribeToEvent,
  unsubscribeFromEvent,
  emitEvent,
  type GameEvents,
} from '../utils/EventBus';
import { useGameStore } from '../store/gameStore';
import { GRID_CONFIG } from '../types';

/**
 * Ref type exposed by PhaserGame component
 */
export interface PhaserGameRef {
  game: Phaser.Game | null;
}

/**
 * PhaserGame Component
 *
 * React wrapper component for the Phaser game instance.
 * Handles game initialization, cleanup, and provides access
 * to the game instance via ref forwarding.
 */
const PhaserGame = forwardRef<PhaserGameRef>(function PhaserGame(_props, ref) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose the game instance to parent components
  useImperativeHandle(ref, () => ({ game: gameRef.current }), []);

  // Initialize Phaser game
  useLayoutEffect(() => {
    if (gameRef.current || !containerRef.current) {
      return;
    }

    // Create game instance with container reference
    const config: Phaser.Types.Core.GameConfig = {
      ...phaserConfig,
      parent: containerRef.current,
    };

    gameRef.current = new Phaser.Game(config);

    console.log('Phaser game instance created');

    // Cleanup on unmount
    return (): void => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        console.log('Phaser game instance destroyed');
      }
    };
  }, []);

  // Subscribe to game events from Phaser
  useEffect(() => {
    // Scene lifecycle - sync hydrated state to Phaser
    const handleSceneReady = (data: GameEvents['sceneReady']): void => {
      console.log(`Scene ready: ${data.scene}`);

      // If state was hydrated from localStorage, push it to Phaser
      const state = useGameStore.getState();
      if (state._hasHydrated && !state.isGameOver) {
        console.log('Syncing hydrated state to Phaser');
        // Emit events to sync React store state with Phaser
        emitEvent('goldChanged', { gold: state.gold, change: 0 });
        emitEvent('livesChanged', { lives: state.lives, change: 0 });
      }
    };

    // Tower events
    const handleTowerPlaced = (data: GameEvents['towerPlaced']): void => {
      console.log(
        `Tower placed: ${data.tower.type} at (${data.tower.gridX}, ${data.tower.gridY})`
      );
      useGameStore.getState().incrementTowersPlaced();
    };

    // Resource events
    const handleGoldChanged = (data: GameEvents['goldChanged']): void => {
      useGameStore.getState().setGold(data.gold);
    };

    const handleLivesChanged = (data: GameEvents['livesChanged']): void => {
      useGameStore.getState().setLives(data.lives);
    };

    // Game state events
    const handleGamePaused = (): void => {
      useGameStore.getState().setPaused(true);
    };

    const handleGameResumed = (): void => {
      useGameStore.getState().setPaused(false);
    };

    const handleGameOver = (data: GameEvents['gameOver']): void => {
      console.log(`Game over! Won: ${data.won}, Score: ${data.score}`);
      useGameStore.getState().setGameOver(true);
      useGameStore.getState().setScore(data.score);
    };

    // Wave events
    const handleWaveStarted = (data: GameEvents['waveStarted']): void => {
      console.log(`Wave ${data.wave} started`);
      useGameStore.getState().setWave(data.wave);
    };

    const handleWaveCompleted = (data: GameEvents['waveCompleted']): void => {
      console.log(`Wave ${data.wave} completed, bonus: ${data.bonus}`);
      // Wave number will be updated when next wave starts
    };

    // Enemy events
    const handleEnemyKilled = (data: GameEvents['enemyKilled']): void => {
      const state = useGameStore.getState();

      state.incrementEnemiesKilled();

      const newGold = state.gold + data.reward;
      state.setGold(newGold);

      emitEvent('goldChanged', { gold: newGold, change: data.reward });
    };

    const handleEnemyReachedEnd = (
      data: GameEvents['enemyReachedEnd']
    ): void => {
      const state = useGameStore.getState();
      const newLives = state.lives - data.damage;

      // Update lives in store
      state.setLives(newLives);

      // Emit livesChanged event for UI updates
      emitEvent('livesChanged', { lives: newLives, change: -data.damage });

      // Check for game over condition
      if (newLives <= 0) {
        emitEvent('gameOver', { won: false, score: state.score });
      }
    };

    // Subscribe to all events
    subscribeToEvent('sceneReady', handleSceneReady);
    subscribeToEvent('towerPlaced', handleTowerPlaced);
    subscribeToEvent('goldChanged', handleGoldChanged);
    subscribeToEvent('livesChanged', handleLivesChanged);
    subscribeToEvent('gamePaused', handleGamePaused);
    subscribeToEvent('gameResumed', handleGameResumed);
    subscribeToEvent('gameOver', handleGameOver);
    subscribeToEvent('waveStarted', handleWaveStarted);
    subscribeToEvent('waveCompleted', handleWaveCompleted);
    subscribeToEvent('enemyKilled', handleEnemyKilled);
    subscribeToEvent('enemyReachedEnd', handleEnemyReachedEnd);

    return (): void => {
      unsubscribeFromEvent('sceneReady', handleSceneReady);
      unsubscribeFromEvent('towerPlaced', handleTowerPlaced);
      unsubscribeFromEvent('goldChanged', handleGoldChanged);
      unsubscribeFromEvent('livesChanged', handleLivesChanged);
      unsubscribeFromEvent('gamePaused', handleGamePaused);
      unsubscribeFromEvent('gameResumed', handleGameResumed);
      unsubscribeFromEvent('gameOver', handleGameOver);
      unsubscribeFromEvent('waveStarted', handleWaveStarted);
      unsubscribeFromEvent('waveCompleted', handleWaveCompleted);
      unsubscribeFromEvent('enemyKilled', handleEnemyKilled);
      unsubscribeFromEvent('enemyReachedEnd', handleEnemyReachedEnd);
    };
  }, []);

  const screenToGrid = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return {
      x: Math.floor(x / GRID_CONFIG.CELL_SIZE),
      y: Math.floor(y / GRID_CONFIG.CELL_SIZE),
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const gridPos = screenToGrid(e.clientX, e.clientY, rect);

    emitEvent('towerDragOver', { gridX: gridPos.x, gridY: gridPos.y });
  };

  const handleDragLeave = () => {
    emitEvent('towerDragOver', { gridX: -1, gridY: -1 });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const data = JSON.parse(e.dataTransfer.getData('application/json')) as {
      towerType: string;
    };

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const gridPos = screenToGrid(e.clientX, e.clientY, rect);

    emitEvent('towerDrop', {
      towerType: data.towerType as any,
      gridX: gridPos.x,
      gridY: gridPos.y,
    });
  };

  return (
    <div
      id="phaser-container"
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: phaserConfig.width as number,
        height: phaserConfig.height as number,
      }}
    />
  );
});

// Export EventBus for use in other React components
export { EventBus };

export default PhaserGame;
