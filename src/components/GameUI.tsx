import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import PhaserGame from './PhaserGame';
import TowerSelectionPanel from './TowerSelectionPanel';
import TowerPanel from './TowerPanel';
import PauseMenu from './PauseMenu';
import GameOverScreen from './GameOverScreen';
import { useGameStore } from '../store/gameStore';
import { useGameLoop, useKeyboardControls } from '../hooks';

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

const GameUI: React.FC = () => {
  const {
    score,
    level,
    lives,
    fps,
    isPaused,
    isGameOver,
    setPaused,
    resetGame,
  } = useGameStore();
  const [gameState, setGameState] = useState<GameState>('playing');
  const [showTowerPanel, setShowTowerPanel] = useState(false);

  useGameLoop();
  useKeyboardControls();

  React.useEffect(() => {
    if (isGameOver && gameState !== 'gameOver') {
      setGameState('gameOver');
    } else if (isPaused && gameState === 'playing') {
      setGameState('paused');
    } else if (!isPaused && gameState === 'paused') {
      setGameState('playing');
    } else if (!isGameOver && gameState === 'gameOver') {
      setGameState('playing');
    }
  }, [isPaused, isGameOver, gameState]);

  const togglePause = () => {
    if (gameState === 'playing') {
      setPaused(true);
    } else if (gameState === 'paused') {
      setPaused(false);
    }
  };

  const handleRestart = () => {
    resetGame();
    setGameState('playing');
    setPaused(false);
  };

  const handleMainMenu = () => {
    setGameState('menu');
    resetGame();
  };

  const renderMainGame = () => (
    <div className="min-h-screen bg-game-sky flex flex-col">
      <Header
        score={score}
        level={level}
        lives={lives}
        onPause={togglePause}
        isPaused={isPaused}
      />

      <main className="flex-1 container mx-auto py-4">
        <div className="flex justify-center items-start h-full gap-4">
          <div className="flex gap-4">
            <TowerSelectionPanel />
            {showTowerPanel && <TowerPanel />}
          </div>
          <PhaserGame />
          <div className="w-8">
            <button
              onClick={() => setShowTowerPanel(!showTowerPanel)}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-l-lg transition-colors"
              title={showTowerPanel ? 'Hide Tower Panel' : 'Show Tower Panel'}
            >
              {showTowerPanel ? '◀' : '▶'}
            </button>
          </div>
        </div>
      </main>

      <Footer gameVersion="0.1.0" fps={fps} />
    </div>
  );

  const renderMenu = () => (
    <div className="min-h-screen bg-game-sky flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-game-hard">
        <h1 className="text-white text-4xl font-bold text-center mb-2">
          Defence Game
        </h1>
        <p className="text-gray-400 text-center mb-8">Tower Defense Strategy</p>

        <div className="space-y-4">
          <button
            onClick={() => setGameState('playing')}
            className="w-full bg-ui-interactive-success hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Start Game
          </button>

          <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Settings
          </button>

          <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Instructions
          </button>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Build towers to defend against enemies</p>
          <p>Merge towers to create stronger defenses</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {gameState === 'menu' && renderMenu()}
      {gameState === 'playing' && renderMainGame()}

      {gameState === 'paused' && (
        <>
          {renderMainGame()}
          <PauseMenu
            onResume={() => setPaused(false)}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        </>
      )}

      {gameState === 'gameOver' && (
        <>
          {renderMainGame()}
          <GameOverScreen
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        </>
      )}
    </>
  );
};

export default GameUI;
