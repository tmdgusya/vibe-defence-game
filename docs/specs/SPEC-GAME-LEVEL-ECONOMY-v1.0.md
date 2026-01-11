# Technical Specification: Game Level and Economy Engine

## Metadata
- **Author**: Lead Game Designer
- **Date**: 2025-01-11
- **Version**: v1.0
- **Status**: Draft

## 1. Overview

### Purpose
Define the technical architecture and implementation details for the level progression, enemy spawning, and economy systems in the tower defense game.

### Scope
- Level management and progression
- Enemy spawning and wave control
- Economy and reward systems
- Player progression tracking
- Save/load functionality

## 2. Architecture

### System Design
```
GameManager
├── LevelManager
│   ├── LevelData
│   ├── WaveController
│   └── ProgressionTracker
├── EnemySystem
│   ├── EnemySpawner
│   ├── EnemyPool
│   └── EnemyTypes
├── EconomyManager
│   ├── CurrencyController
│   ├── RewardCalculator
│   └── ShopSystem
└── SaveSystem
    ├── GameStateSerializer
    └── ProgressPersistence
```

### Data Flow
1. **Level Start** → LevelManager loads level data
2. **Wave Spawn** → EnemySystem creates enemies based on wave configuration
3. **Enemy Defeat** → EconomyManager calculates and awards money
4. **Wave Complete** → LevelManager tracks progress and prepares next wave
5. **Level Complete** → SaveSystem stores progress and unlocks next level

### API Design

#### Core Interfaces
```typescript
interface ILevelManager {
  loadLevel(levelId: number): Promise<LevelData>
  startWave(waveId: number): void
  completeLevel(): void
  getCurrentProgress(): LevelProgress
}

interface IEnemySpawner {
  spawnEnemy(enemyType: EnemyType, position: Vector2): Enemy
  getWaveConfiguration(waveId: number): WaveData
  calculateSpawnTiming(waveData: WaveData): SpawnSchedule
}

interface IEconomyManager {
  addMoney(amount: number): void
  spendMoney(amount: number): boolean
  calculateReward(enemy: Enemy): number
  canAfford(cost: number): boolean
}
```

## 3. Implementation Details

### Core Components

#### 3.1 LevelManager
```typescript
class LevelManager {
  private currentLevel: number = 1
  private currentWave: number = 0
  private levelData: Map<number, LevelData>
  private waveController: WaveController

  async loadLevel(levelId: number): Promise<void> {
    const level = await this.loadLevelData(levelId)
    this.currentLevel = levelId
    this.currentWave = 0
    this.waveController.initialize(level.waves)
  }

  startNextWave(): void {
    if (this.canStartNextWave()) {
      this.currentWave++
      this.waveController.startWave(this.currentWave)
    }
  }

  private canStartNextWave(): boolean {
    return this.currentWave < this.getMaxWaves() && 
           !this.waveController.isWaveActive()
  }
}
```

#### 3.2 EnemySpawner
```typescript
class EnemySpawner {
  private enemyPool: ObjectPool<Enemy>
  private spawnQueue: SpawnRequest[]
  private activeEnemies: Enemy[]

  spawnWave(waveData: WaveData): void {
    const schedule = this.calculateSpawnSchedule(waveData)
    schedule.forEach(spawn => {
      this.scheduleSpawn(spawn)
    })
  }

  private calculateSpawnSchedule(waveData: WaveData): SpawnSchedule {
    return waveData.enemies.map((enemyConfig, index) => ({
      enemyType: enemyConfig.type,
      spawnTime: index * waveData.spawnInterval,
      position: this.getSpawnPosition(enemyConfig.lane),
      difficulty: this.calculateDifficultyMultiplier(enemyConfig.type)
    }))
  }
}
```

#### 3.3 EconomyManager
```typescript
class EconomyManager {
  private playerMoney: number = 200
  private totalEarned: number = 0
  private totalSpent: number = 0

  calculateReward(enemy: Enemy): number {
    const baseReward = this.getBaseReward(enemy.type)
    const difficultyMultiplier = this.getDifficultyMultiplier()
    const comboBonus = this.getComboBonus()
    
    return Math.floor(baseReward * difficultyMultiplier * comboBonus)
  }

  addMoney(amount: number): void {
    this.playerMoney += amount
    this.totalEarned += amount
    this.updateUI()
  }

  spendMoney(amount: number): boolean {
    if (this.canAfford(amount)) {
      this.playerMoney -= amount
      this.totalSpent += amount
      this.updateUI()
      return true
    }
    return false
  }
}
```

### Algorithms

#### Difficulty Scaling Algorithm
```typescript
function calculateDifficultyMultiplier(level: number): number {
  const baseDifficulty = 1.0
  const scalingRate = 0.15
  const difficultyCap = 5.0
  
  return Math.min(baseDifficulty + (level * scalingRate), difficultyCap)
}

function calculateEnemyStats(baseStats: EnemyStats, level: number): EnemyStats {
  const multiplier = calculateDifficultyMultiplier(level)
  
  return {
    health: Math.floor(baseStats.health * multiplier),
    speed: baseStats.speed * (1 + level * 0.05),
    damage: Math.floor(baseStats.damage * multiplier * 0.8),
    reward: Math.floor(baseStats.reward * (1 + level * 0.1))
  }
}
```

