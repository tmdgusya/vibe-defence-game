# Asset Naming Conventions Guide

## Overview
Standardized naming ensures consistency across the design system and simplifies asset management.

## General Rules
- Use lowercase letters only
- Separate words with hyphens (-) 
- No spaces or special characters (except hyphens)
- Use descriptive, meaningful names
- Include size/frame information where applicable

## Tower Assets
### Format: `{tower-type}-level{number}.{format}`
```
peashooter-level1.png
peashooter-level2.png
peashooter-level3.png
sunflower-level1.png
sunflower-level2.png
sunflower-level3.png
wallnut-level1.png
wallnut-level2.png
wallnut-level3.png
```

### Tower Animations
### Format: `{tower-type}-{action}-level{number}-{frame}.{format}`
```
peashooter-idle-level1-1.png
peashooter-idle-level1-2.png
peashooter-attack-level1-1.png
peashooter-attack-level1-2.png
```

## Enemy Assets
### Format: `{enemy-type}-{action}.{format}`
```
basic-walk.png
basic-attack.png
basic-death.png
tank-walk.png
tank-attack.png
flying-fly.png
boss-walk.png
boss-attack.png
```

### Enemy Animation Frames
### Format: `{enemy-type}-{action}-{frame}.{format}`
```
basic-walk-1.png
basic-walk-2.png
basic-walk-3.png
```

## UI Assets
### Buttons
### Format: `button-{style}-{state}.{format}`
```
button-primary-normal.png
button-primary-hover.png
button-primary-active.png
button-secondary-normal.png
button-secondary-hover.png
```

### Panels
### Format: `panel-{type}-{variation}.{format}`
```
panel-main-default.png
panel-main-hover.png
panel-side-default.png
```

### Icons
### Format: `icon-{category}-{name}.{format}`
```
icon-tower-peashooter.svg
icon-tower-sunflower.svg
icon-settings-gear.svg
icon-close-x.svg
```

## Effects
### Format: `effect-{name}.{format}`
```
effect-merge-sparkle.png
effect-explosion-small.png
effect-projectile-pea.png
effect-money-collect.png
```

## Backgrounds
### Format: `bg-{location}-{time}.{format}`
```
bg-level1-day.jpg
bg-level2-night.jpg
bg-menu-default.jpg
```

## Sound Assets
### Sound Effects
### Format: `sfx-{category}-{action}.{format}`
```
sfx-tower-place.mp3
sfx-tower-shoot.mp3
sfx-merge-success.mp3
sfx-enemy-hit.mp3
sfx-money-collect.mp3
```

### Music
### Format: `music-{mood}-{intensity}.{format}`
```
music-background-calm.mp3
music-background-intense.mp3
music-victory-epic.mp3
music-menu-relaxing.mp3
```

## File Formats
- **Sprites**: PNG (for transparency)
- **Icons**: SVG (for scalability)
- **Audio**: MP3 (for compression)
- **Backgrounds**: JPG (for quality/size balance)

## Size Specifications
### Game Sprites
- **Towers**: 64x64 pixels
- **Enemies**: 32x32 pixels
- **Projectiles**: 8x8 pixels
- **Icons**: 32x32 pixels

### UI Elements
- **Buttons**: Variable height, max 200px width
- **Panels**: Variable, multiples of 8px grid
- **Icons**: 16x16, 24x24, 32x32 variants

## Organization
### Directory Structure
```
public/assets/
├── towers/
│   ├── peashooter/
│   ├── sunflower/
│   └── wallnut/
├── enemies/
│   ├── basic/
│   ├── tank/
│   ├── flying/
│   └── boss/
├── ui/
│   ├── buttons/
│   ├── panels/
│   └── icons/
├── effects/
├── sounds/
│   ├── sfx/
│   └── music/
└── backgrounds/
```

## Version Control
- Use semantic versioning for major asset updates
- Include date in filename for iterations
- Keep previous versions until confirmed working

### Version Format
`{asset-name}-v{major}.{minor}.{date}.{format}`
```
peashooter-level1-v1.0-2024-01-15.png
ui-main-panel-v2.1-2024-01-16.png
```

## Optimization Rules
- **Max file size**: 50KB per sprite
- **Total bundle size**: 2MB maximum
- **Compression**: Use lossless compression for sprites
- **Formats**: PNG-8 for simple sprites, WebP for complex images

## Quality Checklist
- [ ] Name follows convention
- [ ] File is properly compressed
- [ ] Size meets specifications
- [ ] Transparency correctly applied
- [ ] Color matches design tokens
- [ ] Organized in correct directory
- [ ] Version properly labeled

## Examples
### Good Naming
```
✅ peashooter-level1.png
✅ basic-walk-1.png
✅ button-primary-hover.png
✅ effect-merge-sparkle.png
✅ sfx-tower-place.mp3
```

### Bad Naming
```
❌ Tower1.png (wrong case, vague)
❌ peashooter final.png (spaces, vague)
❌ Button_Hover.png (wrong separator)
❌ walk_sprite.png (vague, wrong case)
❌ SFX.mp3 (non-descriptive)
```