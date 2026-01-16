import { TowerSystem } from './TowerSystem';
import { TowerType, TowerLevel } from '../types';

const towerSystem = new TowerSystem({} as any);

console.log('TOWER_CONFIG exists?', !!towerSystem.getAllTowerConfigurations());
console.log(
  'Sunflower basic stats:',
  towerSystem.getTowerStats(TowerType.SUNFLOWER, TowerLevel.BASIC)
);
console.log(
  'Sunflower basic cost:',
  towerSystem.getTowerCost(TowerType.SUNFLOWER, TowerLevel.BASIC)
);
console.log('Affordable 25:', towerSystem.getAffordableTowers(25));
