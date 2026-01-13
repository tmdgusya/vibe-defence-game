# ISSUE: Sunflower Resource Generation Not Implemented

## Metadata

- **Reporter**: Senior Developer (Claude)
- **Date Reported**: 2026-01-13
- **Last Updated**: 2026-01-13
- **Status**: Open
- **Priority**: Medium
- **Type**: Feature (Missing Implementation)
- **Assignee**: [Junior Developer]
- **Labels**: feature, economy-system, tower-ability, incomplete
- **Related Issue ID**: N/A

## 1. Issue Summary

### One-Sentence Summary

Sunflower tower description says "Generates resources" but no resource generation mechanic is implemented.

### Impact Assessment

- **Users Affected**: 100% of players
- **Severity**: Minor - Tower still placeable but doesn't provide stated benefit
- **Business Impact**: Misleading player expectation; economy strategy limited

## 2. Issue Classification

### Type Details

**Feature (Missing)**: Sunflower has damage=0 and attackSpeed=0 (intentionally non-combat), but the resource generation it should provide is not implemented.

### Current State

```typescript
// src/systems/TowerSystem.ts:58-76
[TowerType.SUNFLOWER]: {
  [TowerLevel.BASIC]: {
    damage: 0,        // Correct - not a combat tower
    attackSpeed: 0,   // Correct - doesn't attack
    range: 1,
    cost: 50,
    // NO resource generation properties!
  },
  // ...
}
```

```typescript
// src/components/TowerSelectionPanel.tsx:24
description: 'Generates resources',  // <-- Lie!
```

## 3. Environment & Context

### Design Reference (from development-plan.md)

> **Sunflower**: Economy tower that generates resources over time

### Proposed Mechanic Options

1. **Passive Gold Generation**: +X gold every Y seconds
2. **Sun Production**: Generates "sun" that player clicks to collect (PvZ style)
3. **Gold Multiplier**: Increases gold rewards from kills within range
4. **End-of-Wave Bonus**: Extra gold at wave completion

### Recommended Approach

**Option 1: Passive Gold Generation** - Simplest to implement, consistent with tower defense conventions.

| Level    | Gold per Interval | Interval | Gold/Minute |
| -------- | ----------------- | -------- | ----------- |
| Basic    | 5g                | 10s      | 30g         |
| Advanced | 8g                | 8s       | 60g         |
| Elite    | 12g               | 6s       | 120g        |

## 4. Technical Details

### Files to Modify

1. `src/systems/TowerSystem.ts` - Add resource generation stats
2. `src/entities/Tower.ts` - Add resource generation behavior
3. Create new system: `src/systems/ResourceSystem.ts` OR integrate into existing system

### Proposed Implementation

```typescript
// src/systems/TowerSystem.ts - Add new stats
[TowerType.SUNFLOWER]: {
  [TowerLevel.BASIC]: {
    damage: 0,
    attackSpeed: 0,
    range: 1,
    cost: 50,
    resourceGeneration: 5,     // gold per tick
    resourceInterval: 10000,   // ms between generation
  },
  // ...
}
```

```typescript
// In ProjectileSystem.ts or new ResourceSystem.ts
private processSunflowerGeneration(time: number): void {
  const towers = this.scene.getPlacedTowers();

  for (const tower of towers) {
    const towerData = tower.getData();
    if (towerData.type !== TowerType.SUNFLOWER) continue;

    const lastGeneration = this.sunflowerTimers.get(tower) || 0;
    const interval = towerData.resourceInterval || 10000;

    if (time - lastGeneration >= interval) {
      const gold = towerData.resourceGeneration || 5;

      // Emit gold gained event
      emitEvent('goldChanged', {
        gold: currentGold + gold,
        change: gold,
      });

      this.sunflowerTimers.set(tower, time);

      // Visual feedback
      this.createGoldPopup(tower.x, tower.y, gold);
    }
  }
}
```

## 5. Solution Strategy

### Implementation Phases

**Phase 1: Basic Passive Generation**

- Add resource stats to TowerSystem config
- Add generation logic to ProjectileSystem (simplest integration)
- Emit goldChanged events

**Phase 2: Visual Feedback**

- Gold popup animation (+5g floating text)
- Sunflower glow/pulse when generating

**Phase 3: Balance Tuning**

- Adjust generation rates based on playtesting
- Ensure economic balance (can't just spam sunflowers to win)

## 6. Implementation Plan

### Development Tasks

- [ ] **Task 1**: Add `resourceGeneration` and `resourceInterval` to TowerStats interface
- [ ] **Task 2**: Configure Sunflower resource stats for all 3 levels
- [ ] **Task 3**: Add generation logic (recommend in ProjectileSystem.update)
- [ ] **Task 4**: Track last generation time per Sunflower
- [ ] **Task 5**: Emit goldChanged event on generation
- [ ] **Task 6**: Add visual feedback (gold popup)
- [ ] **Task 7**: Balance test: ensure not overpowered

### Testing Requirements

- [ ] **Manual Testing**:
  - Place Sunflower → Gold increases every 10 seconds
  - Multiple Sunflowers → Each generates independently
  - Higher level Sunflower → Generates more gold faster
- [ ] **Balance Testing**: Starting gold (200) + Sunflower cost (50) should balance well

### Dependencies

- Requires ISSUE-BUG-002 (gold reward) to be fixed first for proper economy testing

## 7. Verification & Acceptance

### Definition of Done

- [ ] Sunflower generates gold passively
- [ ] Generation rate matches configuration
- [ ] Visual feedback when gold generated
- [ ] Works at all 3 tower levels
- [ ] Economy remains balanced

### Test Scenarios

1. Place Basic Sunflower → +5g every 10s
2. Upgrade to Advanced → +8g every 8s
3. Place 3 Sunflowers → All generate independently
4. Remove Sunflower → Generation stops

## 8. Related Documents

- [TowerSystem.ts](../../src/systems/TowerSystem.ts)
- [ProjectileSystem.ts](../../src/systems/ProjectileSystem.ts)
- [development-plan.md](../development-plan.md) - Economy design

## 9. Revision History

| Version | Date       | Author     | Changes        |
| ------- | ---------- | ---------- | -------------- |
| v1.0    | 2026-01-13 | Senior Dev | Issue reported |
