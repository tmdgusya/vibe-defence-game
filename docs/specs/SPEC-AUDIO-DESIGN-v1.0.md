# Technical Specification: Audio Design

## Metadata

- **Author**: Sound Director
- **Date Created**: 2026-01-11
- **Last Updated**: 2026-01-11
- **Version**: v1.0
- **Status**: Draft
- **AI Generation Tool**: Suno

## 1. Overview

### Purpose

This specification defines all audio assets for the Defense Game, including background music (BGM) and sound effects (SFX). Each asset includes detailed AI generation prompts optimized for Suno, along with technical requirements for implementation.

### Scope

- 8 Background Music tracks
- 36 Sound Effect assets
- Technical specifications for format, duration, and volume
- Asset organization and naming conventions

### Game Audio Context

- **Visual Style**: Cheerful, cartoonish tower defense with bright colors
- **Tone**: Playful, accessible, and engaging
- **Target Audience**: Casual to mid-core players
- **Performance Target**: 60 FPS (lightweight audio required)

## 2. Suno Prompt Engineering Guidelines

### Optimal Prompt Structure

```
[Primary Genre], [Mood], [Key Instruments], [BPM], [Key], [Production Style]
```

### Best Practices

- **Length**: 10-30 words optimal
- **Front-loading**: Place most important elements first (Suno weights early words heavily)
- **Specificity**: Use specific instrument names (e.g., "Rhodes piano" not just "piano")
- **Sound Effects**: Use asterisks for onomatopoeia (e.g., `*ding*`, `*whoosh*`)
- **Structure Tags**: Use `[Intro]`, `[Verse]`, `[Chorus]`, `[Outro]` for song structure
- **Looping**: Include "loopable" or "seamless loop structure" for BGM

### Style Vocabulary Reference

| Category            | Keywords                                                                |
| ------------------- | ----------------------------------------------------------------------- |
| **Genre**           | chiptune, 8-bit, synth pop, electronic, retro game music                |
| **Mood - Positive** | cheerful, playful, whimsical, uplifting, triumphant, celebratory        |
| **Mood - Action**   | energetic, driving, intense, urgent, fast-paced, high-energy            |
| **Mood - Calm**     | relaxed, peaceful, gentle, warm, ambient                                |
| **Instruments**     | synth arpeggios, xylophone, Rhodes piano, electronic drums, synth brass |
| **Production**      | clean, bright, punchy, warm, sparkling                                  |

---

## 3. Background Music (BGM)

### 3.1 Main Menu Theme

| Field        | Value                             |
| ------------ | --------------------------------- |
| **ID**       | `BGM-001`                         |
| **Filename** | `bgm-001-main-menu.ogg`           |
| **Context**  | Title screen, main menu, settings |
| **Duration** | 60-90 seconds (loopable)          |
| **BPM**      | 95-105                            |
| **Key**      | C Major / G Major                 |

**Suno Prompt:**

```
Cheerful whimsical chiptune pop, playful melody with bright synth arpeggios, warm Rhodes piano accents, xylophone sparkles, 100 BPM, C Major, light-hearted game menu music, clean loopable structure, inviting and friendly production
```

---

### 3.2 Gameplay - Normal Wave

| Field        | Value                                |
| ------------ | ------------------------------------ |
| **ID**       | `BGM-002`                            |
| **Filename** | `bgm-002-gameplay-normal.ogg`        |
| **Context**  | During active enemy waves (non-boss) |
| **Duration** | 90-120 seconds (loopable)            |
| **BPM**      | 120-130                              |
| **Key**      | D Major                              |

**Suno Prompt:**

```
Energetic 8-bit inspired synth pop, driving beat with punchy electronic drums, bright lead synths, playful bass groove, 125 BPM, D Major, uplifting action game music, fun cartoon battle energy, seamless loop structure
```

---

### 3.3 Gameplay - Intense Wave (Late Levels)

| Field        | Value                                  |
| ------------ | -------------------------------------- |
| **ID**       | `BGM-003`                              |
| **Filename** | `bgm-003-gameplay-intense.ogg`         |
| **Context**  | Later waves, higher difficulty moments |
| **Duration** | 90-120 seconds (loopable)              |
| **BPM**      | 135-145                                |
| **Key**      | E Minor                                |

**Suno Prompt:**

