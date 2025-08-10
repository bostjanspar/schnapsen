# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run development server:** `npm start`
- **Build for production:** `npm run build`
- **Watch for changes and build:** `npm run watch`

## Architecture

This is an Angular application.

- The main application files are located in `src/app/`.
- The application uses Three.js for 3D graphics. All GUI-related code should be placed within `src/app/gui`.
- All state machine logic, including states and managers, resides in `src/app/sm`.
- Application routing is configured in `src/app/app.routes.ts`.

## Testing

- This project uses the Jest framework for unit testing.
- All tests are located in the `tests/` directory.
- Run tests with the `npm run test` command.

## Development Workflow

- When implementing features or fixes, adopt a step-by-step approach. After each step, run `npm run build` to ensure the project compiles without errors before proceeding.

## External Documentation with Context7 MCP

When working with external libraries like Three.js, use the Context7 MCP tool to verify best practices and documentation:

- To verify Three.js documentation and best practices, use the Context7 tool with library ID `/mrdoob/three.js`
- For performance-related queries, use topic "best practices performance"
- For memory management queries, use topic "memory management disposal"

Example usage:
- Verify Three.js animation patterns and performance
- Check material performance hierarchy (MeshBasicMaterial being fastest)
- Validate memory disposal patterns for geometries, materials, and textures

## Three.js Best Practices

When working with Three.js code in this project, follow these best practices:

### Performance
- Use MeshBasicMaterial when possible for best performance
- Limit pixel ratio to reduce GPU load (`Math.min(window.devicePixelRatio, 2)`)
- Disable antialiasing for better performance (`antialias: false`)
- Use high-performance power preference (`powerPreference: "high-performance"`)
- Implement frame rate throttling for background tabs
- Only render when needed (conditional rendering based on active tweens)

### Memory Management
- Materials and geometries are cached in MaterialFactory to prevent unnecessary recreation
- Always check for dispose() methods on Three.js objects when cleaning up
- Use proper disposal patterns for geometries, materials, and textures when no longer needed
- Call geometry.dispose() to free WebGL buffers when geometries are no longer needed
- Call material.dispose() to free shader programs when materials are no longer needed
- Call texture.dispose() to free WebGL textures when textures are no longer needed
- Check renderer.info.memory to monitor geometry and texture counts for potential memory leaks
- For complex scenes, consider implementing a ResourceTracker pattern to automatically manage disposal

### Animation
- Use TWEEN.js for animations with proper update calls
- Place requestAnimationFrame at the end of the render loop
- Clean up tweens when no longer needed

## Git Workflow

- Never run any `git` commands. I will control all git operations manually.