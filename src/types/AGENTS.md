# CENTRAL TYPE DEFINITIONS

**Overview:** Source of truth for all TypeScript types, enums, and constants.

## STRUCTURE

```
src/types/
└── index.ts               # All types, events, config constants
```

## WHERE TO LOOK

| Category     | Exports             | Notes                                              |
| ------------ | ------------------- | -------------------------------------------------- |
| Grid config  | GRID_CONFIG         | 5x9 grid, 80px cells, 720x400px                    |
| Game config  | GAME_CONFIG         | Width, height, FPS (60)                            |
| Tower types  | TowerType enum      | PEASHOOTER, SUNFLOWER, WALLNUT                     |
| Tower levels | TowerLevel enum     | BASIC=1, ADVANCED=2, ELITE=3                       |
| Enemy types  | EnemyType enum      | BASIC, TANK, FLYING, BOSS, SWARM, ARMORED          |
| Events       | GameEvents[K]       | All event payloads (sceneReady, towerPlaced, etc.) |
| Game state   | GameState interface | gold, wave, lives, score, isPaused                 |
| Tower data   | TowerData interface | type, level, gridX, gridY, stats                   |

## CONVENTIONS

- ALL game types defined here (no duplication)
- Event payloads as indexed interface (GameEvents[K])
- Constants as const for type safety
- Enums for fixed sets (tower types, levels)
- Configuration as objects (GRID_CONFIG, GAME_CONFIG)

## ANTI-PATTERNS

- NO type definitions elsewhere (this is the authority)
- NO string literals for types (use enums)
- NO magic numbers (use constants)
