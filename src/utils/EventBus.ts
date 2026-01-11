import Phaser from 'phaser';
import type { GameEvents, GameEventType } from '../types';

/**
 * EventBus - Communication bridge between React and Phaser
 *
 * Uses Phaser's EventEmitter for type-safe event handling
 * between the React UI layer and the Phaser game engine.
 *
 * Event Flow:
 * - React → Phaser: selectTower, etc.
 * - Phaser → React: towerPlaced, goldChanged, placementFailed, etc.
 *
 * @example
 * // Subscribe to an event
 * subscribeToEvent('towerPlaced', (data) => {
 *   console.log(`Tower placed at (${data.tower.gridX}, ${data.tower.gridY})`);
 * });
 *
 * // Emit an event
 * emitEvent('goldChanged', { gold: 150, change: -50 });
 *
 * // One-time subscription
 * subscribeOnce('sceneReady', (data) => {
 *   console.log(`Scene ${data.scene} is ready!`);
 * });
 */
export const EventBus = new Phaser.Events.EventEmitter();

// Debug mode flag
let debugMode = false;

/**
 * Enable or disable debug mode for EventBus
 * When enabled, all events are logged to console
 */
export function enableDebugMode(enabled: boolean): void {
  debugMode = enabled;
  if (enabled) {
    console.log('[EventBus] Debug mode enabled');
  }
}

/**
 * Type-safe event subscription helper
 */
export function subscribeToEvent<K extends GameEventType>(
  event: K,
  callback: (data: GameEvents[K]) => void
): void {
  EventBus.on(event, callback);
  if (debugMode) {
    console.log(`[EventBus] Subscribed to: ${event}`);
  }
}

/**
 * Type-safe one-time event subscription
 * Automatically unsubscribes after the first event
 */
export function subscribeOnce<K extends GameEventType>(
  event: K,
  callback: (data: GameEvents[K]) => void
): void {
  EventBus.once(event, callback);
  if (debugMode) {
    console.log(`[EventBus] Subscribed once to: ${event}`);
  }
}

/**
 * Type-safe event emission helper
 */
export function emitEvent<K extends GameEventType>(
  event: K,
  data: GameEvents[K]
): void {
  if (debugMode) {
    console.log(`[EventBus] Emit: ${event}`, data);
  }
  EventBus.emit(event, data);
}

/**
 * Unsubscribe from an event
 * If callback is provided, only that specific callback is removed
 * Otherwise, all listeners for the event are removed
 */
export function unsubscribeFromEvent<K extends GameEventType>(
  event: K,
  callback?: (data: GameEvents[K]) => void
): void {
  if (callback) {
    EventBus.off(event, callback);
  } else {
    EventBus.off(event);
  }
  if (debugMode) {
    console.log(`[EventBus] Unsubscribed from: ${event}`);
  }
}

/**
 * Check if an event has any listeners
 */
export function hasListeners(event: GameEventType): boolean {
  return EventBus.listenerCount(event) > 0;
}

/**
 * Get the number of listeners for an event
 */
export function getListenerCount(event: GameEventType): number {
  return EventBus.listenerCount(event);
}

/**
 * Remove all listeners from all events
 * Use with caution - mainly for testing or cleanup
 */
export function removeAllListeners(): void {
  EventBus.removeAllListeners();
  if (debugMode) {
    console.log('[EventBus] All listeners removed');
  }
}

// Re-export types for convenience
export type { GameEvents, GameEventType };

export default EventBus;
