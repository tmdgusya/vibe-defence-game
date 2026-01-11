# REACT UI COMPONENTS

**Overview:** React UI layer for game interface and screens.

## STRUCTURE

```
src/components/
├── PhaserGame.tsx           # Phaser game instance wrapper (ref forwarding)
├── GameUI.tsx               # Root UI component managing screens
├── TowerPanel.tsx           # Tower management (select/sell/upgrade)
├── TowerSelectionPanel.tsx   # Tower type selection with costs
├── GameOverScreen.tsx        # End game UI with score
├── PauseMenu.tsx            # Pause/resume overlay
├── Header.tsx, Footer.tsx   # Layout components
└── index.ts                 # Barrel export
```

## WHERE TO LOOK

| Task                    | File                    | Notes                                           |
| ----------------------- | ----------------------- | ----------------------------------------------- |
| Phaser initialization   | PhaserGame.tsx          | useLayoutEffect, forwardRef, cleanup            |
| Screen state management | GameUI.tsx              | Conditional rendering (playing/paused/gameover) |
| Tower actions           | TowerPanel.tsx          | sell/upgrade buttons, EventBus emit             |
| Tower selection         | TowerSelectionPanel.tsx | Store integration, cost display                 |
| Game end                | GameOverScreen.tsx      | Score display, restart handler                  |

## CONVENTIONS

- Event subscriptions with cleanup in useEffect
- Zustand store via useGameStore() hook
- Props for component-specific data
- TypeScript JSX.Element returns
- index.ts barrel exports for clean imports

## ANTI-PATTERNS

- NO direct Phaser method calls (emit events instead)
- NO inline event handlers in JSX (extract to functions)
- NO complex logic in render (use effects/hooks)
