# ISSUE: Mortar Tower Missing from UI Selection Panel

## Metadata

- **Reporter**: Senior Developer (Claude)
- **Date Reported**: 2026-01-13
- **Last Updated**: 2026-01-13
- **Status**: Open
- **Priority**: High
- **Type**: Feature (Missing Implementation)
- **Assignee**: [Junior Developer]
- **Labels**: feature, ui, tower-system, incomplete
- **Related Issue ID**: N/A

## 1. Issue Summary

### One-Sentence Summary

The Mortar tower is fully implemented in the backend (TowerSystem, types) but is not available in the UI Tower Selection Panel.

### Impact Assessment

- **Users Affected**: 100% of players
- **Severity**: Major - Key tower type unavailable
- **Business Impact**: Reduced gameplay variety; splash damage strategy unavailable

## 2. Issue Classification

### Type Details

**Feature (Incomplete)**: Mortar tower exists in code but UI integration was never completed.

### Evidence of Backend Implementation

```typescript
// src/types/index.ts:38
export enum TowerType {
  PEASHOOTER = 'peashooter',
  SUNFLOWER = 'sunflower',
  WALLNUT = 'wallnut',
  MORTAR = 'mortar',  // <-- Defined
}

// src/systems/TowerSystem.ts:98-123 - Full configuration exists
[TowerType.MORTAR]: {
  [TowerLevel.BASIC]: {
    damage: 6,
    attackSpeed: 0.8,
    range: 2.5,
    cost: 175,
    splashDamage: 12,
    splashRadius: 1.5,
  },
  // ... ADVANCED and ELITE configs exist
}
```

## 3. Environment & Context

### Affected Components

- [ ] **Game Engine**: Phaser (Mortar works if placed programmatically)
- [x] **UI Framework**: React - Missing from TowerSelectionPanel
- [x] **System**: Tower selection flow

### Current UI State

```typescript
// src/components/TowerSelectionPanel.tsx:20-42
const TOWER_OPTIONS: TowerOption[] = [
  { type: TowerType.SUNFLOWER, name: 'Sunflower', cost: 50, ... },
  { type: TowerType.WALLNUT, name: 'Wallnut', cost: 75, ... },
  { type: TowerType.PEASHOOTER, name: 'Peashooter', cost: 100, ... },
  // MORTAR IS MISSING!
];
```

### Expected vs Actual

| Tower      | Backend | UI Panel | Status      |
| ---------- | ------- | -------- | ----------- |
| Sunflower  | ✅      | ✅       | Complete    |
| Wallnut    | ✅      | ✅       | Complete    |
| Peashooter | ✅      | ✅       | Complete    |
| **Mortar** | ✅      | ❌       | **MISSING** |

## 4. Technical Details

### Files to Modify

1. `src/components/TowerSelectionPanel.tsx` - Add Mortar to TOWER_OPTIONS

### Mortar Tower Stats (from TowerSystem)

| Level    | Damage | Attack Speed | Range | Cost | Splash Damage | Splash Radius |
| -------- | ------ | ------------ | ----- | ---- | ------------- | ------------- |
| Basic    | 6      | 0.8          | 2.5   | 175g | 12            | 1.5 cells     |
| Advanced | 9      | 1.0          | 2.8   | 300g | 18            | 1.8 cells     |
| Elite    | 14     | 1.2          | 3.2   | 500g | 28            | 2.2 cells     |

### Asset Requirements

- Check if `tower-mortar` sprite exists in `public/assets/`
- If not, placeholder will be used (colored rectangle)

## 5. Solution Strategy

### Recommended Solution

Add Mortar entry to `TOWER_OPTIONS` array in `TowerSelectionPanel.tsx`.

### Implementation Approach

```typescript
// src/components/TowerSelectionPanel.tsx
const TOWER_OPTIONS: TowerOption[] = [
  {
    type: TowerType.SUNFLOWER,
    name: 'Sunflower',
    cost: 50,
    description: 'Generates resources',
    icon: '🌻',
  },
  {
    type: TowerType.WALLNUT,
    name: 'Wallnut',
    cost: 75,
    description: 'Blocks enemies',
    icon: '🥜',
  },
  {
    type: TowerType.PEASHOOTER,
    name: 'Peashooter',
    cost: 100,
    description: 'Shoots projectiles',
    icon: '🌱',
  },
  // ADD THIS:
  {
    type: TowerType.MORTAR,
    name: 'Mortar',
    cost: 175,
    description: 'Area damage with splash effect',
    icon: '💣', // or '🎯' or suitable emoji
  },
];
```

## 6. Implementation Plan

### Development Tasks

- [ ] **Task 1**: Add Mortar to TOWER_OPTIONS array in TowerSelectionPanel.tsx
- [ ] **Task 2**: Choose appropriate emoji icon (💣 recommended)
- [ ] **Task 3**: Verify tower sprite exists or placeholder is used
- [ ] **Task 4**: Test Mortar can be placed from UI
- [ ] **Task 5**: Test Mortar attacks enemies with splash damage

### Testing Requirements

- [ ] **Manual Testing**:
  - Mortar appears in Tower Selection Panel
  - Mortar shows correct cost (175g)
  - Can drag Mortar to grid when gold >= 175
  - Mortar attacks enemies with splash effect
  - Splash damage hits multiple enemies in radius
- [ ] **Visual Testing**: Mortar sprite renders correctly

### Dependencies

- Depends on ISSUE-BUG-002 (gold reward) being fixed to earn enough gold for Mortar

## 7. Verification & Acceptance

### Definition of Done

- [ ] Mortar tower visible in Tower Selection Panel
- [ ] Mortar can be selected and placed
- [ ] Mortar costs 175g as configured
- [ ] Mortar attacks enemies with splash damage
- [ ] Splash damage visual effect appears
- [ ] Multiple enemies damaged in splash radius

### Test Scenarios

1. Start game with 200g → Can afford Mortar (175g)
2. Place Mortar on grid → Tower appears, gold decreases
3. Start wave → Mortar fires at enemies
4. Mortar hits → Splash effect visible, nearby enemies damaged

## 8. Related Documents

- [TowerSelectionPanel.tsx](../../src/components/TowerSelectionPanel.tsx)
- [TowerSystem.ts](../../src/systems/TowerSystem.ts)
- [CollisionSystem.ts](../../src/systems/CollisionSystem.ts) - splash damage logic

## 9. Revision History

| Version | Date       | Author     | Changes        |
| ------- | ---------- | ---------- | -------------- |
| v1.0    | 2026-01-13 | Senior Dev | Issue reported |
