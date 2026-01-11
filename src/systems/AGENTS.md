# GAME LOGIC SYSTEMS

**Overview:** Pure logic systems for tower mechanics and game rules.

## STRUCTURE

```
src/systems/
├── TowerSystem.ts           # Tower stats, placement, merging logic
└── TowerSystem.test.ts      # Unit tests
```

## WHERE TO LOOK

| Task                 | Location                        | Notes                                    |
| -------------------- | ------------------------------- | ---------------------------------------- |
| Tower stats          | TowerSystem.getTowerStats()     | Returns from TOWER_CONFIG[type][level]   |
| Placement validation | TowerSystem.validatePlacement() | Returns {valid: boolean, reason: string} |
| Cost calculation     | TowerSystem.getTowerCost()      | Lookup from config                       |
| Merge logic          | TowerSystem.canMerge()          | Manhattan distance === 1                 |
| Economy              | TowerSystem.purchaseTower()     | Gold deduction                           |

## CONVENTIONS

- Configuration-driven (TOWER_CONFIG nested object)
- Validation returns structured results
- Scene injected via constructor
- Pure logic (NO Phaser dependencies)
- Factory methods for object creation

## ANTI-PATTERNS

- NO Phaser API calls in this directory
- NO magic numbers (use constants)
- NO side effects in validation methods
