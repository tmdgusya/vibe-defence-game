# Audio Assets

This directory contains all audio assets for the Defense Game.

## Directory Structure

```
sounds/
├── bgm/                    # Background Music (8 tracks)
├── sfx/
│   ├── tower/              # Tower-related sounds (9 sounds)
│   ├── enemy/              # Enemy-related sounds (13 sounds)
│   ├── economy/            # Gold/resource sounds (3 sounds)
│   ├── state/              # Game state sounds (6 sounds)
│   └── ui/                 # UI interaction sounds (5 sounds)
└── README.md
```

## File Format

- **Primary**: `.ogg` (Vorbis) - Better quality-to-size ratio
- **Fallback**: `.mp3` - Safari compatibility
- **Bitrate**: 128-192 kbps (BGM), 128 kbps (SFX)
- **Sample Rate**: 44.1 kHz

## Naming Convention

```
bgm-[id]-[name].ogg
sfx-[category]-[id]-[name].ogg
```

## Volume Targets

| Category       | Target LUFS |
| -------------- | ----------- |
| BGM            | -14 LUFS    |
| SFX (General)  | -10 LUFS    |
| SFX (UI)       | -16 LUFS    |
| SFX (Critical) | -8 LUFS     |

## Asset Generation

All audio assets are AI-generated using **Suno**. See the full specification with generation prompts at:

`/docs/specs/SPEC-AUDIO-DESIGN-v1.0.md`

## Asset Summary

| Category      | Count  | Status  |
| ------------- | ------ | ------- |
| BGM           | 8      | Pending |
| SFX - Tower   | 9      | Pending |
| SFX - Enemy   | 13     | Pending |
| SFX - Economy | 3      | Pending |
| SFX - State   | 6      | Pending |
| SFX - UI      | 5      | Pending |
| **Total**     | **44** |         |
