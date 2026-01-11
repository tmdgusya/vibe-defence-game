import { useRef } from 'react';
import PhaserGame, { PhaserGameRef } from './components/PhaserGame';

function App(): JSX.Element {
  const phaserRef = useRef<PhaserGameRef>(null);

  return (
    <div className="game-container">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-game-primary">Defence Game</h1>
      </header>

      <main>
        <PhaserGame ref={phaserRef} />
      </main>

      <footer className="mt-4 text-sm text-gray-500">
        <p>Tower Defense with Merging Mechanics</p>
      </footer>
    </div>
  );
}

export default App;