```
Fast-paced chiptune action music, intense driving synth leads, pulsing electronic bass, rapid arpeggios, urgent but fun energy, 140 BPM, E Minor, high-energy cartoon game battle, exciting tension without being dark, loopable
```

---

### 3.4 Boss Wave Theme

| Field        | Value                      |
| ------------ | -------------------------- |
| **ID**       | `BGM-004`                  |
| **Filename** | `bgm-004-boss-wave.ogg`    |
| **Context**  | Boss enemy waves           |
| **Duration** | 120-150 seconds (loopable) |
| **BPM**      | 130-140                    |
| **Key**      | A Minor                    |

**Suno Prompt:**

```
Epic chiptune boss battle theme, dramatic synth orchestra with powerful drums, heroic lead melody, tension-building arpeggios, 135 BPM, A Minor, climactic game boss music, intense yet playful cartoon villain energy, loopable structure
```

---

### 3.5 Wave Break / Preparation

| Field        | Value                            |
| ------------ | -------------------------------- |
| **ID**       | `BGM-005`                        |
| **Filename** | `bgm-005-wave-break.ogg`         |
| **Context**  | Between waves (10-second breaks) |
| **Duration** | 30-45 seconds (loopable)         |
| **BPM**      | 85-95                            |
| **Key**      | F Major                          |

**Suno Prompt:**

```
Calm chiptune ambient, relaxed synth pads with gentle xylophone melody, peaceful electronic atmosphere, soft arpeggios, 90 BPM, F Major, strategic planning game music, breath of relief, warm and encouraging, loopable
```

---

### 3.6 Victory Fanfare

| Field        | Value                         |
| ------------ | ----------------------------- |
| **ID**       | `BGM-006`                     |
| **Filename** | `bgm-006-victory-fanfare.ogg` |
| **Context**  | Level completion celebration  |
| **Duration** | 15-20 seconds (non-looping)   |
| **BPM**      | 120-130                       |
| **Key**      | C Major                       |

**Suno Prompt:**

```
Triumphant 8-bit victory fanfare, celebratory synth brass with sparkling chimes, ascending melodic flourish, cheerful drums, 125 BPM, C Major, joyful game level complete music, rewarding achievement celebration, bright happy ending
```

---

### 3.7 Game Over

| Field        | Value                       |
| ------------ | --------------------------- |
| **ID**       | `BGM-007`                   |
| **Filename** | `bgm-007-game-over.ogg`     |
| **Context**  | Player loses all lives      |
| **Duration** | 10-15 seconds (non-looping) |
| **BPM**      | 80-90                       |
| **Key**      | D Minor                     |

**Suno Prompt:**

```
Playful 8-bit game over jingle, comedic descending synth melody, silly fail sound with soft landing, 85 BPM, D Minor, lighthearted defeat music, encouraging retry vibe, not sad but gently humorous
```

---

### 3.8 Final Victory / Game Complete

| Field        | Value                                     |
| ------------ | ----------------------------------------- |
| **ID**       | `BGM-008`                                 |
| **Filename** | `bgm-008-final-victory.ogg`               |
| **Context**  | Completing all levels / final achievement |
| **Duration** | 30-45 seconds (non-looping)               |
| **BPM**      | 130-140                                   |
| **Key**      | G Major                                   |

**Suno Prompt:**

```
Grand chiptune victory anthem, triumphant synth orchestra with epic drums, soaring heroic melody, sparkling celebratory chimes, 135 BPM, G Major, ultimate game completion fanfare, maximum joy and achievement, glorious finale
```

---

## 4. Sound Effects (SFX)

### 4.1 Tower Sounds

