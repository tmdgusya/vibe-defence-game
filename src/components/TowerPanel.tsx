import React, { useState, useEffect } from 'react';
import { TowerData, TowerLevel, TowerType } from '../types';
import { useGameStore } from '../store/gameStore';
import {
  subscribeToEvent,
  unsubscribeFromEvent,
  type GameEvents,
} from '../utils/EventBus';

interface TowerPanelProps {
  className?: string;
}

interface TowerAction {
  type: 'upgrade' | 'sell' | 'merge';
  label: string;
  cost?: number;
  disabled?: boolean;
  action: () => void;
}

const TowerPanel: React.FC<TowerPanelProps> = ({ className = '' }) => {
  const { gold } = useGameStore();
  const [selectedTower, setSelectedTower] = useState<TowerData | null>(null);
  const [showMergeIndicator, setShowMergeIndicator] = useState(false);

  useEffect(() => {
    const handleTowerSelected = (data: GameEvents['towerSelected']) => {
      const tower: TowerData = {
        ...data.tower,
        type: data.tower.type as TowerType,
      };
      setSelectedTower(tower);
    };

    const handleTowerDeselected = () => {
      setSelectedTower(null);
    };

    const handleMergeAvailable = (data: GameEvents['mergeAvailable']) => {
      setShowMergeIndicator(data.available);
    };

    subscribeToEvent('towerSelected', handleTowerSelected);
    subscribeToEvent('towerDeselected', handleTowerDeselected);
    subscribeToEvent('mergeAvailable', handleMergeAvailable);

    return () => {
      unsubscribeFromEvent('towerSelected', handleTowerSelected);
      unsubscribeFromEvent('towerDeselected', handleTowerDeselected);
      unsubscribeFromEvent('mergeAvailable', handleMergeAvailable);
    };
  }, []);

  const getTowerName = (type: TowerType): string => {
    const names: Record<TowerType, string> = {
      [TowerType.PEASHOOTER]: 'Peashooter',
      [TowerType.SUNFLOWER]: 'Sunflower',
      [TowerType.WALLNUT]: 'Wallnut',
      [TowerType.MORTAR]: 'Mortar',
    };
    return names[type] || 'Unknown Tower';
  };

  const getTowerIcon = (type: TowerType): string => {
    const icons: Record<TowerType, string> = {
      [TowerType.PEASHOOTER]: '🌱',
      [TowerType.SUNFLOWER]: '🌻',
      [TowerType.WALLNUT]: '🥜',
      [TowerType.MORTAR]: '💣',
    };
    return icons[type] || '🏰';
  };

  const canUpgrade = (tower: TowerData): boolean => {
    return tower.level < TowerLevel.ELITE;
  };

  const getUpgradeCost = (tower: TowerData): number => {
    return Math.floor(tower.cost * 0.8 * tower.level);
  };

  const getSellValue = (tower: TowerData): number => {
    return Math.floor(tower.cost * 0.7);
  };

  const handleUpgrade = () => {
    if (!selectedTower || !canUpgrade(selectedTower)) return;

    const upgradeCost = getUpgradeCost(selectedTower);
    if (gold < upgradeCost) return;

    const event = new CustomEvent('towerUpgrade', {
      detail: { tower: selectedTower, cost: upgradeCost },
    });
    window.dispatchEvent(event);
  };

  const handleSell = () => {
    if (!selectedTower) return;

    const sellValue = getSellValue(selectedTower);

    const event = new CustomEvent('towerSell', {
      detail: { tower: selectedTower, refund: sellValue },
    });
    window.dispatchEvent(event);

    setSelectedTower(null);
  };

  const handleMerge = () => {
    if (!selectedTower) return;

    const event = new CustomEvent('towerMerge', {
      detail: { tower: selectedTower },
    });
    window.dispatchEvent(event);
  };

  const getLevelDisplay = (level: TowerLevel): string => {
    const levels = {
      [TowerLevel.BASIC]: 'Basic',
      [TowerLevel.ADVANCED]: 'Advanced',
      [TowerLevel.ELITE]: 'Elite',
    };
    return levels[level];
  };

  const getLevelColor = (level: TowerLevel): string => {
    const colors = {
      [TowerLevel.BASIC]: 'text-gray-400',
      [TowerLevel.ADVANCED]: 'text-blue-400',
      [TowerLevel.ELITE]: 'text-purple-400',
    };
    return colors[level];
  };

  const actions: TowerAction[] = [];

  if (selectedTower) {
    if (canUpgrade(selectedTower)) {
      actions.push({
        type: 'upgrade',
        label: `Upgrade to ${getLevelDisplay((selectedTower.level + 1) as TowerLevel)}`,
        cost: getUpgradeCost(selectedTower),
        disabled: gold < getUpgradeCost(selectedTower),
        action: handleUpgrade,
      });
    }

    actions.push({
      type: 'sell',
      label: `Sell for ${getSellValue(selectedTower)}g`,
      action: handleSell,
    });

    if (showMergeIndicator) {
      actions.push({
        type: 'merge',
        label: 'Merge with adjacent tower',
        action: handleMerge,
      });
    }
  }

  if (!selectedTower) {
    return (
      <div
        className={`bg-gray-800 p-4 rounded-lg w-48 flex flex-col ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Tower Info</h3>
          <span className="text-yellow-400 font-bold">{gold}g</span>
        </div>
        <div className="text-gray-400 text-sm text-center py-8">
          Click on a tower to see details
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-800 p-4 rounded-lg w-48 flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">Tower Info</h3>
        <span className="text-yellow-400 font-bold">{gold}g</span>
      </div>

      <div className="bg-gray-700 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{getTowerIcon(selectedTower.type)}</span>
          <div>
            <div className="text-white font-medium">
              {getTowerName(selectedTower.type)}
            </div>
            <div className={`text-sm ${getLevelColor(selectedTower.level)}`}>
              {getLevelDisplay(selectedTower.level)}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <div>Damage: {selectedTower.damage}</div>
          <div>Speed: {selectedTower.attackSpeed}/s</div>
          <div>Range: {selectedTower.range}</div>
        </div>
      </div>

      {showMergeIndicator && (
        <div className="bg-green-600 text-white p-2 rounded mb-2 text-sm text-center">
          Merge available!
        </div>
      )}

      <div className="flex flex-col space-y-2">
        {actions.map((action) => (
          <button
            key={action.type}
            onClick={action.action}
            disabled={action.disabled}
            className={`
              p-2 rounded transition-all text-sm font-medium
              ${action.type === 'upgrade' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
              ${action.type === 'sell' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
              ${action.type === 'merge' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {action.label}
            {action.cost && (
              <span className="ml-2 text-yellow-300">({action.cost}g)</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 text-gray-400 text-xs">
        {canUpgrade(selectedTower)
          ? 'Upgrade to improve stats'
          : 'Maximum level reached'}
      </div>
    </div>
  );
};

export default TowerPanel;
