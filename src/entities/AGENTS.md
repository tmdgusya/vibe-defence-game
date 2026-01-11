# PHASER GAME ENTITIES

**Overview:** Phaser game objects using Container as base class with physics and interactions.

## STRUCTURE

```
src/entities/
├── Tower.ts                  # Tower entity with sprite, range indicator
├── Enemy.ts                  # Enemy entity with health bar, path movement
├── Projectile.ts             # Projectile entity
├── EnemyTypes.ts             # Enemy type definitions
├── enemyConfigs.ts           # Enemy configuration data
├── enemySprites.ts           # Enemy sprite configurations
└── index.ts                  # Barrel export
```

## WHERE TO LOOK

| Task               | Location | Notes                                     |
| ------------------ | -------- | ----------------------------------------- |
| Tower rendering    | Tower.ts | Container with sprite, range graphics     |
| Tower interactions | Tower.ts | pointerover/out for range toggle          |
| Enemy movement     | Enemy.ts | TweenChain along path, flipX based on dir |
| Enemy health       | Enemy.ts | Graphics health bar, red/green fill       |
| Enemy events       | Enemy.ts | enemyKilled, enemyReachedEnd via EventBus |
| Physics bodies     | Enemy.ts | Arcade physics, scaled dimensions         |

## CONVENTIONS

- All entities extend Phaser.GameObjects.Container
- Sprite and child objects added to container
- Event emission via EventBus (not React)
- Tween animations for attacks, damage, death
- Health bars as Graphics objects
- Physics enabled for movement-based entities

## ANTI-PATTERNS

- NO direct React imports (use EventBus)
- NO hardcoded positions (calculate from gridX/gridY)
- NO missing cleanup in destroy() (destroy children first)
