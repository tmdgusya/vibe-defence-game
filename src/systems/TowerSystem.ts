import { TowerType, TowerLevel, TowerData } from '../types';
import GameScene from '../scenes/GameScene';

interface TowerStats {
  damage: number;
  attackSpeed: number;
  range: number;
  cost: number;
  splashDamage?: number;
  splashRadius?: number;
  pierceCount?: number;
  resourceGeneration?: number; // Gold generated per interval
  resourceInterval?: number; // Interval in milliseconds
}

interface TowerConfiguration {
  [TowerType.PEASHOOTER]: {
    [TowerLevel.BASIC]: TowerStats;
    [TowerLevel.ADVANCED]: TowerStats;
    [TowerLevel.ELITE]: TowerStats;
  };
  [TowerType.SUNFLOWER]: {
    [TowerLevel.BASIC]: TowerStats;
    [TowerLevel.ADVANCED]: TowerStats;
    [TowerLevel.ELITE]: TowerStats;
  };
  [TowerType.WALLNUT]: {
    [TowerLevel.BASIC]: TowerStats;
    [TowerLevel.ADVANCED]: TowerStats;
    [TowerLevel.ELITE]: TowerStats;
  };
  [TowerType.MORTAR]: {
    [TowerLevel.BASIC]: TowerStats;
    [TowerLevel.ADVANCED]: TowerStats;
    [TowerLevel.ELITE]: TowerStats;
  };
}

const TOWER_CONFIG: TowerConfiguration = {
  [TowerType.PEASHOOTER]: {
    [TowerLevel.BASIC]: {
      damage: 10,
      attackSpeed: 1.0,
      range: 3,
      cost: 100,
    },
    [TowerLevel.ADVANCED]: {
      damage: 15,
      attackSpeed: 1.2,
      range: 3.3,
      cost: 175,
    },
    [TowerLevel.ELITE]: {
      damage: 22,
      attackSpeed: 1.44,
      range: 3.63,
      cost: 250,
    },
  },
  [TowerType.SUNFLOWER]: {
    [TowerLevel.BASIC]: {
      damage: 0,
      attackSpeed: 0,
      range: 1,
      cost: 50,
      resourceGeneration: 10, // 10 gold (2배 증가!)
      resourceInterval: 7000, // every 7 seconds (더 빠르게!)
    },
    [TowerLevel.ADVANCED]: {
      damage: 0,
      attackSpeed: 0,
      range: 1.2,
      cost: 85,
      resourceGeneration: 16, // 16 gold (2배 증가!)
      resourceInterval: 5500, // every 5.5 seconds (더 빠르게!)
    },
    [TowerLevel.ELITE]: {
      damage: 0,
      attackSpeed: 0,
      range: 1.44,
      cost: 120,
      resourceGeneration: 25, // 25 gold (2배 이상 증가!)
      resourceInterval: 4000, // every 4 seconds (더 빠르게!)
    },
  },
  [TowerType.WALLNUT]: {
    [TowerLevel.BASIC]: {
      damage: 0,
      attackSpeed: 0,
      range: 0.5,
      cost: 75,
    },
    [TowerLevel.ADVANCED]: {
      damage: 0,
      attackSpeed: 0,
      range: 0.5,
      cost: 130,
    },
    [TowerLevel.ELITE]: {
      damage: 0,
      attackSpeed: 0,
      range: 0.5,
      cost: 185,
    },
  },
  [TowerType.MORTAR]: {
    [TowerLevel.BASIC]: {
      damage: 9, // 50% 증가 (6 → 9)
      attackSpeed: 0.8,
      range: 2.5,
      cost: 175,
      splashDamage: 18, // 50% 증가 (12 → 18)
      splashRadius: 2.2, // 47% 증가 (1.5 → 2.2) - 더 넓은 범위!
    },
    [TowerLevel.ADVANCED]: {
      damage: 14, // 56% 증가 (9 → 14)
      attackSpeed: 1.0,
      range: 2.8,
      cost: 300,
      splashDamage: 27, // 50% 증가 (18 → 27)
      splashRadius: 2.7, // 50% 증가 (1.8 → 2.7)
    },
    [TowerLevel.ELITE]: {
      damage: 21, // 50% 증가 (14 → 21)
      attackSpeed: 1.2,
      range: 3.2,
      cost: 500,
      splashDamage: 42, // 50% 증가 (28 → 42)
      splashRadius: 3.3, // 50% 증가 (2.2 → 3.3) - 매우 넓음!
    },
  },
};