| ID         | Filename                              | Sound                           | Context                   | Duration |
| ---------- | ------------------------------------- | ------------------------------- | ------------------------- | -------- |
| `SFX-T001` | `sfx-tower-001-place-peashooter.ogg`  | Tower Placement - Peashooter    | Green tower placed        | 0.5s     |
| `SFX-T002` | `sfx-tower-002-place-sunflower.ogg`   | Tower Placement - Sunflower     | Gold tower placed         | 0.5s     |
| `SFX-T003` | `sfx-tower-003-place-wallnut.ogg`     | Tower Placement - Wallnut       | Brown tower placed        | 0.5s     |
| `SFX-T004` | `sfx-tower-004-merge-advanced.ogg`    | Tower Merge - Basic to Advanced | First merge level         | 1.0s     |
| `SFX-T005` | `sfx-tower-005-merge-elite.ogg`       | Tower Merge - Advanced to Elite | Max merge level           | 1.5s     |
| `SFX-T006` | `sfx-tower-006-attack-peashooter.ogg` | Tower Attack - Peashooter       | Projectile fired          | 0.3s     |
| `SFX-T007` | `sfx-tower-007-attack-sunflower.ogg`  | Tower Attack - Sunflower        | Resource generation       | 0.4s     |
| `SFX-T008` | `sfx-tower-008-sell.ogg`              | Tower Sell                      | Tower removed for gold    | 0.5s     |
| `SFX-T009` | `sfx-tower-009-placement-failed.ogg`  | Placement Failed                | Invalid placement attempt | 0.3s     |

#### Suno Prompts - Tower Sounds

**SFX-T001: Tower Placement - Peashooter**

```
Bright satisfying electronic *plop* with ascending chime, cheerful plant growing sound, digital nature ping, short snappy 0.5 seconds
```

**SFX-T002: Tower Placement - Sunflower**

```
Warm sparkling *ding* with sunshine shimmer, golden bell chime, happy flower bloom sound, bright and warm 0.5 seconds
```

**SFX-T003: Tower Placement - Wallnut**

```
Solid chunky *thunk* with earthy bass, satisfying heavy placement, sturdy wooden drop, grounded 0.5 seconds
```

**SFX-T004: Tower Merge - Basic to Advanced**

```
Magical ascending synth whoosh with sparkle chimes, power-up transformation, exciting upgrade sound, 1 second
```

**SFX-T005: Tower Merge - Advanced to Elite**

```
Epic double sparkle burst with triumphant synth fanfare, ultimate power-up achieved, glorious transformation, celebratory 1.5 seconds
```

**SFX-T006: Tower Attack - Peashooter**

```
Quick bouncy *pew* sound, cartoon pea shooting, playful projectile launch, snappy 0.3 seconds
```

**SFX-T007: Tower Attack - Sunflower**

```
Gentle golden shimmer *ting*, soft coin sparkle, warm resource generation chime, pleasant 0.4 seconds
```

**SFX-T008: Tower Sell**

```
Quick descending electronic *whoosh* with coin jingle, satisfying removal, recycling sound, 0.5 seconds
```

**SFX-T009: Placement Failed**

```
Soft buzzer *bonk* sound, gentle error notification, not harsh but clear rejection, friendly warning 0.3 seconds
```

---

### 4.2 Enemy Sounds

| ID         | Filename                          | Sound                 | Context                    | Duration |
| ---------- | --------------------------------- | --------------------- | -------------------------- | -------- |
| `SFX-E001` | `sfx-enemy-001-spawn-basic.ogg`   | Enemy Spawn - Basic   | Light green enemy appears  | 0.3s     |
| `SFX-E002` | `sfx-enemy-002-spawn-tank.ogg`    | Enemy Spawn - Tank    | Gray heavy enemy appears   | 0.4s     |
| `SFX-E003` | `sfx-enemy-003-spawn-flying.ogg`  | Enemy Spawn - Flying  | Pink fast enemy appears    | 0.3s     |
| `SFX-E004` | `sfx-enemy-004-spawn-boss.ogg`    | Enemy Spawn - Boss    | Dark red boss appears      | 0.8s     |
| `SFX-E005` | `sfx-enemy-005-spawn-swarm.ogg`   | Enemy Spawn - Swarm   | Orange group appears       | 0.5s     |
| `SFX-E006` | `sfx-enemy-006-spawn-armored.ogg` | Enemy Spawn - Armored | Purple tough enemy appears | 0.4s     |
| `SFX-E007` | `sfx-enemy-007-death-basic.ogg`   | Enemy Death - Basic   | Basic enemy defeated       | 0.3s     |
| `SFX-E008` | `sfx-enemy-008-death-tank.ogg`    | Enemy Death - Tank    | Tank enemy defeated        | 0.5s     |
| `SFX-E009` | `sfx-enemy-009-death-flying.ogg`  | Enemy Death - Flying  | Flying enemy defeated      | 0.3s     |
| `SFX-E010` | `sfx-enemy-010-death-boss.ogg`    | Enemy Death - Boss    | Boss enemy defeated        | 1.0s     |
| `SFX-E011` | `sfx-enemy-011-death-swarm.ogg`   | Enemy Death - Swarm   | Swarm enemy defeated       | 0.2s     |
| `SFX-E012` | `sfx-enemy-012-death-armored.ogg` | Enemy Death - Armored | Armored enemy defeated     | 0.4s     |
| `SFX-E013` | `sfx-enemy-013-reached-end.ogg`   | Enemy Reached End     | Enemy damages player       | 0.5s     |

