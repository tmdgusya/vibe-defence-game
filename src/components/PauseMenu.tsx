import React from 'react';
import { useGameStore } from '../store/gameStore';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onMainMenu,
}) => {
  const { score, level, lives } = useGameStore();

  return (
    <div className="fixed inset-0 bg-ui-bg-overlay flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-game-hard">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Game Paused
        </h2>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Current Progress</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-yellow-400 font-bold">{score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div>
              <div className="text-blue-400 font-bold">{level}</div>
              <div className="text-gray-400 text-sm">Level</div>
            </div>
            <div>
              <div className="text-red-400 font-bold">{lives}</div>
              <div className="text-gray-400 text-sm">Lives</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full bg-ui-interactive-primary hover:bg-ui-interactive-secondary text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Resume Game
          </button>

          <button
            onClick={onRestart}
            className="w-full bg-ui-interactive-warning hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Restart Level
          </button>

          <button
            onClick={onMainMenu}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Main Menu
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">Press ESC to resume</p>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
