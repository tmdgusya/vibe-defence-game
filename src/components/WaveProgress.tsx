import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useShallow } from 'zustand/react/shallow';
import {
  emitEvent,
  subscribeToEvent,
  unsubscribeFromEvent,
} from '../utils/EventBus';

interface WaveProgressProps {
  totalWaves?: number;
}

const WaveProgress: React.FC<WaveProgressProps> = ({ totalWaves = 10 }) => {
  const { wave, level, isPaused } = useGameStore(
    useShallow((state) => ({
      wave: state.wave,
      level: state.level,
      isPaused: state.isPaused,
    }))
  );

  const [isWaveActive, setIsWaveActive] = useState(false);

  useEffect(() => {
    const handleWaveStarted = (): void => {
      setIsWaveActive(true);
    };

    const handleWaveCompleted = (): void => {
      setIsWaveActive(false);
    };

    subscribeToEvent('waveStarted', handleWaveStarted);
    subscribeToEvent('waveCompleted', handleWaveCompleted);

    return () => {
      unsubscribeFromEvent('waveStarted', handleWaveStarted);
      unsubscribeFromEvent('waveCompleted', handleWaveCompleted);
    };
  }, []);

  const handleStartWave = (): void => {
    if (!isWaveActive && !isPaused) {
      emitEvent('startWaveRequested', { wave });
    }
  };

  const progressPercentage = totalWaves > 0 ? (wave / totalWaves) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-lg">Wave Progress</h3>
        {isPaused && (
          <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded animate-pulse">
            PAUSED
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-white">
          <span className="text-2xl font-bold text-blue-400">{wave}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-lg text-gray-400">{totalWaves}</span>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-sm">Level</div>
          <div className="text-white font-bold">{level}</div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>Wave Start</span>
        <span>Level Complete</span>
      </div>

      <button
        onClick={handleStartWave}
        disabled={isWaveActive || isPaused}
        className={`
          w-full mt-4 py-3 rounded-lg font-bold text-lg transition-all duration-200
          ${
            isWaveActive || isPaused
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white cursor-pointer shadow-lg hover:shadow-green-500/25'
          }
        `}
      >
        {isWaveActive ? `Wave ${wave} in Progress...` : `Start Wave ${wave}`}
      </button>
      <div className="mt-1 text-center text-xs text-gray-500">
        or press SPACE
      </div>
    </div>
  );
};

export default WaveProgress;
