# PHASER GAME SCENES

**Overview:** Phaser game scenes handling rendering, physics, and input.

## STRUCTURE

```
src/scenes/
├── BootScene.ts            # Asset loading, texture generation
└── GameScene.ts            # Main game scene, grid system
```

## WHERE TO LOOK

| Task               | Location                          | Notes                                |
| ------------------ | --------------------------------- | ------------------------------------ |
| Loading screen     | BootScene.ts                      | Loading bar, simulateLoading()       |
| Texture generation | BootScene.generateTowerTextures() | Programmatic asset creation          |
| Grid system        | GameScene.createGrid()            | gridCells[row][col] 2D array         |
| Cell positioning   | GameScene.ts                      | x = col _ 80 + 40, y = row _ 80 + 40 |
| Input handling     | GameScene.setupInput()            | Cell click, hover events             |
| Event listeners    | GameScene.setupEventListeners()   | EventBus subscriptions               |

## CONVENTIONS

- Grid cells: Phaser images with setData() metadata
- Cell metadata: 'occupied', 'gridX', 'gridY', 'tower'
- Hover effects: tint with alpha changes (1.0 = valid, 0.8 = invalid)
- Tween animations: scale yoyo for attacks, tint flash for placement
- Scene lifecycle: preload → create → update

## ANTI-PATTERNS

- NO direct React imports (use EventBus)
- NO hardcoded positions (use GRID_CONFIG)
- NO inline event handlers (extract to methods)
