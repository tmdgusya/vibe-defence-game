# REACT GAME HOOKS

**Overview:** Custom React hooks for game loop FPS tracking and keyboard controls.

## STRUCTURE

```
src/hooks/
├── useGameLoop.ts            # FPS calculation via requestAnimationFrame
├── useKeyboardControls.ts    # Keyboard shortcuts (P/Space/Escape)
└── index.ts                  # Barrel export
```

## WHERE TO LOOK

| Task              | Location               | Notes                                 |
| ----------------- | ---------------------- | ------------------------------------- |
| FPS tracking      | useGameLoop.ts         | requestAnimationFrame, update store   |
| Keyboard pause    | useKeyboardControls.ts | P/Space toggle pause, Escape to pause |
| Store integration | Both hooks             | useGameStore() hook usage             |

## CONVENTIONS

- Cleanup via useEffect return (cancelAnimationFrame, removeEventListener)
- Prevent default behavior for game-related keys
- Zustand store for state management
- Direct mutation via store.getState() for toggle logic

## ANTI-PATTERNS

- NO inline event handlers (extract to useEffect)
- NO missing cleanup (always return cleanup function)
- NO complex logic in hook body (delegate to store)
