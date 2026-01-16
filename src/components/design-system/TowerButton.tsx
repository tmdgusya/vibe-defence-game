import React from 'react';
import { motion } from 'framer-motion';
import { TowerType } from '../../types';
import { getTowerColors } from '../../design-system/tokens';

interface TowerButtonProps {
  towerType: TowerType;
  name: string;
  cost: number;
  description?: string;
  affordable: boolean;
  selected: boolean;
  onSelect: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export const TowerButton: React.FC<TowerButtonProps> = ({
  towerType,
  name,
  cost,
  description,
  affordable,
  selected,
  onSelect,
  onDragStart,
  onDragEnd,
}) => {
  const towerColors = getTowerColors(towerType);
  const borderColor = towerColors.border;

  // Get tower image path
  const getTowerImagePath = (type: TowerType): string => {
    return `/assets/towers/tower-${type}-1.png`;
  };

  const handleClick = (): void => {
    if (affordable) {
      onSelect();
    }
  };

  const handleDragStart = (e: React.DragEvent): void => {
    if (affordable && onDragStart) {
      onDragStart(e);
    }
  };

  const handleDragEnd = (): void => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      draggable={affordable}
      disabled={!affordable}
      className={`
        p-3 rounded-lg transition-all duration-fast flex items-center gap-3
        border-l-4
        ${selected ? 'ring-2 ring-text-accent' : ''}
        ${!affordable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-panel-hover cursor-pointer'}
        ${selected ? 'bg-panel-active' : ''}
      `}
      style={{
        borderLeftColor: borderColor,
      }}
      whileHover={affordable ? { scale: 1.02 } : undefined}
      whileTap={affordable ? { scale: 0.98 } : undefined}
      title={description}
      {...({
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
      } as any)}
    >
      <span className="text-2xl font-mono">{cost}g</span>
      <div className="flex items-center gap-2">
        <img
          src={getTowerImagePath(towerType)}
          alt={name}
          className="w-10 h-10 object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
        <span className="text-sm font-medium text-white">{name}</span>
      </div>
    </motion.button>
  );
};

export default TowerButton;
