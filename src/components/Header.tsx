import React from 'react';

interface HeaderProps {
  score?: number;
  level?: number;
  lives?: number;
  isPaused?: boolean;
  onPause?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  score = 0,
  level = 1,
  lives = 3,
  isPaused = false,
  onPause,
}) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-game-primary">Defence Game</h1>
          <div className="flex items-center space-x-4 text-sm">
            <span className="bg-blue-600 px-3 py-1 rounded">
              Level: {level}
            </span>
            <span className="bg-green-600 px-3 py-1 rounded">
              Score: {score}
            </span>
            <span className="bg-red-600 px-3 py-1 rounded">Lives: {lives}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onPause}
            className={`${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} px-4 py-2 rounded transition-colors`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors">
            Settings
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
