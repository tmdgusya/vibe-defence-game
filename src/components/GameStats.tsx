import React from 'react';
import { Panel } from './design-system/Panel';
import { StatCard } from './design-system/StatCard';
import { Text } from './design-system/Text';
import { useGameStore } from '../store/gameStore';

const GameStats: React.FC = () => {
  const score = useGameStore((state) => state.score);
  const gold = useGameStore((state) => state.gold);
  const lives = useGameStore((state) => state.lives);
  const enemiesKilled = useGameStore((state) => state.enemiesKilled);
  const towersPlaced = useGameStore((state) => state.towersPlaced);

  return (
    <Panel>
      <Text as="h3" variant="heading" className="mb-4">
        Game Statistics
      </Text>
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Score" value={score} icon="🎯" variant="danger" />
        <StatCard label="Gold" value={gold} icon="💰" variant="gold" />
        <StatCard label="Lives" value={lives} icon="❤️" variant="danger" />
        <StatCard
          label="Enemies Killed"
          value={enemiesKilled}
          icon="💀"
          variant="info"
        />
        <StatCard
          label="Towers Placed"
          value={towersPlaced}
          icon="🏰"
          variant="success"
        />
      </div>
    </Panel>
  );
};

export default GameStats;
