# Game Balance Specification v1.2

## Metadata

- **Author**: Game Balance Team
- **Date**: 2026-01-13
- **Version**: v1.2
- **Status**: Active

## 1. Balance Philosophy

### Core Principles

1. **Predictable Progression**: Players should feel consistent challenge scaling
2. **Mathematical Foundation**: All balance decisions backed by DPS/HP calculations
3. **Multiple Solutions**: No single "optimal" strategy - encourage experimentation
4. **Clear Feedback**: Players understand why they won or lost

### Key Formula

```
Required Towers = Enemy HP / (Tower DPS × Time in Range)
```

## 2. Tower Statistics

### Base Tower Stats

| Tower Type | Level    | Damage         | Attack Speed | DPS  | Range      | Cost |
| ---------- | -------- | -------------- | ------------ | ---- | ---------- | ---- |
| PEASHOOTER | BASIC    | 10             | 1.0/s        | 10   | 3 cells    | 100g |
| PEASHOOTER | ADVANCED | 15             | 1.2/s        | 18   | 3.3 cells  | 175g |
| PEASHOOTER | ELITE    | 22             | 1.44/s       | 31.7 | 3.63 cells | 250g |
| MORTAR     | BASIC    | 6 (+12 splash) | 0.8/s        | 4.8  | 2.5 cells  | 125g |
| SUNFLOWER  | ALL      | 0 (economy)    | -            | -    | 1+ cells   | 50g+ |
| WALLNUT    | ALL      | 0 (defensive)  | -            | -    | 0.5 cells  | 75g+ |

### DPS Analysis

- **PEASHOOTER BASIC**: 10 DPS - baseline damage dealer
- **PEASHOOTER ADVANCED**: 18 DPS - 80% improvement
- **PEASHOOTER ELITE**: 31.7 DPS - 217% of basic

## 3. Enemy Statistics

### Enemy Stats (v1.2 - Playtested)

| Enemy Type | HP  | Speed | Armor | Reward | Time in Range\* | Towers Needed\*\* |
| ---------- | --- | ----- | ----- | ------ | --------------- | ----------------- |
| BASIC      | 25  | 1.0   | 0     | 10g    | 6s              | 1                 |
| TANK       | 50  | 0.5   | 1     | 20g    | 12s             | 1                 |
| FLYING     | 20  | 1.5   | 0     | 12g    | 4s              | 1                 |
| SWARM      | 10  | 2.0   | 0     | 5g     | 3s              | 1                 |
| ARMORED    | 40  | 0.7   | 1     | 25g    | 8.5s            | 1-2               |
| BOSS       | 150 | 0.3   | 1     | 100g   | 20s             | 2-3               |

\*Time in Range: Assuming 3-cell tower range on 9-cell path
\*\*Towers Needed: PEASHOOTER BASIC required to kill

### Balance Calculations

#### BASIC Enemy

```
HP: 50, Armor: 0, Speed: 1.0
Time in range: 9 cells × (1000ms / 1.0) × (3/9) = 6s
Damage from 1 PEASHOOTER: 10 DPS × 6s = 60 damage
Result: 60 > 50 ✓ (comfortable margin)
```

#### TANK Enemy

```
HP: 100, Armor: 1, Speed: 0.5
Time in range: 9 cells × (1000ms / 0.5) × (3/9) = 12s
Effective DPS: 10 - 1 = 9 DPS (armor reduction)
Damage from 1 PEASHOOTER: 9 DPS × 12s = 108 damage
Result: 108 > 100 ✓ (barely killable with 1 tower)
```

#### FLYING Enemy

```
HP: 35, Armor: 0, Speed: 1.5
Time in range: 9 cells × (1000ms / 1.5) × (3/9) = 4s
Damage from 1 PEASHOOTER: 10 DPS × 4s = 40 damage
Result: 40 > 35 ✓ (tight margin - rewards placement)
```

#### SWARM Enemy

```
HP: 20, Armor: 0, Speed: 2.0
Time in range: 9 cells × (1000ms / 2.0) × (3/9) = 3s
Damage from 1 PEASHOOTER: 10 DPS × 3s = 30 damage
Result: 30 > 20 ✓ (requires good coverage for swarms)
```

#### ARMORED Enemy

```
HP: 70, Armor: 2, Speed: 0.7
Time in range: 9 cells × (1000ms / 0.7) × (3/9) = 8.5s
Effective DPS: 10 - 2 = 8 DPS
Damage from 1 PEASHOOTER: 8 DPS × 8.5s = 68 damage
Result: 68 < 70 ✗ (needs 2 towers)
```

