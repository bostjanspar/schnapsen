# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this Schnapsen card game repository.

## Commands

- **Run development server:** `npm start`
- **Run development server externally:** `npm run startE` (accessible from network)
- **Build for production:** `npm run build`
- **Watch for changes and build:** `npm run watch`
- **Run tests:** `npm run test`

## Architecture

This is an **Angular 20** application using standalone components and modern patterns, combined with **Three.js 0.178** for 3D graphics rendering.

### Directory Structure
```
src/app/
├── app.ts                    # Main application component (standalone)
├── logic/                    # Game logic and business rules
│   ├── game-logic.ts        # Core game mechanics
│   ├── schnapsen.rules.ts   # Game rules and constants
│   └── random.service.ts    # Randomization service
├── gui/                      # 3D graphics and UI components
│   ├── scenes/              # Three.js scenes
│   │   ├── game/           # Main game scene
│   │   ├── startup/        # Startup screen
│   │   └── select-dealer/  # Dealer selection
│   ├── services/           # Three.js services
│   └── utils/              # Three.js utilities
├── sm/                      # State machine architecture
│   ├── game/               # Game-specific states
│   └── base-state.ts       # Base state class
└── events/                  # Event system
```

### Key Architectural Patterns

**State Machine Architecture:**
- Hierarchical state machines manage game flow
- States handle transitions and game logic
- Clear separation between GUI states and game logic states
- Event-driven communication between components

**Three.js Integration:**
- Service-based Three.js management (`ThreeService`)
- Scene-based architecture with `BaseScene` inheritance
- Performance optimizations: frame rate throttling, visibility detection
- Material and geometry caching in `MaterialFactory`

**Modern Angular Patterns:**
- Standalone components (no NgModules)
- Signal-based reactive patterns where applicable
- Dependency injection with providedIn: 'root'
- OnPush change detection strategy for performance

## Game-Specific Features

### Schnapsen Game Implementation
- **Card Management**: 20-card deck (Ace, Ten, King, Queen, Jack in 4 suits)
- **Game Flow**: Dealer selection → Card dealing → Trick-taking → Scoring
- **Rules Engine**: Complete Schnapsen rules implementation in `schnapsen.rules.ts`
- **State Management**: BehaviorSubject-based state in `GameLogic`

### 3D Visualization
- **Card Rendering**: 3D card meshes with proper textures
- **Animations**: Card dealing, trick-taking, and UI transitions
- **Interaction**: Mouse-based card selection and hover effects
- **Text Rendering**: Canvas-based text for labels and scores

## Angular 20+ Best Practices

### Signal-Based Patterns
```typescript
// Use signals for reactive state management
protected readonly gameState = signal<GameState>('waiting');
protected readonly playerScore = signal(0);

// Use computed for derived state
protected readonly canStartGame = computed(() =>
  this.gameState() === 'waiting' && this.players().length === 2
);

// Use effect for side effects
constructor() {
  effect(() => {
    console.log('Game state changed:', this.gameState());
  });
}
```

### Performance Optimization
- Use `ChangeDetectionStrategy.OnPush` for all components
- Implement proper cleanup in `ngOnDestroy`
- Use `trackBy` functions for all `*ngFor` loops
- Leverage signals to minimize change detection cycles

### Component Testing
```typescript
// Test signal-based components
it('should update score correctly', () => {
  component.playerScore.set(10);
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('10');
});
```

## Three.js Best Practices

### Performance (Already Implemented)
- ✅ Pixel ratio limiting: `Math.min(window.devicePixelRatio, 2)`
- ✅ Antialiasing disabled: `antialias: false`
- ✅ High-performance preference: `powerPreference: "high-performance"`
- ✅ Frame rate throttling: Background tabs run at 15 FPS
- ✅ Conditional rendering based on visibility

### Memory Management
- Materials and geometries are cached in `MaterialFactory`
- Always call `dispose()` on Three.js objects when cleaning up
- Use `renderer.info.memory` to monitor geometry/texture counts
- Implement proper cleanup in scene destruction

### Animation Patterns
- Use requestAnimationFrame at the end of render loop
- Implement frame rate throttling for performance
- Clean up animations when scenes are destroyed

## Testing

### Jest Configuration
- Uses `@angular-builders/jest` for Angular integration
- Tests are located in the `tests/` directory
- Component testing with signal patterns
- Service testing with dependency injection

### Testing Strategies
- **Unit Tests**: Test individual services and logic classes
- **Component Tests**: Test Three.js integration and user interactions
- **Integration Tests**: Test state machine transitions and game flow

## Internationalization

The application uses `@ngx-translate` for internationalization:
- Translation service is injected in components that need it
- Text service handles dynamic text creation for Three.js scenes
- Translations are loaded via HTTP loader

## Development Workflow

### Step-by-Step Development
1. Make changes to code
2. Run `npm run build` to ensure compilation
3. Test functionality with `npm start` or `npm run test`
4. Commit changes when working correctly

### Performance Monitoring
- Monitor frame rates in development
- Check memory usage with browser dev tools
- Use `renderer.info.memory` for Three.js object tracking
- Test on lower-end devices for performance optimization

## External Documentation with Context7 MCP

When working with external libraries, use the Context7 MCP tool to verify best practices:

- **Angular**: Use library ID `/angular/angular` for latest framework documentation
- **Three.js**: Use library ID `/mrdoob/three.js` for 3D graphics best practices
- **Performance topics**: Use topics like "best practices performance", "memory management disposal"

Example usage:
- Verify Angular signal patterns and component architecture
- Check Three.js material performance and memory disposal patterns
- Validate animation and rendering optimization techniques

