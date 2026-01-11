import React from 'react';
import { useGameStore } from '../store/gameStore';

interface GameOverScreenProps {
  onRestart: () => void;
  onMainMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  onRestart,
  onMainMenu,
}) => {
  const { score, level, gold } = useGameStore();

  const isVictory = level > 10;

  return (
    <div className="fixed inset-0 bg-ui-bg-overlay flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-game-hard">
        <div className="text-center mb-6">
          <h2
            className={`text-3xl font-bold mb-2 ${isVictory ? 'text-feedback-success' : 'text-feedback-error'}`}
          >
            {isVictory ? 'Victory!' : 'Game Over'}
          </h2>
          <p className="text-gray-400 text-lg">
            {isVictory ? 'All enemies defeated!' : 'Your defenses fell...'}
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 text-center">
            Final Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-600 rounded-lg p-3">
              <div className="text-yellow-400 font-bold text-2xl">{score}</div>
              <div className="text-gray-400 text-sm">Final Score</div>
            </div>
            <div className="bg-gray-600 rounded-lg p-3">
              <div className="text-blue-400 font-bold text-2xl">{level}</div>
              <div className="text-gray-400 text-sm">Level Reached</div>
            </div>
            <div className="bg-gray-600 rounded-lg p-3 col-span-2">
              <div className="text-ui-gold-primary font-bold text-2xl">
                {gold}g
              </div>
              <div className="text-gray-400 text-sm">Gold Collected</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-ui-interactive-primary hover:bg-ui-interactive-secondary text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Play Again
          </button>

          <button
            onClick={onMainMenu}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Main Menu
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="text-gray-400 text-sm mb-2">Share your score!</div>
          <div className="flex justify-center gap-2">
            <span className="bg-gray-700 px-3 py-1 rounded text-gray-300 text-sm">
              Level {level} • {score} points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