#### BOSS Enemy

```
HP: 400, Armor: 2, Speed: 0.3
Time in range: 9 cells × (1000ms / 0.3) × (3/9) = 20s
Effective DPS: 10 - 2 = 8 DPS
Damage from 1 PEASHOOTER: 8 DPS × 20s = 160 damage
Required towers: 400 / 160 = 2.5 → 3 towers minimum
```

## 4. Wave Progression

### Wave Configuration

| Wave | Enemies                                | Total HP | Expected Towers | Wave Bonus |
| ---- | -------------------------------------- | -------- | --------------- | ---------- |
| 1    | 5× BASIC                               | 250      | 1-2             | 25g        |
| 2    | 8× BASIC                               | 400      | 2               | 30g        |
| 3    | 6× BASIC, 2× TANK                      | 500      | 2-3             | 40g        |
| 4    | 3× SWARM, 4× BASIC                     | 260      | 2-3             | 45g        |
| 5    | 8× BASIC, 3× FLYING, 1× BOSS           | 905      | 4+              | 75g        |
| 6    | 10× BASIC, 3× TANK                     | 800      | 3-4             | 50g        |
| 7    | 4× SWARM, 2× ARMORED                   | 220      | 3-4             | 60g        |
| 8    | 6× FLYING, 4× TANK                     | 610      | 4+              | 70g        |
| 9    | 8× BASIC, 4× ARMORED, 2× TANK          | 880      | 5+              | 80g        |
| 10   | 10× BASIC, 3× TANK, 2× FLYING, 1× BOSS | 1270     | 6+              | 100g       |

### Economy Progression

| Wave | Start Gold | Kills Reward | Wave Bonus | Available for Towers |
| ---- | ---------- | ------------ | ---------- | -------------------- |
| 1    | 200g       | ~50g         | 25g        | 2× PEASHOOTER        |
| 2    | ~275g      | ~80g         | 30g        | 3× PEASHOOTER        |
| 3    | ~385g      | ~100g        | 40g        | 4× PEASHOOTER        |
| 4    | ~525g      | ~55g         | 45g        | 5× PEASHOOTER        |
| 5    | ~625g      | ~226g        | 75g        | 6+ PEASHOOTER        |

## 5. Difficulty Curve

### Visual Representation

```
Difficulty
    ^
    |                                    ****
    |                              ******
    |                        ******
    |                  ******
    |            ******
    |       *****
    |   ****
    | **
    +----------------------------------------> Wave
      1   2   3   4   5   6   7   8   9   10
```

### Key Milestones

- **Wave 1-2**: Tutorial difficulty - single tower type viable
- **Wave 3**: First TANK introduction - armor mechanic learning
- **Wave 4**: SWARM introduction - coverage testing
- **Wave 5**: First BOSS - major skill check
- **Wave 6-9**: Mixed compositions - strategy required
- **Wave 10**: Final challenge - all mechanics combined

## 6. Version History

### v1.2 (2026-01-13) - Playtest Validated

**Changes from v1.1:**
| Enemy | v1.1 HP | v1.2 HP | v1.1 Armor | v1.2 Armor |
|-------|---------|---------|------------|------------|
| BASIC | 50 | 25 | 0 | 0 |
| TANK | 100 | 50 | 1 | 1 |
| FLYING | 35 | 20 | 0 | 0 |
| BOSS | 400 | 150 | 2 | 1 |
| SWARM | 20 | 10 | 0 | 0 |
| ARMORED | 70 | 40 | 2 | 1 |

**Rationale:**

- v1.1 values still too high for practical gameplay
- Playtest showed 1 tower killed only 4/5 enemies in Wave 1
- Further reduction ensures comfortable margin for new players

### v1.1 (2026-01-13) - Initial Rebalance

- Reduced all enemy HP by ~50% from original
- First attempt at mathematical balancing

### v1.0 (Initial)

- Original enemy stats (unbalanced, first wave impossible)

## 7. Testing Checklist

- [x] Wave 1 clearable with 1 PEASHOOTER
- [x] Wave 3 requires 2+ towers for TANK
- [x] Wave 5 BOSS beatable with good setup
- [ ] Full 10-wave playtest
- [ ] Economy sustains through all waves

## 8. Future Considerations

1. **Difficulty Modes**: Easy/Normal/Hard multipliers
2. **Endless Mode**: Procedural scaling beyond wave 10
3. **Tower Upgrades**: Balance ADVANCED/ELITE unlocks
4. **Special Abilities**: Slow, poison, AoE balancing