#### Wave Composition Algorithm
```typescript
function generateWaveData(level: number, waveNumber: number): WaveData {
  const enemyTypes = getAvailableEnemyTypes(level)
  const baseEnemyCount = 5 + (level * 2) + (waveNumber * 3)
  const complexity = Math.min(1.0 + (level * 0.1) + (waveNumber * 0.05), 3.0)
  
  const enemies: EnemyConfig[] = []
  let remainingPoints = baseEnemyCount * 10
  
  // Distribute enemy types based on complexity
  enemyTypes.forEach(type => {
    const typeWeight = getTypeWeight(type, complexity)
    const count = Math.floor(remainingPoints * typeWeight / type.cost)
    
    if (count > 0) {
      enemies.push({
        type: type,
        count: count,
        lane: Math.floor(Math.random() * 3),
        delay: Math.random() * 2000
      })
      remainingPoints -= count * type.cost
    }
  })
  
  return {
    enemies: enemies,
    spawnInterval: Math.max(1000 - (level * 50), 300),
    preparationTime: 10000,
    completionBonus: 50 + (level * 25) + (waveNumber * 10)
  }
}
```

### Data Structures

#### Level Data Structure
```typescript
interface LevelData {
  id: number
  name: string
  description: string
  difficulty: number
  waves: WaveData[]
  completionReward: number
  unlockRequirement?: number
  backgroundImage?: string
  terrainLayout: TerrainData
}

interface WaveData {
  id: number
  enemies: EnemyConfig[]
  spawnInterval: number
  preparationTime: number
  completionBonus: number
  bossWave?: boolean
}

interface EnemyConfig {
  type: EnemyType
  count: number
  lane: number
  delay: number
  modifiedStats?: Partial<EnemyStats>
}
```

#### Enemy Types Structure
```typescript
enum EnemyType {
  BASIC = 'basic',
  TANK = 'tank',
  FLYING = 'flying',
  BOSS = 'boss',
  SWARM = 'swarm',
  ARMORED = 'armored'
}

interface EnemyStats {
  health: number
  speed: number
  damage: number
  reward: number
  armor: number
  specialAbilities: string[]
}
```

#### Economy Structure
```typescript
interface EconomyData {
  currentMoney: number
  totalEarned: number
  totalSpent: number
  purchases: PurchaseRecord[]
  achievements: Achievement[]
  multipliers: {
    difficulty: number
    combo: number
    bonus: number
  }
}

interface TowerCost {
  baseCost: number
  upgradeMultiplier: number
  sellRefundRatio: number
}
```

## 4. Integration Points

### Internal APIs
- **GameEngine**: Main game loop coordination
- **UIManager**: Economy and level display updates
- **AudioManager**: Sound effects for rewards and level events
- **AnalyticsEngine**: Track player behavior and economy balance

### External Dependencies
- **Storage API**: Save/load game state
- **Achievement System**: Unlock rewards and bonuses
- **Monetization API**: Premium currency integration
- **Social API**: Leaderboards and friend progression

## 5. Testing Strategy

### Unit Tests
```typescript
describe('LevelManager', () => {
  test('should load level data correctly', async () => {
    const levelManager = new LevelManager()
    await levelManager.loadLevel(1)
    expect(levelManager.getCurrentLevel()).toBe(1)
  })

  test('should progress to next wave when current is complete', () => {
    const levelManager = new LevelManager()
    levelManager.loadLevelSync(1)
    levelManager.startNextWave()
    expect(levelManager.getCurrentWave()).toBe(1)
  })
})
```

### Integration Tests
```typescript
describe('Economy Integration', () => {
  test('should award money for enemy defeat', async () => {
    const economy = new EconomyManager()
    const enemy = new Enemy(EnemyType.BASIC, 1)
    
    const initialMoney = economy.getCurrentMoney()
    economy.addMoney(economy.calculateReward(enemy))
    
    expect(economy.getCurrentMoney()).toBeGreaterThan(initialMoney)
  })
})
```

### Performance Tests
```typescript
describe('Performance Tests', () => {
  test('should handle 100 enemies without frame drop', async () => {
    const spawner = new EnemySpawner()
    const startTime = performance.now()
    
    for (let i = 0; i < 100; i++) {
      spawner.spawnEnemy(EnemyType.BASIC, {x: 0, y: 0})
    }
    
    const endTime = performance.now()
    expect(endTime - startTime).toBeLessThan(16) // 60 FPS = 16ms per frame
  })
})
```

## 6. Deployment Considerations

### Environment Requirements
- **Memory**: Minimum 4GB RAM for smooth performance
- **Storage**: 500MB for save files and level data
- **Network**: Optional, for cloud saves and leaderboards

### Rollback Strategy
- Version-controlled save file format
- Automatic backup creation before major updates
- Migration scripts for save file compatibility

### Configuration Management
```typescript
interface GameConfig {
  economy: {
    startingMoney: number
    difficultyScaling: number
    rewardMultipliers: number[]
  }
  levels: {
    maxLevel: number
    difficultyCurve: number[]
    unlockRequirements: number[]
  }
  performance: {
    maxEnemiesPerWave: number
    spawnIntervalRange: [number, number]
    entityPoolSize: number
  }
}
```

## 7. Optimization Strategies

### Memory Management
- Object pooling for enemies and projectiles
- Lazy loading of level assets
- Garbage collection optimization

### Performance Optimization
- Spatial partitioning for collision detection
- Batch rendering for similar enemies
- Async loading of level data

### Network Optimization
- Delta compression for save files
- Progress caching for offline play
- Efficient analytics batching

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.0 | 2025-01-11 | Lead Game Designer | Initial technical specification |