import { TowerType, TowerLevel, TowerData } from '../types';
import GameScene from '../scenes/GameScene';

interface TowerStats {
  damage: number;
  attackSpeed: number;
  range: number;
  cost: number;
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
    },
    [TowerLevel.ADVANCED]: {
      damage: 0,
      attackSpeed: 0,
      range: 1.2,
      cost: 85,
    },
    [TowerLevel.ELITE]: {
      damage: 0,
      attackSpeed: 0,
      range: 1.44,
      cost: 120,
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
      default:
        return 'No Ability';
    }
  }
}