#### Suno Prompts - Enemy Sounds

**SFX-E001: Enemy Spawn - Basic**

```
Quick digital *pop* with soft whoosh, simple enemy arrival, minimal spawn sound, 0.3 seconds
```

**SFX-E002: Enemy Spawn - Tank**

```
Heavy mechanical *thud* with metallic clang, armored arrival, weighty spawn sound, 0.4 seconds
```

**SFX-E003: Enemy Spawn - Flying**

```
Airy *swoosh* with flutter wings, light aerial arrival, quick flying spawn, 0.3 seconds
```

**SFX-E004: Enemy Spawn - Boss**

```
Dramatic low synth *boom* with ominous chord, intimidating arrival, boss entrance fanfare, 0.8 seconds
```

**SFX-E005: Enemy Spawn - Swarm**

```
Multiple quick *pops* in sequence, swarm arrival chittering, rapid group spawn, 0.5 seconds
```

**SFX-E006: Enemy Spawn - Armored**

```
Metallic *clank* with shield shimmer, protected enemy arrival, armored spawn sound, 0.4 seconds
```

**SFX-E007: Enemy Death - Basic**

```
Playful 8-bit *pop* burst, satisfying defeat explosion, cheerful elimination, 0.3 seconds
```

**SFX-E008: Enemy Death - Tank**

```
Heavy metallic *crash* with satisfying crumble, armor breaking, chunky defeat, 0.5 seconds
```

**SFX-E009: Enemy Death - Flying**

```
Airy *poof* with feather flutter, light aerial defeat, floating disappearance, 0.3 seconds
```

**SFX-E010: Enemy Death - Boss**

```
Epic explosion with triumphant chord, massive defeat celebration, victorious boss kill, 1 second
```

**SFX-E011: Enemy Death - Swarm**

```
Quick tiny *pop*, small satisfying burst, mini elimination, rapid 0.2 seconds
```

**SFX-E012: Enemy Death - Armored**

```
Metallic *shatter* with armor breaking, shield cracking defeat, satisfying armor break, 0.4 seconds
```

**SFX-E013: Enemy Reached End**

```
Alarming *buzz* with health loss warning, damage notification, urgent but not harsh, 0.5 seconds
```

---

### 4.3 Economy Sounds

| ID         | Filename                                 | Sound                | Context                     | Duration |
| ---------- | ---------------------------------------- | -------------------- | --------------------------- | -------- |
| `SFX-G001` | `sfx-economy-001-gold-collect.ogg`       | Gold Collect         | Enemy kill reward           | 0.3s     |
| `SFX-G002` | `sfx-economy-002-gold-collect-large.ogg` | Gold Collect - Large | Boss/level completion bonus | 0.6s     |
| `SFX-G003` | `sfx-economy-003-insufficient-funds.ogg` | Insufficient Funds   | Cannot afford tower         | 0.3s     |

#### Suno Prompts - Economy Sounds

**SFX-G001: Gold Collect**

```
Bright coin *ching* with sparkle, satisfying gold collection, rewarding jingle, 0.3 seconds
```

**SFX-G002: Gold Collect - Large**

```
Multiple coins *ching ching ching* cascade, jackpot sound, big reward celebration, 0.6 seconds
```

**SFX-G003: Insufficient Funds**

```
Soft empty *bonk* with hollow tone, gentle insufficient funds, not enough gold warning, 0.3 seconds
```

---

### 4.4 Game State Sounds

