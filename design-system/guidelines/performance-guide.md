# Performance Budget Guidelines

## Overview
Performance-first approach ensuring smooth gameplay (60 FPS) with fast loading times while maintaining vibrant cartoon aesthetic.

## Budget Allocations

### Total Asset Budget: 2MB Maximum
```
├── Tower Sprites: 800KB (9 sprites × ~90KB each)
├── Enemy Sprites: 400KB (4 sprites × ~100KB each)  
├── UI Elements: 300KB (buttons, panels, icons)
├── Effects: 200KB (particles, animations)
├── Sounds: 200KB (compressed audio files)
└── Environment: 100KB (backgrounds, props)
```

### Individual Asset Limits
```
Tower Sprites:     Max 90KB per sprite (64x64px)
Enemy Sprites:     Max 100KB per sprite (32x32px)
UI Elements:       Max 20KB per element
Effects:           Max 50KB per effect
Sounds:            Max 30KB per sound effect
Backgrounds:       Max 80KB per background
```

## Loading Performance Targets

### Critical Loading Times
- **Initial Load**: < 3 seconds (core assets)
- **Level Loading**: < 1 second (level-specific assets)
- **Asset Swapping**: < 100ms (hot-reloading during dev)
- **UI Transitions**: < 150ms (panel opening/closing)

### Memory Usage Budgets
- **Total Memory**: < 100MB (all assets loaded)
- **VRAM Usage**: < 50MB (GPU textures)
- **CPU Memory**: < 50MB (game objects, buffers)
- **Audio Memory**: < 10MB (sound buffers)

### Frame Rate Requirements
- **Target FPS**: 60 FPS (16.67ms per frame)
- **Minimum FPS**: 30 FPS (33.33ms per frame)
- **Frame Budget**: 10ms for game logic, 6ms for rendering
- **Drops Allowed**: Max 5% of frames below 30 FPS

## Asset Optimization Rules

### Image Optimization
#### Format Selection
- **Simple Sprites**: PNG-8 (max 256 colors)
- **Complex Sprites**: WebP (lossy compression)
- **Icons**: SVG (vector, scalable)
- **Backgrounds**: JPEG (photo-like quality)

#### Compression Settings
```
PNG-8:
├── Colors: 256 maximum
├── Dithering: Enabled
├── Compression: Maximum
└── Transparency: Alpha channel

WebP:
├── Quality: 75-85%
├── Method: 6 (balanced)
├── Preprocessing: Enabled
└── Transparency: Alpha channel

JPEG:
├── Quality: 80-90%
├── Optimized: True
├── Progressive: False
└── Chroma: 4:2:0
```

#### Sizing Rules
- **Exact Match**: Asset size = display size
- **No Upscaling**: Create larger assets, not scaled up
- **Power of 2**: 64x64, 32x32, 16x16 when possible
- **Mipmap Generation**: For textures that scale

### Audio Optimization
#### Format Selection
- **Sound Effects**: MP3 (128kbps, mono)
- **Music**: MP3 (192kbps, stereo)
- **Voice**: MP3 (96kbps, mono)
- **Compression: VBR (Variable Bitrate)

#### Length Limits
```
Sound Effects: Max 2 seconds
Looping Music: 30-120 seconds
UI Sounds: Max 0.5 seconds
Ambient Sounds: Max 10 seconds
```

### Animation Optimization
#### Frame Limits
```
Tower Idle: 4-8 frames
Tower Attack: 4-6 frames
Enemy Walk: 4-6 frames
Effects: 8-16 frames
UI Animations: 2-4 frames
```

#### Timing Rules
- **Game Animations**: 12-15 FPS (performance > smoothness)
- **UI Animations**: 30-60 FPS (smoothness critical)
- **Particle Effects**: 30 FPS (visual appeal)
- **Background Elements**: 8-12 FPS (ambient)

## Loading Strategy

### Priority Order
1. **Critical Path** (First 1 second):
   - Core UI elements
   - Basic tower sprites
   - Game grid rendering

2. **Important** (Next 1 second):
   - Enemy sprites
   - Sound effects
   - Interactive elements

3. **Nice to Have** (Final 1 second):
   - Backgrounds
   - Music
   - Particle effects

