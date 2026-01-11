import {
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
  EventData,
} from '../utils/EventBus';
import { useGameStore } from '../store/gameStore';

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

  // Subscribe to game events
  useEffect(() => {
    const handleSceneReady = (data: { scene: string }): void => {
      console.log(`Scene ready: ${data.scene}`);
    };

    const handleTowerPlaced = (data: EventData['towerPlaced']): void => {
      console.log(
        `Tower placed: ${data.tower.type} at (${data.tower.gridX}, ${data.tower.gridY})`
      );
      useGameStore.getState().incrementTowersPlaced();
    };

    const handleGoldChanged = (data: EventData['goldChanged']): void => {
      useGameStore.getState().setGold(data.gold);
    };

    subscribeToEvent('sceneReady', handleSceneReady);
    subscribeToEvent('towerPlaced', handleTowerPlaced);
    subscribeToEvent('goldChanged', handleGoldChanged);

    return (): void => {
      unsubscribeFromEvent('sceneReady', handleSceneReady);
      unsubscribeFromEvent('towerPlaced', handleTowerPlaced);
      unsubscribeFromEvent('goldChanged', handleGoldChanged);
    };
  }, []);

  return (
    <div
      id="phaser-container"
      ref={containerRef}
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