| ID         | Filename                           | Sound          | Context                      | Duration |
| ---------- | ---------------------------------- | -------------- | ---------------------------- | -------- |
| `SFX-S001` | `sfx-state-001-wave-start.ogg`     | Wave Start     | New wave begins              | 0.8s     |
| `SFX-S002` | `sfx-state-002-wave-complete.ogg`  | Wave Complete  | All enemies in wave defeated | 1.0s     |
| `SFX-S003` | `sfx-state-003-level-complete.ogg` | Level Complete | All waves cleared            | 2.0s     |
| `SFX-S004` | `sfx-state-004-pause.ogg`          | Game Pause     | Player pauses game           | 0.3s     |
| `SFX-S005` | `sfx-state-005-resume.ogg`         | Game Resume    | Player unpauses              | 0.3s     |
| `SFX-S006` | `sfx-state-006-life-lost.ogg`      | Life Lost      | Enemy reached end            | 0.4s     |

#### Suno Prompts - Game State Sounds

**SFX-S001: Wave Start**

```
Rising synth *whoosh* with alert chime, wave incoming announcement, battle starting signal, 0.8 seconds
```

**SFX-S002: Wave Complete**

```
Short triumphant *ta-da* fanfare, wave cleared celebration, mini victory jingle, 1 second
```

**SFX-S003: Level Complete**

```
Longer celebratory fanfare with sparkles, level victory music, achievement unlocked sound, 2 seconds
```

**SFX-S004: Game Pause**

```
Soft *pause* tone with gentle fade, time stopped sound, calm interruption, 0.3 seconds
```

**SFX-S005: Game Resume**

```
Quick *unpause* whoosh with energy return, resuming action, back to battle, 0.3 seconds
```

**SFX-S006: Life Lost**

```
Alarming heart *thump* with worry tone, life decreased warning, health damage notification, 0.4 seconds
```

---

### 4.5 UI Sounds

| ID         | Filename                      | Sound        | Context                  | Duration |
| ---------- | ----------------------------- | ------------ | ------------------------ | -------- |
| `SFX-U001` | `sfx-ui-001-button-click.ogg` | Button Click | General UI interaction   | 0.1s     |
| `SFX-U002` | `sfx-ui-002-button-hover.ogg` | Button Hover | Mouse hover on button    | 0.1s     |
| `SFX-U003` | `sfx-ui-003-menu-open.ogg`    | Menu Open    | Opening menu/panel       | 0.2s     |
| `SFX-U004` | `sfx-ui-004-menu-close.ogg`   | Menu Close   | Closing menu/panel       | 0.2s     |
| `SFX-U005` | `sfx-ui-005-tower-select.ogg` | Tower Select | Selecting tower to place | 0.2s     |

#### Suno Prompts - UI Sounds

**SFX-U001: Button Click**

```
Clean soft *click*, satisfying button press, minimal UI feedback, 0.1 seconds
```

**SFX-U002: Button Hover**

```
Subtle soft *tick*, gentle hover feedback, light UI highlight, 0.1 seconds
```

**SFX-U003: Menu Open**

```
Smooth *swoosh* outward, panel sliding open, clean UI transition, 0.2 seconds
```

**SFX-U004: Menu Close**

```
Smooth *swoosh* inward, panel sliding closed, clean UI transition, 0.2 seconds
```

**SFX-U005: Tower Select**

```
Bright *ping* selection, tower chosen highlight, ready to place confirmation, 0.2 seconds
```

---

## 5. Technical Requirements

### 5.1 File Formats

| Type | Primary Format  | Fallback Format | Bitrate      | Sample Rate |
| ---- | --------------- | --------------- | ------------ | ----------- |
| BGM  | `.ogg` (Vorbis) | `.mp3`          | 128-192 kbps | 44.1 kHz    |
| SFX  | `.ogg` (Vorbis) | `.mp3`          | 128 kbps     | 44.1 kHz    |

**Rationale**: OGG Vorbis provides better quality-to-size ratio and is royalty-free. MP3 fallback ensures Safari compatibility.

### 5.2 Duration Guidelines

| Category     | Duration        | Notes                      |
| ------------ | --------------- | -------------------------- |
| BGM Loops    | 60-120 seconds  | Seamless loop points       |
| BGM Fanfares | 10-30 seconds   | Non-looping, one-shot      |
| SFX Short    | 0.1-0.5 seconds | UI feedback, quick actions |
| SFX Medium   | 0.5-1.0 seconds | Standard game events       |
| SFX Long     | 1.0-2.0 seconds | Major events, celebrations |

### 5.3 Volume Normalization