### Asset Bundling Strategy
```
Core Bundle (1.2MB):
├── Tower sprites (600KB)
├── UI elements (300KB)
├── Enemy sprites (300KB)

Effects Bundle (500KB):
├── Particle effects (200KB)
├── Sound effects (200KB)
├── Additional sprites (100KB)

Background Bundle (300KB):
├── Level backgrounds (200KB)
├── Environment props (100KB)
```

### Progressive Loading
- **Initial Screen**: Load core bundle
- **Level Start**: Load level-specific assets
- **During Gameplay**: Load next level in background
- **Low Memory**: Unload distant assets

## Performance Monitoring

### Key Metrics
```
Loading Performance:
├── First Contentful Paint: < 1.5s
├── Time to Interactive: < 3s
├── Largest Contentful Paint: < 2s
└── Cumulative Layout Shift: < 0.1

Runtime Performance:
├── Frame Rate: 60 FPS target, 30 FPS minimum
├── Script Time: < 10ms per frame
├── Render Time: < 6ms per frame
└── Memory Usage: < 100MB total

Asset Performance:
├── Asset Load Time: < 100ms average
├── Compression Ratio: 70-80% size reduction
├── Bundle Size: Within 2MB budget
└── Cache Hit Rate: > 80%
```

### Monitoring Tools
- **Chrome DevTools**: Performance profiling
- **Lighthouse**: Loading performance analysis
- **Webpack Bundle Analyzer**: Bundle size analysis
- **Memory Profiler**: Memory usage tracking

## Device Compatibility

### Target Device Specifications
```
Minimum Requirements:
├── CPU: Mobile-class processor
├── GPU: Integrated graphics
├── RAM: 4GB
├── Storage: 500MB free space
└── Network: 3G internet connection

Recommended Requirements:
├── CPU: Desktop-class processor
├── GPU: Dedicated graphics
├── RAM: 8GB
├── Storage: 1GB free space
└── Network: 4G/LTE internet
```

### Responsive Performance
- **Mobile**: 30 FPS target, reduced effects
- **Tablet**: 45 FPS target, medium effects
- **Desktop**: 60 FPS target, full effects

## Quality Assurance Checklist

### Performance Testing
```
Before Release:
├── [ ] Bundle size under 2MB
├── [ ] Initial load under 3 seconds
├── [ ] 60 FPS maintained with 100+ enemies
├── [ ] Memory usage under 100MB
├── [ ] All devices tested (mobile, tablet, desktop)

Asset Validation:
├── [ ] All images properly compressed
├── [ ] Audio files optimized
├── [ ] Animation frames within limits
├── [ ] Formats appropriate for content
├── [ ] File sizes within budget

Cross-Browser Testing:
├── [ ] Chrome (latest) performance OK
├── [ ] Firefox (latest) performance OK
├── [ ] Safari (latest) performance OK
├── [ ] Edge (latest) performance OK
├── [ ] Mobile browsers performance OK
```

### Optimization Techniques
```
Image Optimization:
├── [ ] Use appropriate format (PNG-8, WebP, JPEG)
├── [ ] Optimize color palettes
├── [ ] Remove unnecessary metadata
├── [ ] Implement lazy loading
└── [ ] Use image spritesheets

Animation Optimization:
├── [ ] Limit frame counts
├── [ ] Use CSS transforms
├── [ ] Implement object pooling
├── [ ] Cache animation states
└── [ ] Use GPU acceleration

Loading Optimization:
├── [ ] Bundle related assets
├── [ ] Implement progressive loading
├── [ ] Use appropriate compression
├── [ ] Set proper cache headers
└── [ ] Preload critical assets
```

## Emergency Procedures

### Performance Issues
```
If FPS drops below 30:
1. Check memory usage - reduce loaded assets
2. Limit concurrent animations
3. Reduce particle effects
4. Lower texture quality
5. Implement frame skipping

If loading exceeds 3 seconds:
1. Reduce initial bundle size
2. Increase compression
3. Implement placeholder loading
4. Add loading animation
5. Consider CDN distribution

If memory exceeds 100MB:
1. Implement asset pooling
2. Remove unused assets
3. Compress textures
4. Reduce audio quality
5. Implement garbage collection
```

### Continuous Monitoring
- **Real-time Monitoring**: FPS counter, memory usage
- **Analytics Tracking**: Loading times, error rates
- **User Feedback**: Performance complaints, device issues
- **Regular Audits**: Weekly performance checks

---

*Performance Budget: 2MB Total*
*Target: 60 FPS, <3s Loading*
*Last Updated: Day 1 Implementation*