# Developer Setup Guide

## Metadata
- **Author**: Development Team
- **Date Created**: 2026-01-11
- **Last Updated**: 2026-01-11
- **Status**: Approved
- **Level**: Beginner

## 1. Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 18.0.0+ | https://nodejs.org/ |
| npm | 9.0.0+ | Comes with Node.js |
| Git | Latest | https://git-scm.com/ |

### Recommended Tools

| Tool | Purpose |
|------|---------|
| VS Code | Recommended IDE |
| Chrome DevTools | Debugging |
| React DevTools | React debugging extension |

### VS Code Extensions

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense

## 2. Installation

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd defence-game
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- React & React DOM
- Phaser.js game engine
- TypeScript compiler
- Vite build tool
- Tailwind CSS
- Zustand state management
- Howler.js audio library
- ESLint & Prettier

### Step 3: Verify Installation

```bash
# Check TypeScript compilation
npm run type-check

# Start development server
npm run dev
```

If successful, the game opens at `http://localhost:3000`.

## 3. Development Workflow

### Starting Development

```bash
# Start dev server with hot module replacement
npm run dev
```

The server:
- Runs on port 3000
- Auto-opens browser
- Hot-reloads on file changes
- Shows errors in console

### Code Quality

```bash
# Run linter
npm run lint

# Fix lint issues automatically
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

### Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 4. Project Architecture

### Directory Structure

```
src/
├── main.tsx              # Entry point - mounts React app
├── App.tsx               # Root component with Phaser container
├── index.css             # Global styles + Tailwind directives
│
├── config/               # Configuration files
│   └── PhaserConfig.ts       # Phaser game settings
│
├── scenes/               # Phaser scenes
│   ├── BootScene.ts          # Loading screen, asset preloading
│   └── GameScene.ts          # Main game, grid, gameplay
│
├── components/           # React components
│   └── PhaserGame.tsx        # Phaser-React bridge component
│
├── utils/                # Utility functions
│   └── EventBus.ts           # React-Phaser communication
│
├── types/                # TypeScript definitions
│   └── index.ts              # All game types and interfaces
│
├── entities/             # Game entities (future)
├── systems/              # Game systems (future)
└── hooks/                # React hooks (future)
```

### Key Concepts

#### 1. Phaser-React Bridge

The game uses a split architecture:

```
React Layer (UI)           EventBus              Phaser Layer (Game)
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ TowerPanel.tsx  │    │                 │    │ GameScene.ts    │
│ GameUI.tsx      │◄──►│  EventBus.ts    │◄──►│ BootScene.ts    │
│ WaveInfo.tsx    │    │                 │    │ Entities        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 2. EventBus Communication

```typescript
// In Phaser scene - emit event
import { EventBus } from '../utils/EventBus';
EventBus.emit('towerPlaced', { tower: towerData });

// In React component - subscribe
import { subscribeToEvent, unsubscribeFromEvent } from '../utils/EventBus';

useEffect(() => {
  const handler = (data) => console.log(data);
  subscribeToEvent('towerPlaced', handler);
  return () => unsubscribeFromEvent('towerPlaced', handler);
}, []);
```

#### 3. Type Safety

All game types are defined in `src/types/index.ts`:

```typescript
// Grid configuration
export const GRID_CONFIG = {
  ROWS: 5,
  COLS: 9,
  CELL_SIZE: 80,
};

// Tower types
export enum TowerType {
  PEASHOOTER = 'peashooter',
  SUNFLOWER = 'sunflower',
  WALLNUT = 'wallnut',
}

// Event types
export type GameEventType = 'towerPlaced' | 'enemyKilled' | ...;
```

## 5. Common Tasks

### Adding a New Scene

1. Create scene file in `src/scenes/`:

```typescript
// src/scenes/MenuScene.ts
import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    // Scene setup
  }
}
```

2. Register in `PhaserConfig.ts`:

```typescript
import MenuScene from '../scenes/MenuScene';

export const phaserConfig = {
  // ...
  scene: [BootScene, MenuScene, GameScene],
};
```

### Adding a New React Component

1. Create component:

```typescript
// src/components/TowerPanel.tsx
import { useState, useEffect } from 'react';
import { subscribeToEvent } from '../utils/EventBus';

export default function TowerPanel(): JSX.Element {
  const [gold, setGold] = useState(200);

  useEffect(() => {
    const handler = (data: { gold: number }) => setGold(data.gold);
    subscribeToEvent('goldChanged', handler);
    return () => unsubscribeFromEvent('goldChanged', handler);
  }, []);

  return <div className="tower-panel">{/* UI */}</div>;
}
```

2. Import in `App.tsx`:

```typescript
import TowerPanel from './components/TowerPanel';
```

### Adding Assets

1. Place assets in `public/assets/`:
   - `public/assets/towers/` - Tower sprites
   - `public/assets/enemies/` - Enemy sprites
   - `public/assets/sounds/` - Audio files

2. Load in `BootScene.ts`:

```typescript
preload(): void {
  this.load.image('tower-archer', 'assets/towers/archer.png');
  this.load.audio('shoot', 'assets/sounds/shoot.mp3');
}
```

3. Use in game:

```typescript
const tower = this.add.image(x, y, 'tower-archer');
this.sound.play('shoot');
```

## 6. Debugging

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Check Console for errors
3. Use Network tab for asset loading
4. Use Performance tab for FPS analysis

### Phaser Debug Mode

Debug mode is enabled in development:

```typescript
// In PhaserConfig.ts
physics: {
  arcade: {
    debug: import.meta.env.DEV,
  },
}
```

This shows:
- Physics body outlines
- Velocity vectors
- Collision zones

### React DevTools

Install React DevTools browser extension to:
- Inspect component tree
- View component props/state
- Profile render performance

## 7. Troubleshooting

### Common Issues

#### "Module not found" error

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

#### TypeScript errors after changes

```bash
# Run type check to see all errors
npm run type-check
```

#### Phaser canvas not rendering

1. Check browser console for errors
2. Verify WebGL support
3. Check PhaserConfig.ts settings

#### Hot reload not working

1. Check terminal for errors
2. Try hard refresh (Ctrl+Shift+R)
3. Restart dev server

### Getting Help

1. Check existing documentation in `/docs`
2. Review Phaser docs: https://phaser.io/docs/
3. Review React docs: https://react.dev/
4. Ask team members

## 8. Best Practices

### Code Style

- Use TypeScript strict mode
- Define types for all data
- Use meaningful variable names
- Keep functions small and focused
- Comment complex logic

### Performance

- Use object pooling for entities
- Avoid creating objects in update loop
- Profile with Chrome DevTools
- Target 60 FPS

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/tower-upgrade

# Make changes and commit
git add .
git commit -m "Add tower upgrade system"

# Push and create PR
git push origin feature/tower-upgrade
```

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.0 | 2026-01-11 | Dev Team | Initial guide |
