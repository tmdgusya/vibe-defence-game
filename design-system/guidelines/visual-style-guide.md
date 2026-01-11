# Visual Style Guide

## Design Philosophy
**Vibrant Cartoon Tower Defense** - Bright, engaging visuals that prioritize performance and clarity while maintaining playful personality.

## Color Palette

### Primary Colors
- **Sky Blue**: `#87CEEB` - Backgrounds, sky elements
- **Grass Green**: `#90EE90` - Ground, plants, nature elements  
- **Earth Brown**: `#8B4513` - Structures, earth tones

### Tower Colors
- **Peashooter**: Green theme (`#32CD32` primary, `#228B22` secondary)
- **Sunflower**: Gold theme (`#FFD700` primary, `#FFA500` secondary)
- **Wallnut**: Brown theme (`#8B4513` primary, `#654321` secondary)

### Enemy Colors
- **Basic**: Light green (`#9ACD32`) - Low health, fast
- **Tank**: Gray (`#696969`) - High health, slow
- **Flying**: Pink (`#FF69B4`) - Medium health, high speed
- **Boss**: Dark red (`#8B0000`) - Very high health, dangerous
- **Swarm**: Orange (`#FF8C00`) - Low health, group behavior
- **Armored**: Purple (`#483D8B`) - Medium health, resistant

### UI Colors
- **Backgrounds**: Light blue (`#F0F8FF`)
- **Text**: Dark blue-gray (`#2C3E50`)
- **Interactive**: Blue (`#3498DB`)
- **Success**: Green (`#27AE60`)
- **Warning**: Orange (`#F39C12`)
- **Danger**: Red (`#E74C3C`)
- **Gold**: Yellow (`#FFD700`) - Currency emphasis

## Typography

### Primary Font: Comic Sans MS
- **Usage**: Game UI, menus, labels
- **Character**: Friendly, playful, accessible
- **Weights**: 400 (normal), 700 (bold)

### Game Font: Press Start 2P
- **Usage**: Score displays, retro elements
- **Character**: Pixelated, game-like
- **Sizes**: 10px (UI) to 24px (large)

### UI Font: Arial
- **Usage**: System text, notifications
- **Character**: Clean, readable, system-friendly
- **Weights**: 400, 500, 700

### Sizing System
- **UI Text**: 10px-24px
- **Game Elements**: 12px-18px
- **Titles**: 18px-32px
- **Headings**: 24px-48px

## Visual Hierarchy

### Size Scale
1. **Game Elements**: Most important (towers, enemies)
2. **Interactive UI**: Second (buttons, panels)
3. **Information**: Third (text, icons)
4. **Background**: Least important (environment)

### Contrast Rules
- **Game Elements**: High contrast against background
- **UI Elements**: Medium contrast, clear boundaries
- **Text**: High contrast for readability
- **Interactive Elements**: Clear state differentiation

## Illustration Style

### Core Principles
- **Simple Shapes**: Clean, recognizable silhouettes
- **Bold Outlines**: Clear definition against background
- **Limited Colors**: 3-4 colors per element max
- **Soft Shadows**: Depth without harshness
- **Personality**: Each element has character

### Tower Design Rules
- **Progressive Detail**: More detail at higher levels
- **Clear Personality**: Each tower type unique
- **Level Indication**: Obvious visual progression
- **Animation Ready**: Designed for movement
- **Color Coded**: Instantly recognizable type

### Enemy Design Rules
- **Unique Silhouettes**: Clear shape differentiation
- **Role Indication**: Color suggests behavior
- **Health Scaling**: Size indicates toughness
- **Animation Loops**: Smooth, predictable movement
- **Weakness Hints**: Visual clues for targeting

## Animation Standards

### Timing
- **Fast Interactions**: 150ms (button clicks)
- **Normal Transitions**: 300ms (UI changes)
- **Slow Effects**: 600ms (merge animations)
- **Game Events**: 800ms (explosions, death)