| Category       | Target LUFS | Notes                                    |
| -------------- | ----------- | ---------------------------------------- |
| BGM            | -14 LUFS    | Background level, doesn't overpower SFX  |
| SFX (General)  | -10 LUFS    | Foreground prominence                    |
| SFX (UI)       | -16 LUFS    | Subtle, non-intrusive feedback           |
| SFX (Critical) | -8 LUFS     | Important alerts (life lost, boss spawn) |

### 5.4 Loop Points (BGM)

For loopable tracks, ensure:

- Loop start: After any intro section (if present)
- Loop end: Before any tail/reverb decay
- Crossfade compatibility: 500ms overlap supported

### 5.5 Naming Convention

```
bgm-[id]-[name].ogg
sfx-[category]-[id]-[name].ogg
```

**Examples:**

- `bgm-001-main-menu.ogg`
- `sfx-tower-001-place-peashooter.ogg`
- `sfx-enemy-007-death-basic.ogg`

---

## 6. Asset Organization

```
public/assets/sounds/
├── bgm/
│   ├── bgm-001-main-menu.ogg
│   ├── bgm-002-gameplay-normal.ogg
│   ├── bgm-003-gameplay-intense.ogg
│   ├── bgm-004-boss-wave.ogg
│   ├── bgm-005-wave-break.ogg
│   ├── bgm-006-victory-fanfare.ogg
│   ├── bgm-007-game-over.ogg
│   └── bgm-008-final-victory.ogg
├── sfx/
│   ├── tower/
│   │   ├── sfx-tower-001-place-peashooter.ogg
│   │   ├── sfx-tower-002-place-sunflower.ogg
│   │   ├── sfx-tower-003-place-wallnut.ogg
│   │   ├── sfx-tower-004-merge-advanced.ogg
│   │   ├── sfx-tower-005-merge-elite.ogg
│   │   ├── sfx-tower-006-attack-peashooter.ogg
│   │   ├── sfx-tower-007-attack-sunflower.ogg
│   │   ├── sfx-tower-008-sell.ogg
│   │   └── sfx-tower-009-placement-failed.ogg
│   ├── enemy/
│   │   ├── sfx-enemy-001-spawn-basic.ogg
│   │   ├── sfx-enemy-002-spawn-tank.ogg
│   │   ├── sfx-enemy-003-spawn-flying.ogg
│   │   ├── sfx-enemy-004-spawn-boss.ogg
│   │   ├── sfx-enemy-005-spawn-swarm.ogg
│   │   ├── sfx-enemy-006-spawn-armored.ogg
│   │   ├── sfx-enemy-007-death-basic.ogg
│   │   ├── sfx-enemy-008-death-tank.ogg
│   │   ├── sfx-enemy-009-death-flying.ogg
│   │   ├── sfx-enemy-010-death-boss.ogg
│   │   ├── sfx-enemy-011-death-swarm.ogg
│   │   ├── sfx-enemy-012-death-armored.ogg
│   │   └── sfx-enemy-013-reached-end.ogg
│   ├── economy/
│   │   ├── sfx-economy-001-gold-collect.ogg
│   │   ├── sfx-economy-002-gold-collect-large.ogg
│   │   └── sfx-economy-003-insufficient-funds.ogg
│   ├── state/
│   │   ├── sfx-state-001-wave-start.ogg
│   │   ├── sfx-state-002-wave-complete.ogg
│   │   ├── sfx-state-003-level-complete.ogg
│   │   ├── sfx-state-004-pause.ogg
│   │   ├── sfx-state-005-resume.ogg
│   │   └── sfx-state-006-life-lost.ogg
│   └── ui/
│       ├── sfx-ui-001-button-click.ogg
│       ├── sfx-ui-002-button-hover.ogg
│       ├── sfx-ui-003-menu-open.ogg
│       ├── sfx-ui-004-menu-close.ogg
│       └── sfx-ui-005-tower-select.ogg
└── README.md
```

---

## 7. Implementation Notes

### 7.1 Audio Library

The game uses **Howler.js** (v2.2.4) for cross-platform audio playback.

### 7.2 Playback Guidelines

| Feature         | Implementation                       |
| --------------- | ------------------------------------ |
| BGM Crossfade   | 500ms transition between tracks      |
| SFX Polyphony   | Support multiple simultaneous sounds |
| Volume Controls | Separate BGM/SFX volume sliders      |
| Mute Options    | Individual mute for BGM and SFX      |

