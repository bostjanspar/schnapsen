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