### Easing
- **Bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (playful)
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)` (natural)
- **Elastic**: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (exciting)

### Animation Principles
- **Anticipation**: Prepare user for action
- **Follow Through**: Complete natural motion
- **Squash & Stretch**: Dynamic movement
- **Secondary Action**: Environmental response
- **Exaggeration**: Enhanced feedback

## Layout & Spacing

### Grid System
- **Base Grid**: 8px
- **Game Grid**: 80px cells (5x9 layout)
- **UI Grid**: 4-column layout, 12-column max
- **Max Width**: 1200px (desktop)

### Spacing Scale
- **Micro**: 2px-6px (tight spacing)
- **Small**: 8px-16px (element spacing)
- **Medium**: 20px-32px (component spacing)
- **Large**: 40px-64px (section spacing)
- **Extra Large**: 80px+ (page spacing)

### Component Sizes
- **Towers**: 64x64px
- **Enemies**: 32x32px
- **Projectiles**: 8x8px
- **UI Buttons**: 32px height, variable width
- **Icons**: 16x16px, 24x24px, 32x32px

## Feedback & States

### Interactive States
- **Default**: Soft shadows, normal colors
- **Hover**: Scale up 5%, brighter colors
- **Active**: Scale down 5%, deeper shadows
- **Disabled**: Reduced opacity (50%), muted colors
- **Loading**: Subtle animation, reduced interactivity

### Game Feedback
- **Success**: Green glow, bounce animation
- **Error**: Red shake, fade effect
- **Warning**: Orange pulse, attention grab
- **Info**: Blue highlight, tooltip

### Visual Effects
- **Glow**: Soft edge glow for important elements
- **Shake**: Quick vibration for errors/impacts
- **Bounce**: Upward movement for rewards
- **Pulse**: Rhythmic scaling for attention
- **Sparkle**: Particle effects for special events

## Accessibility Standards

### Color Contrast
- **WCAG AA**: 4.5:1 minimum contrast
- **Large Text**: 3:1 minimum contrast
- **Interactive Elements**: High contrast required
- **Color Blind Friendly**: Not color-dependent

### Text Readability
- **Minimum Size**: 12px for body text
- **Line Height**: 1.2-1.4 for readability
- **Font Weight**: 400 minimum, 500 for emphasis
- **Anti-aliasing**: Smooth text rendering

### Focus States
- **Clear Indication**: Visible focus rings
- **Keyboard Navigation**: All elements reachable
- **Screen Reader**: Semantic HTML structure
- **Alternative Text**: Descriptive alt attributes

## Performance Guidelines

### Asset Optimization
- **Sprite Size**: Under 50KB per file
- **Format Choice**: PNG-8 for simple, WebP for complex
- **Compression**: Lossless for sprites, lossy for backgrounds
- **Dimensions**: Exactly match display size

### Animation Performance
- **Frame Rate**: 60 FPS target
- **Complexity**: Limit concurrent animations
- **Transforms**: Use CSS transforms over position
- **GPU Acceleration**: Promote animations to GPU

### Loading Performance
- **Initial Load**: Under 3 seconds
- **Asset Bundling**: Group related assets
- **Lazy Loading**: Load by level/need
- **Caching**: Proper cache headers

## Quality Assurance

### Visual Checklist
- [ ] Colors match design tokens
- [ ] Typography follows hierarchy
- [ ] Spacing aligns to grid
- [ ] Animations are smooth
- [ ] Interactive states are clear
- [ ] Contrast meets accessibility standards

### Functional Checklist
- [ ] All states implemented
- [ ] Responsive design works
- [ ] Performance targets met
- [ ] Cross-browser compatible
- [ ] Accessibility guidelines followed

### Asset Checklist
- [ ] Naming conventions followed
- [ ] File sizes within limits
- [ ] Formats optimized correctly
- [ ] Transparency applied properly
- [ ] Versions properly labeled

## Examples

### Good Design
```
✅ Tower with clear color coding and level progression
✅ Enemy with unique silhouette and role indication
✅ Button with clear hover/active states
✅ Panel with proper spacing and readability
✅ Animation with appropriate timing and easing
```

### Bad Design
```
❌ Element without clear visual hierarchy
❌ Colors that don't follow token system
❌ Animation that's too fast or slow
❌ Text that's hard to read
❌ Inconsistent spacing or sizing
```

## Evolution Plan

### Phase 1: Foundation (Days 1-7)
- Core color system
- Basic typography
- Essential components

### Phase 2: Enhancement (Days 8-15)
- Advanced animations
- Visual effects
- Performance optimization

### Phase 3: Refinement (Post-launch)
- Player feedback integration
- Visual polish improvements
- Additional asset variations

---

*Last Updated: Day 1 of 15-day implementation*
*Next Review: Day 7 checkpoint*