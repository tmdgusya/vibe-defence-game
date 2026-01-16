import React from 'react';
import { Button } from './design-system/Button';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

interface HeaderProps {
  score?: number;
  level?: number;
  lives?: number;
  isPaused?: boolean;
  onPause?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  level = 1,
  lives = 3,
  isPaused = false,
  onPause,
}) => {
  const gold = useGameStore((state) => state.gold);
  const score = useGameStore((state) => state.score);
  const resetGame = useGameStore((state) => state.resetGame);
  const setPaused = useGameStore((state) => state.setPaused);

  // Render heart icons for lives
  const renderHearts = () => {
    return Array.from({ length: 3 }, (_, i) => (
      <motion.span
        key={i}
        className="text-4xl inline-block"
        style={{
          filter:
            i < lives
              ? 'drop-shadow(0 4px 6px rgba(231, 76, 60, 0.4))'
              : 'grayscale(1) opacity(0.3)',
        }}
        animate={
          i < lives
            ? {
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      >
        {i < lives ? '❤️' : '🖤'}
      </motion.span>
    ));
  };

  return (
    <header className="w-full bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6] border-b-4 border-[#5FA830] shadow-lg">
      <div className="container mx-auto max-w-[1800px] px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: Game Title */}
          <div className="flex items-center gap-3">
            <motion.h1
              className="font-heading text-3xl text-[#2D1B00] drop-shadow-[2px_2px_0_rgba(255,255,255,0.8)]"
              animate={{
                textShadow: [
                  '2px 2px 0 rgba(255,255,255,0.8)',
                  '3px 3px 0 rgba(255,215,0,0.3)',
                  '2px 2px 0 rgba(255,255,255,0.8)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              🌻 Defence Garden
            </motion.h1>
          </div>

          {/* CENTER: Resources */}
          <div className="flex items-center gap-4">
            {/* Gold Counter */}
            <motion.div
              className="flex items-center gap-2 bg-gradient-to-br from-[#FFD93D] to-[#FFC107] border-4 border-[#F57F17] rounded-full px-6 py-2 shadow-lg"
              whileHover={{ scale: 1.05, rotate: -2 }}
              style={{
                boxShadow: '0 6px 0 #B9770E, 0 8px 15px rgba(0,0,0,0.3)',
              }}
            >
              <motion.span
                className="text-4xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                💰
              </motion.span>
              <span className="font-mono font-black text-3xl text-[#654321] drop-shadow-[2px_2px_2px_rgba(255,255,255,0.5)]">
                {gold}
              </span>
            </motion.div>

            {/* Score Counter */}
            <motion.div
              className="flex items-center gap-2 bg-gradient-to-br from-[#EC7063] to-[#E74C3C] border-4 border-[#A93226] rounded-full px-6 py-2 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 2 }}
              style={{
                boxShadow: '0 6px 0 #A93226, 0 8px 15px rgba(0,0,0,0.3)',
              }}
            >
              <span className="text-4xl">🎯</span>
              <span className="font-mono font-black text-3xl text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]">
                {score}
              </span>
            </motion.div>

            {/* Wave/Level */}
            <motion.div
              className="flex items-center gap-2 bg-gradient-to-br from-[#5DADE2] to-[#3498DB] border-4 border-[#1F618D] rounded-full px-6 py-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              style={{
                boxShadow: '0 6px 0 #1F618D, 0 8px 15px rgba(0,0,0,0.3)',
              }}
            >
              <span className="text-4xl">🌊</span>
              <span className="font-mono font-black text-3xl text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]">
                {level}
              </span>
            </motion.div>
          </div>

          {/* RIGHT: Lives & Controls */}
          <div className="flex items-center gap-4">
            {/* Lives Display */}
            <motion.div
              className="flex items-center gap-1 bg-white/90 border-4 border-[#C0392B] rounded-2xl px-4 py-2 shadow-lg"
              style={{
                boxShadow: '0 6px 0 #C0392B, 0 8px 15px rgba(0,0,0,0.3)',
              }}
            >
              {renderHearts()}
            </motion.div>

            {/* Pause Button */}
            {onPause && (
              <Button
                onClick={onPause}
                variant={isPaused ? 'success' : 'warning'}
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </Button>
            )}

            {/* Restart Button */}
            <Button
              onClick={() => {
                resetGame();
                setPaused(false);
              }}
              variant="danger"
            >
              🔄 Restart
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
