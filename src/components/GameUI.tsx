import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Header from './Header';
import Footer from './Footer';
import PhaserGame from './PhaserGame';
import TowerSelectionPanel from './TowerSelectionPanel';
import PauseMenu from './PauseMenu';
import GameOverScreen from './GameOverScreen';
import WaveProgress from './WaveProgress';
import GameStats from './GameStats';
import { useGameStore } from '../store/gameStore';
import { useGameLoop, useKeyboardControls } from '../hooks';

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

const GameUI: React.FC = () => {
  // Use shallow comparison to prevent unnecessary re-renders
  const {
    score,
    level,
    lives,
    fps,
    isPaused,
    isGameOver,
    setPaused,
    resetGame,
  } = useGameStore(
    useShallow((state) => ({
      score: state.score,
      level: state.level,
      lives: state.lives,
      fps: state.fps,
      isPaused: state.isPaused,
      isGameOver: state.isGameOver,
      setPaused: state.setPaused,
      resetGame: state.resetGame,
    }))
  );
  const [gameState, setGameState] = useState<GameState>('playing');

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

      <main className="flex-1 container mx-auto max-w-[1800px] py-4 px-2 md:px-6">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-6">
          {/* LEFT SIDEBAR - Narrower */}
          <div className="flex flex-col gap-4 w-full lg:w-72 order-2 lg:order-1">
            <TowerSelectionPanel />
            <WaveProgress />
          </div>

          {/* CENTER - Game Board + Stats Below */}
          <div className="flex flex-col gap-4 flex-shrink-0 order-1 lg:order-2">
            <PhaserGame />
            <GameStats />
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

      {/* Always render main game when not in menu to prevent PhaserGame remounting */}
      {gameState !== 'menu' && renderMainGame()}

      {/* Overlay menus on top of the game */}
      {gameState === 'paused' && (
        <PauseMenu
          onResume={() => setPaused(false)}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      {gameState === 'gameOver' && (
        <GameOverScreen onRestart={handleRestart} onMainMenu={handleMainMenu} />
      )}
    </>
  );
};

export default GameUI;
