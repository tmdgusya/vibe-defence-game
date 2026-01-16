import React, { useState, useEffect } from 'react';
import { TowerType } from '../types';
import { TowerButton } from './design-system/TowerButton';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '../store/gameStore';
import { Panel, Text } from './design-system';
import {
  subscribeToEvent,
  unsubscribeFromEvent,
  emitEvent,
  type GameEvents,
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
  {
    type: TowerType.MORTAR,
    name: 'Mortar',
    cost: 175,
    description: 'Area damage with splash effect',
    icon: '💣',
  },
];

export const TowerSelectionPanel: React.FC = () => {
  const { gold, selectedTowerType, selectTowerType } = useGameStore(
    useShallow((state) => ({
      gold: state.gold,
      selectedTowerType: state.selectedTowerType,
      selectTowerType: state.selectTowerType,
    }))
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handlePlacementFailed = (data: GameEvents['placementFailed']) => {
      setErrorMessage(data.message);
      window.setTimeout(() => setErrorMessage(null), 2000);
    };

    subscribeToEvent('placementFailed', handlePlacementFailed);

    return () => {
      unsubscribeFromEvent('placementFailed', handlePlacementFailed);
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, type: TowerType) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ towerType: type })
    );

    emitEvent('towerDragStart', { towerType: type });
  };

  const handleDragEnd = () => {
    emitEvent('towerDragEnd', { success: false });
  };

  const canAfford = (cost: number) => gold >= cost;

  const handleSelectTower = (type: TowerType) => {
    if (selectedTowerType === type) {
      selectTowerType(null);
    } else {
      selectTowerType(type);
    }
  };

  return (
    <Panel>
      <Text as="h3" variant="heading" className="mb-2">
        Towers
      </Text>

      {errorMessage && (
        <div className="bg-feedback-error text-white p-2 rounded mb-2 text-sm text-center">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-3 overflow-y-auto">
        {TOWER_OPTIONS.map((tower) => (
          <TowerButton
            key={tower.type}
            towerType={tower.type}
            name={tower.name}
            cost={tower.cost}
            description={tower.description}
            affordable={canAfford(tower.cost)}
            selected={selectedTowerType === tower.type}
            onSelect={() => handleSelectTower(tower.type)}
            onDragStart={(e) => handleDragStart(e, tower.type)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </Panel>
  );
};

export default TowerSelectionPanel;