export class TowerSystem {
  private scene: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  public getTowerStats(type: TowerType, level: TowerLevel): TowerStats {
    const config = TOWER_CONFIG[type];
    if (!config) {
      throw new Error(`Unknown tower type: ${type}`);
    }
    const levelStats = config[level];
    if (!levelStats) {
      throw new Error(`Unknown tower level: ${level}`);
    }
    return levelStats;
  }

  public getTowerCost(type: TowerType, level: TowerLevel): number {
    return this.getTowerStats(type, level).cost;
  }

  public createTowerData(
    type: TowerType,
    level: TowerLevel,
    gridX: number,
    gridY: number
  ): TowerData {
    const stats = this.getTowerStats(type, level);

    return {
      type,
      level,
      gridX,
      gridY,
      ...stats,
    };
  }

  public validatePlacement(
    gridX: number,
    gridY: number
  ): { valid: boolean; reason?: string } {
    if (gridX < 0 || gridX >= 9 || gridY < 0 || gridY >= 5) {
      return { valid: false, reason: 'Position out of bounds' };
    }

    if (!this.scene.isCellAvailable(gridX, gridY)) {
      return { valid: false, reason: 'Cell already occupied' };
    }

    return { valid: true };
  }

  public getAffordableTowers(gold: number): TowerType[] {
    const affordableTypes: TowerType[] = [];

    const allTypes = [
      TowerType.SUNFLOWER,
      TowerType.WALLNUT,
      TowerType.PEASHOOTER,
      TowerType.MORTAR,
    ];

    for (const type of allTypes) {
      const basicCost = this.getTowerCost(type, TowerLevel.BASIC);
      if (gold >= basicCost) {
        affordableTypes.push(type);
      }
    }
    return affordableTypes;
  }

  public getUpgradeCost(type: TowerType, currentLevel: TowerLevel): number {
    if (currentLevel === TowerLevel.ELITE) {
      return 0;
    }

    const nextLevel = (currentLevel + 1) as TowerLevel;
    const currentStats = this.getTowerStats(type, currentLevel);
    const nextStats = this.getTowerStats(type, nextLevel);

    return nextStats.cost - currentStats.cost;
  }

  public canAffordUpgrade(
    type: TowerType,
    currentLevel: TowerLevel,
    gold: number
  ): boolean {
    const upgradeCost = this.getUpgradeCost(type, currentLevel);
    return gold >= upgradeCost;
  }

  public getUpgradedStats(
    type: TowerType,
    currentLevel: TowerLevel
  ): TowerStats | null {
    if (currentLevel === TowerLevel.ELITE) {
      return null;
    }

    const nextLevel = (currentLevel + 1) as TowerLevel;
    return this.getTowerStats(type, nextLevel);
  }

  public getMergeResult(
    tower1: TowerData,
    tower2: TowerData
  ): TowerData | null {
    if (tower1.type !== tower2.type || tower1.level !== tower2.level) {
      return null;
    }

    if (tower1.level === TowerLevel.ELITE) {
      return null;
    }

    const nextLevel = (tower1.level + 1) as TowerLevel;
    const gridX = Math.floor((tower1.gridX + tower2.gridX) / 2);
    const gridY = Math.floor((tower1.gridY + tower2.gridY) / 2);

    return this.createTowerData(tower1.type, nextLevel, gridX, gridY);
  }

  public canMerge(tower1: TowerData, tower2: TowerData): boolean {
    const gridDistance =
      Math.abs(tower1.gridX - tower2.gridX) +
      Math.abs(tower1.gridY - tower2.gridY);

    return (
      gridDistance === 1 &&
      tower1.type === tower2.type &&
      tower1.level === tower2.level &&
      tower1.level !== TowerLevel.ELITE
    );
  }

  public getAllTowerConfigurations(): TowerConfiguration {
    return TOWER_CONFIG;
  }

  public getTowerDescription(type: TowerType): string {
    switch (type) {
      case TowerType.PEASHOOTER:
        return 'Basic offensive tower that shoots projectiles at enemies';
      case TowerType.SUNFLOWER:
        return 'Economy tower that generates resources over time';
      case TowerType.WALLNUT:
        return 'Defensive barrier that blocks enemy progress';
      case TowerType.MORTAR:
        return 'Area-of-effect tower that damages all enemies in splash radius';
      default:
        return 'Unknown tower type';
    }
  }

  public getTowerAbility(type: TowerType): string {
    switch (type) {
      case TowerType.PEASHOOTER:
        return 'Ranged Attack';
      case TowerType.SUNFLOWER:
        return 'Resource Generation';
      case TowerType.WALLNUT:
        return 'Block Path';
      case TowerType.MORTAR:
        return 'Splash Damage';
      default:
        return 'No Ability';
    }
  }
}
