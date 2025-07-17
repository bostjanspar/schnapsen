# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run development server:** `npm start`
- **Build for production:** `npm run build`
- **Watch for changes and build:** `npm run watch`
- **Run tests:** `npm run test`

## Architecture

This is an Angular application.

- The main application files are located in `src/app/`.
- The application uses Three.js for 3D graphics, with the relevant component at `src/app/gui/three-scene/`.
- Application routing is configured in `src/app/app.routes.ts`.
