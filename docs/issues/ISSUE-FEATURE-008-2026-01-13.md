# ISSUE: Score System Not Implemented

## Metadata

- **Reporter**: Senior Developer (Claude)
- **Date Reported**: 2026-01-13
- **Last Updated**: 2026-01-13
- **Status**: Open
- **Priority**: Low
- **Type**: Feature (Missing Implementation)
- **Assignee**: [Junior Developer]
- **Labels**: feature, score-system, statistics, low-priority
- **Related Issue ID**: N/A

## 1. Issue Summary

### One-Sentence Summary

The Score counter always shows 0 because no scoring logic is implemented.

### Impact Assessment

- **Users Affected**: 100% of players
- **Severity**: Minor - Game playable without score
- **Business Impact**: Reduces engagement; no achievement tracking

## 2. Issue Classification

### Type Details

**Feature (Missing)**: Score UI exists and state is tracked, but no events add to the score.

### Current State

- `score` state exists in `gameStore.ts`
- `setScore()` action exists
- Score displayed in Header and GameStats
- **Nothing calls `setScore()`** except game over

## 3. Environment & Context

### Score Display Locations

1. Header: `Score: 0`
2. GameStats panel: Score stat card

### Proposed Scoring System

| Action               | Base Points | Notes              |
| -------------------- | ----------- | ------------------ |
| Kill Basic Enemy     | 10          | Most common        |
| Kill Tank Enemy      | 25          | High HP            |
| Kill Flying Enemy    | 20          | Fast               |
| Kill Boss Enemy      | 100         | Rare               |
| Kill Swarm Enemy     | 15          | Group              |
| Kill Armored Enemy   | 30          | Armored            |
| Complete Wave        | wave × 50   | Bonus              |
| No Lives Lost (Wave) | 100         | Perfect wave bonus |

## 4. Technical Details

### Files to Modify

1. `src/components/PhaserGame.tsx` - Add score logic to event handlers
2. `src/store/gameStore.ts` - Already has `setScore`, may need `addScore`

### Proposed Implementation

```typescript
// Add to gameStore.ts
addScore: (points: number) => set((state) => ({
  score: state.score + points,
})),
```

```typescript
// In PhaserGame.tsx handleEnemyKilled
const handleEnemyKilled = (data: GameEvents['enemyKilled']): void => {
  const state = useGameStore.getState();

  state.incrementEnemiesKilled();

  // Add gold (ISSUE-BUG-002 fix)
  const newGold = state.gold + data.reward;
  state.setGold(newGold);

  // ADD SCORE based on enemy type
  const scoreMap: Record<string, number> = {
    basic: 10,
    tank: 25,
    flying: 20,
    boss: 100,
    swarm: 15,
    armored: 30,
  };
  const points = scoreMap[data.enemy.type] || 10;
  state.addScore(points);
};
```

```typescript
// In handleWaveCompleted
const handleWaveCompleted = (data: GameEvents['waveCompleted']): void => {
  const state = useGameStore.getState();

  // Add wave completion score
  const wavePoints = data.wave * 50;
  state.addScore(wavePoints);

  // Bonus for perfect wave (no lives lost during wave)
  // Would need to track lives at wave start vs end
};
```

## 5. Solution Strategy

### Implementation Phases

**Phase 1: Basic Scoring**

- Add points for enemy kills
- Add points for wave completion

**Phase 2: Bonus Scoring**

- Perfect wave bonus
- Speed bonus (faster completion)
- Efficiency bonus (fewer towers used)

**Phase 3: Leaderboard Integration**

- High score persistence (already partially implemented in statistics)
- Display high score on game over

## 6. Implementation Plan

### Development Tasks

- [ ] **Task 1**: Add `addScore` action to gameStore
- [ ] **Task 2**: Add score points when enemies killed
- [ ] **Task 3**: Add score points on wave completion
- [ ] **Task 4**: Update high score on game over
- [ ] **Task 5**: Display score in Game Over screen
- [ ] **Task 6**: (Optional) Add score popup animations

### Testing Requirements

- [ ] **Manual Testing**:
  - Kill enemy → Score increases
  - Complete wave → Score increases by wave × 50
  - Game over → High score updated if applicable
- [ ] **Balance Testing**: Score feels rewarding

### Dependencies

- Should be done after ISSUE-BUG-001 and ISSUE-BUG-002 (core game loop)

## 7. Verification & Acceptance

### Definition of Done

- [ ] Score increases when enemies killed
- [ ] Score increases on wave completion
- [ ] High score tracked across sessions
- [ ] Score visible in UI (Header + GameStats)

### Test Scenarios

1. Kill 5 Basic enemies → Score = 50
2. Complete Wave 1 → Score += 50
3. Kill Boss → Score += 100
4. New game → Score resets to 0

## 8. Related Documents

- [gameStore.ts](../../src/store/gameStore.ts)
- [PhaserGame.tsx](../../src/components/PhaserGame.tsx)
- [GameStats.tsx](../../src/components/GameStats.tsx)

## 9. Revision History

| Version | Date       | Author     | Changes        |
| ------- | ---------- | ---------- | -------------- |
| v1.0    | 2026-01-13 | Senior Dev | Issue reported |
