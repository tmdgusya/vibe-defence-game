# Defence Game

A tower defense game with sophisticated level progression, economy system, and tower merging mechanics, built with Phaser.js, React, and TypeScript.

## Tech Stack

- **Game Engine**: Phaser.js 3.80+
- **UI Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Audio**: Howler.js
- **Testing**: Vitest
- **Deployment**: Netlify

## Quick Start

### Prerequisites

- Node.js 18+
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd defence-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Lint source code |
| `npm run lint:fix` | Lint and fix issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

## Project Structure

```
defence-game/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles + Tailwind
│   ├── scenes/               # Phaser scenes
│   │   ├── BootScene.ts          # Loading & initialization
│   │   └── GameScene.ts          # Main game world
│   ├── entities/             # Game objects (towers, enemies)
│   ├── systems/              # Game logic systems
│   ├── components/           # React UI components
│   │   └── PhaserGame.tsx        # Phaser-React bridge
│   ├── types/                # TypeScript definitions
│   │   └── index.ts              # Core type definitions
│   ├── utils/                # Shared utilities
│   │   └── EventBus.ts           # React-Phaser communication
│   ├── config/               # Game configuration
│   │   └── PhaserConfig.ts       # Phaser setup
│   └── hooks/                # React hooks
├── public/
│   └── assets/               # Game assets
│       ├── towers/           # Tower sprites
│       ├── enemies/          # Enemy sprites
│       ├── ui/               # UI elements
│       ├── effects/          # Visual effects
│       └── sounds/           # Audio files
├── docs/                     # Documentation
└── dist/                     # Production build output
```

## Game Features

### Core Gameplay
- **Grid System**: 5x9 cell grid (80x80 pixels per cell)
- **Tower Placement**: Drag-and-drop tower placement
- **Tower Merging**: Combine identical adjacent towers (Basic → Advanced → Elite)
- **6 Enemy Types**: Basic, Tank, Flying, Boss, Swarm, Armored
- **Wave System**: Progressive difficulty scaling

### Technical Features
- **60 FPS Target**: Optimized for smooth gameplay
- **WebGL Rendering**: Hardware-accelerated graphics with Canvas fallback
- **EventBus System**: Type-safe React-Phaser communication
- **Entity Pooling**: Efficient memory management (planned)

## Development

### Architecture

The game uses a split architecture:

1. **Phaser Layer**: Handles all game rendering, physics, and gameplay logic
2. **React Layer**: Manages UI components, state, and user interactions
3. **EventBus**: Bridges communication between Phaser and React

### Key Files

| File | Purpose |
|------|---------|
| `src/config/PhaserConfig.ts` | Phaser game configuration |
| `src/scenes/GameScene.ts` | Main game scene with grid system |
| `src/components/PhaserGame.tsx` | React wrapper for Phaser |
| `src/utils/EventBus.ts` | Event communication system |
| `src/types/index.ts` | TypeScript type definitions |

### Adding New Features

1. **New Tower Type**:
   - Add type to `TowerType` enum in `src/types/index.ts`
   - Create tower entity in `src/entities/`
   - Update asset loading in `BootScene.ts`

2. **New Enemy Type**:
   - Add type to `EnemyType` enum in `src/types/index.ts`
   - Create enemy entity in `src/entities/`
   - Configure stats in game config

3. **New UI Component**:
   - Create component in `src/components/`
   - Subscribe to EventBus events as needed
   - Add to `App.tsx`

## Performance

### Target Specifications
- 60 FPS during intense combat (100+ enemies)
- < 100ms level loading times
- < 16ms UI response time

### Optimization Strategies
- Object pooling for entities
- WebGL rendering (with Canvas2D fallback)
- Code splitting (vendor, phaser, game chunks)
- Asset preloading

## Deployment

The project is configured for Netlify deployment:

```bash
# Build for production
npm run build

# The dist/ folder contains the deployable files
```

### Netlify Configuration

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

## Documentation

- [Development Plan](docs/development-plan.md) - Full 30-day development roadmap
- [Task Assignments](docs/task-assignments.md) - Detailed task breakdown
- [Developer Guide](docs/guides/GUIDE-DEVELOPER-SETUP.md) - Setup and workflow guide

## Contributing

1. Follow the existing code style (ESLint + Prettier)
2. Write TypeScript with strict mode
3. Add tests for new features
4. Update documentation as needed

## License

[Add license information]
