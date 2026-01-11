# DEFENCE GAME - PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-11 23:14:00
**Commit:** 231f982 Music design (vibe-kanban 39229350)
**Branch:** main

## OVERVIEW

Tower defense game with Phaser.js for rendering, React for UI, and TypeScript. Features grid-based tower placement, tower merging, wave progression, and economy system.

## STRUCTURE

```
./
├── src/
│   ├── components/    # React UI components (PhaserGame, GameUI, TowerPanel)
│   ├── config/       # Phaser configuration (PhaserConfig.ts)
│   ├── entities/     # Phaser game objects (Tower)
│   ├── hooks/        # React hooks (useGameLoop, useKeyboardControls)
│   ├── scenes/       # Phaser scenes (BootScene, GameScene)
│   ├── store/        # Zustand state management (gameStore.ts)
│   ├── systems/      # Game logic (TowerSystem)
│   ├── test/         # Test setup and utilities
│   ├── types/        # TypeScript definitions (GameEvents, enums, interfaces)
│   └── utils/       # Shared utilities (EventBus)
├── design-system/    # Design tokens, guidelines, tests (mini-monorepo)
├── docs/            # PRD, specs, guides, strategy
├── public/assets/   # Tower/enemy sprites, sounds, UI elements
└── dist/            # Production build output
```

## WHERE TO LOOK

| Task                | Location                   | Notes                                |
| ------------------- | -------------------------- | ------------------------------------ |
| Game entry point    | src/main.tsx, src/App.tsx  | React bootstrap                      |
| Game rendering      | src/scenes/GameScene.ts    | Main Phaser scene with 5x9 grid      |
| Tower placement     | src/systems/TowerSystem.ts | Validation, stats, merging           |
| React-Phaser bridge | src/utils/EventBus.ts      | Type-safe event communication        |
| UI state            | src/store/gameStore.ts     | Zustand store (gold, lives, score)   |
| Type definitions    | src/types/index.ts         | ALL enums, interfaces, events        |
| Tower logic         | src/entities/Tower.ts      | Phaser Container with interactions   |
| UI components       | src/components/            | PhaserGame, GameUI, TowerPanel, etc. |

## CODE MAP

(See subdirectory AGENTS.md files for details)

## CONVENTIONS

- **Event-driven**: React ↔ Phaser via EventBus (emitEvent, subscribeToEvent)
- **Type-safe events**: All events defined in GameEvents[K] interface
- **Centralized types**: src/types/index.ts is the source of truth for types
- **Configuration-driven**: TOWER_CONFIG in TowerSystem defines all stats
- **Pure logic systems**: TowerSystem contains NO Phaser dependencies
- **Export patterns**: index.ts files re-export for clean imports
- **Grid system**: 5x9 cells, 80px each (720x400px total)
- **Tower levels**: BASIC (1) → ADVANCED (2) → ELITE (3)
- **Test setup**: Vitest with jsdom, Phaser/Howler mocked

## ANTI-PATTERNS (THIS PROJECT)

- NO direct React imports in Phaser scenes (use EventBus)
- NO Phaser dependencies in TowerSystem (pure logic)
- NO console/debugger in production (ESLint rule)
- NO magic numbers (use GRID_CONFIG, TOWER_CONFIG constants)
- NEVER call Phaser methods from React (emit events instead)

## UNIQUE STYLES

- **EventBus Debug Mode**: enableDebugMode(true) logs all events
- **Tween animations**: Used for placement feedback, attacks (scale yoyo)
- **Validation results**: TowerSystem returns {valid: boolean, reason: string}
- **Texture naming**: tower-{type}-{level} (e.g., tower-peashooter-2)
- **Store actions return boolean**: spendGold(), selectTowerType() indicate success

## COMMANDS

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build (dist/)
npm run test             # Run Vitest unit tests
npm run test:ui          # Vitest interactive UI
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run type-check       # TypeScript type checking
```

## NOTES

- LSP unavailable (typescript-language-server not installed)
- No GitHub Actions or CI/CD configured
- design-system/ has its own package.json (mini-monorepo structure)
- Assets generated programmatically in BootScene.generateTowerTextures()
- Tower merging: Manhattan distance 1, same type/level, not elite
