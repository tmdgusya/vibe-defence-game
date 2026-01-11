import React, { useEffect, useState } from 'react';
import { TowerType } from '../types';
import { useGameStore } from '../store/gameStore';
import {
  subscribeToEvent,
  unsubscribeFromEvent,
  EventData,
} from '../utils/EventBus';

interface TowerOption {
  type: TowerType;
  name: string;
  cost: number;
  description: string;
  icon: string;
}

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
];

const TowerSelectionPanel: React.FC = () => {
  const { gold, selectedTowerType, selectTowerType } = useGameStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handlePlacementFailed = (data: EventData['placementFailed']) => {
      setErrorMessage(data.message);
      setTimeout(() => setErrorMessage(null), 2000);
    };

    subscribeToEvent('placementFailed', handlePlacementFailed);

    return () => {
      unsubscribeFromEvent('placementFailed', handlePlacementFailed);
    };
  }, []);

  const handleSelectTower = (type: TowerType) => {
    if (selectedTowerType === type) {
      selectTowerType(null);
    } else {
      selectTowerType(type);
    }
  };

  const canAfford = (cost: number) => gold >= cost;

  return (
    <div className="bg-gray-800 p-4 rounded-lg w-48 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">Towers</h3>
        <span className="text-yellow-400 font-bold">{gold}g</span>
      </div>

      {errorMessage && (
        <div className="bg-red-600 text-white p-2 rounded mb-2 text-sm text-center">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col space-y-2">
        {TOWER_OPTIONS.map((tower) => {
          const affordable = canAfford(tower.cost);
          const isSelected = selectedTowerType === tower.type;

          return (
            <button
              key={tower.type}
              onClick={() => handleSelectTower(tower.type)}
              disabled={!affordable}
              className={`
                p-3 rounded-lg transition-all flex items-center gap-3
                ${isSelected ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700'}
                ${!affordable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}
              `}
              title={tower.description}
            >
              <span className="text-2xl">{tower.icon}</span>
              <div className="flex flex-col items-start">
                <span className="text-white text-sm">{tower.name}</span>
                <span
                  className={`text-sm ${affordable ? 'text-yellow-400' : 'text-red-400'}`}
                >
                  {tower.cost}g
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-gray-400 text-xs">
        {selectedTowerType
          ? 'Click on grid to place'
          : 'Select a tower to place'}
      </div>
    </div>
  );
};

export default TowerSelectionPanel;
