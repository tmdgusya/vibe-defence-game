import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useShallow } from 'zustand/react/shallow';

const GameStats: React.FC = () => {
  const { score, gold, lives, enemiesKilled, towersPlaced } = useGameStore(
    useShallow((state) => ({
      score: state.score,
      gold: state.gold,
      lives: state.lives,
      enemiesKilled: state.enemiesKilled,
      towersPlaced: state.towersPlaced,
    }))
  );

  const StatCard: React.FC<{
    label: string;
    value: string | number;
    icon: string;
    colorClass: string;
  }> = ({ label, value, icon, colorClass }) => (
    <div
      className={`${colorClass} bg-gray-800 rounded-lg p-3 border border-gray-700`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
      <h3 className="text-white font-bold text-lg mb-4">Game Statistics</h3>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Score"
          value={score}
          icon="🎯"
          colorClass="border-blue-500"
        />

        <StatCard
          label="Gold"
          value={`${gold}g`}
          icon="💰"
          colorClass="border-yellow-500"
        />

        <StatCard
          label="Lives"
          value={lives}
          icon="❤️"
          colorClass="border-red-500"
        />

        <StatCard
          label="Enemies Killed"
          value={enemiesKilled}
          icon="💀"
          colorClass="border-purple-500"
        />

        <StatCard
          label="Towers Placed"
          value={towersPlaced}
          icon="🏰"
          colorClass="border-green-500"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Defenses</span>
          <span className="text-white font-bold">{towersPlaced}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Kills</span>
          <span className="text-white font-bold">{enemiesKilled}</span>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
