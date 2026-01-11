import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PhaserGame from './PhaserGame';
import { useGameStore } from '../store/gameStore';
import { useGameLoop, useKeyboardControls } from '../hooks';

const GameUI: React.FC = () => {
  const { score, level, lives, fps, isPaused, setPaused } = useGameStore();

  useGameLoop();
  useKeyboardControls();

  const togglePause = () => setPaused(!isPaused);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header
        score={score}
        level={level}
        lives={lives}
        onPause={togglePause}
        isPaused={isPaused}
      />

      <main className="flex-1 container mx-auto py-4">
        <div className="flex justify-center items-center h-full">
          <PhaserGame />
        </div>
      </main>

      <Footer gameVersion="0.1.0" fps={fps} />
    </div>
  );
};

export default GameUI;
