# Enhanced Development Workflow Guide

## Metadata

- **Author**: Development Team
- **Date Created**: 2026-01-11
- **Last Updated**: 2026-01-11
- **Status**: Approved
- **Level**: Intermediate

## 1. Enhanced Development Tools

### Vite Configuration Optimizations

- **Environment-based configs**: Separate settings for development and production
- **Code splitting**: Optimized chunks for game assets, vendor libraries
- **Bundle analysis**: Visualize bundle sizes and dependencies
- **HMR improvements**: Better hot module replacement for game assets

### ESLint Enhancement

- **Game-specific rules**: Magic numbers, performance patterns
- **TypeScript strictness**: Better type safety enforcement
- **Production safeguards**: Prevent console/debugger in production builds

### Vitest Configuration

- **Comprehensive mocking**: Phaser.js, Howler.js, Canvas API
- **Coverage thresholds**: 70% minimum coverage across all metrics
- **Performance testing**: Test execution time limits

## 2. Development Workflow

### Pre-commit Quality Gates

- **Automatic linting**: ESLint fixes applied on commit
- **Code formatting**: Prettier ensures consistent style
- **Pre-push validation**: Tests and type checking must pass

### Bundle Analysis

```bash
# Analyze production build
npm run build:analyze

# View bundle composition
npm run analyze
```

### Testing Workflow

```bash
# Run tests with coverage
npm run test:coverage

# Interactive test UI
npm run test:ui

# Debug specific tests
npm run test -- --grep "TowerSystem"
```

## 3. VS Code Integration

### Debug Configurations

- **Development server**: Debug React and Vite hot reload
- **Test debugging**: Step through Vitest tests
- **Build debugging**: Analyze build process issues

### Workspace Features

- **Auto formatting**: Code formatted on save
- **Import organization**: Automatic import sorting
- **Type checking**: Real-time TypeScript validation

## 4. Performance Monitoring

### Bundle Optimization

- **Asset chunking**: Separate vendor, game, and asset chunks
- **Compression**: Gzip analysis for production builds
- **Size limits**: Warning for chunks exceeding 1MB

### Build Performance

- **Type checking**: Parallel TypeScript compilation
- **Dependency optimization**: Pre-bundled for faster dev startup
- **Cache management**: Clean build artifacts with `npm run clean`

## 5. Quality Assurance

### Code Coverage

- **Unit tests**: Core game logic and utilities
- **Integration tests**: React-Phaser communication
- **Mocking strategy**: Comprehensive API mocking

### Type Safety

- **Strict TypeScript**: Null checks, explicit returns
- **Path aliases**: Clean import structure
- **Development globals**: Environment-specific typing

## 6. Troubleshooting

### Common Issues

- **Build failures**: Check TypeScript types first
- **Test failures**: Verify mock configurations
- **HMR issues**: Clear cache with `npm run clean`

### Performance Issues

- **Bundle size**: Use analyzer to identify large dependencies
- **Build time**: Optimize dependency pre-bundling
- **Dev server**: Check for large asset files

## 7. Best Practices

### Development

- **Commit often**: Small, focused changes
- **Test early**: Write tests alongside features
- **Monitor performance**: Regular bundle analysis

### Code Organization

- **Path aliases**: Use consistent import paths
- **Component structure**: Separate game logic from UI
- **Type definitions**: Maintain comprehensive type safety

### Git Workflow

- **Branch strategy**: Feature branches for development
- **Quality gates**: Pre-commit hooks prevent broken code
- **Review process**: Automated checks + manual review

## 8. Advanced Configuration

### Environment Variables

```typescript
// Available in build process
__DEV__: boolean; // Development mode
__PROD__: boolean; // Production mode
```

### Custom Scripts

- `npm run dev:debug`: Development with enhanced logging
- `npm run build:analyze`: Build with bundle analysis
- `npm run clean`: Remove build artifacts and cache

### Bundle Analysis

- **Interactive visualization**: HTML report with treemap
- **Dependency graph**: Identify optimization opportunities
- **Gzip analysis**: Real-world size estimates

## 9. Integration Checklist

### Setup Verification

- [ ] Dependencies installed: `npm install`
- [ ] Git hooks configured: `npm run prepare`
- [ ] VS Code extensions installed
- [ ] Development server starts: `npm run dev`
- [ ] Tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] Type checking passes: `npm run type-check`

### Ongoing Maintenance

- [ ] Regular dependency updates
- [ ] Bundle size monitoring
- [ ] Test coverage maintenance
- [ ] Performance regression testing
- [ ] Documentation updates

---

_This guide complements the main Developer Setup Guide with advanced workflow configurations._