### 7.3 Event Mapping

| Game Event        | Audio Asset                        |
| ----------------- | ---------------------------------- |
| `sceneReady`      | BGM-001 (Main Menu)                |
| `towerPlaced`     | SFX-T001/T002/T003 (by type)       |
| `towerMerged`     | SFX-T004/T005 (by level)           |
| `towerSold`       | SFX-T008                           |
| `placementFailed` | SFX-T009                           |
| `enemySpawned`    | SFX-E001-E006 (by type)            |
| `enemyKilled`     | SFX-E007-E012 (by type) + SFX-G001 |
| `enemyReachedEnd` | SFX-E013 + SFX-S006                |
| `waveStarted`     | SFX-S001 + BGM-002/003/004         |
| `waveCompleted`   | SFX-S002 + BGM-005                 |
| `goldChanged`     | SFX-G001/G002                      |
| `livesChanged`    | SFX-S006                           |
| `gameOver`        | BGM-007                            |
| `gamePaused`      | SFX-S004                           |
| `gameResumed`     | SFX-S005                           |

### 7.4 Performance Considerations

- **Audio Sprites**: Consider combining related SFX into sprite sheets to reduce HTTP requests
- **Preloading**: Preload critical sounds during scene initialization
- **Memory Management**: Unload unused BGM tracks when switching scenes

---

## 8. Asset Checklist

### BGM (8 tracks)

- [ ] BGM-001: Main Menu Theme
- [ ] BGM-002: Gameplay - Normal Wave
- [ ] BGM-003: Gameplay - Intense Wave
- [ ] BGM-004: Boss Wave Theme
- [ ] BGM-005: Wave Break / Preparation
- [ ] BGM-006: Victory Fanfare
- [ ] BGM-007: Game Over
- [ ] BGM-008: Final Victory

### SFX - Tower (9 sounds)

- [ ] SFX-T001: Tower Placement - Peashooter
- [ ] SFX-T002: Tower Placement - Sunflower
- [ ] SFX-T003: Tower Placement - Wallnut
- [ ] SFX-T004: Tower Merge - Basic to Advanced
- [ ] SFX-T005: Tower Merge - Advanced to Elite
- [ ] SFX-T006: Tower Attack - Peashooter
- [ ] SFX-T007: Tower Attack - Sunflower
- [ ] SFX-T008: Tower Sell
- [ ] SFX-T009: Placement Failed

### SFX - Enemy (13 sounds)

- [ ] SFX-E001: Enemy Spawn - Basic
- [ ] SFX-E002: Enemy Spawn - Tank
- [ ] SFX-E003: Enemy Spawn - Flying
- [ ] SFX-E004: Enemy Spawn - Boss
- [ ] SFX-E005: Enemy Spawn - Swarm
- [ ] SFX-E006: Enemy Spawn - Armored
- [ ] SFX-E007: Enemy Death - Basic
- [ ] SFX-E008: Enemy Death - Tank
- [ ] SFX-E009: Enemy Death - Flying
- [ ] SFX-E010: Enemy Death - Boss
- [ ] SFX-E011: Enemy Death - Swarm
- [ ] SFX-E012: Enemy Death - Armored
- [ ] SFX-E013: Enemy Reached End

### SFX - Economy (3 sounds)

- [ ] SFX-G001: Gold Collect
- [ ] SFX-G002: Gold Collect - Large
- [ ] SFX-G003: Insufficient Funds

### SFX - Game State (6 sounds)

- [ ] SFX-S001: Wave Start
- [ ] SFX-S002: Wave Complete
- [ ] SFX-S003: Level Complete
- [ ] SFX-S004: Game Pause
- [ ] SFX-S005: Game Resume
- [ ] SFX-S006: Life Lost

### SFX - UI (5 sounds)

- [ ] SFX-U001: Button Click
- [ ] SFX-U002: Button Hover
- [ ] SFX-U003: Menu Open
- [ ] SFX-U004: Menu Close
- [ ] SFX-U005: Tower Select

---

## Revision History

| Version | Date       | Author         | Changes                                            |
| ------- | ---------- | -------------- | -------------------------------------------------- |
| v1.0    | 2026-01-11 | Sound Director | Initial specification with all BGM and SFX prompts |
