
# Gemini Code Assistant Project-Specific Instructions

This document provides project-specific instructions and guidelines for the Gemini Code Assistant to ensure it can effectively and safely assist with development tasks in this Angular project.

## About the Project

This project is a web-based card game called "Schnapsen," built with Angular.

## Core Commands

When asked to perform common development tasks, use the following npm scripts defined in `package.json`:

-   **Run development server:** `npm run start`
-   **Build for production:** `npm run build`
-   **Run tests:** `npm run test`
-   **Watch for changes and build:** `npm run watch`

## Angular CLI (`ng`)

For Angular-specific tasks like generating components, services, or other schematics, use the Angular CLI (`ng`).

-   **Generate a component:** `ng generate component <component-name>`
-   **Generate a service:** `ng generate service <service-name>`

## Coding Style and Conventions

-   **Code Style:** Follow the existing coding style found in the project. Pay attention to formatting, naming conventions, and commenting practices.
-   **Component Structure:** When generating new components, follow the standard Angular structure with separate files for HTML, CSS, and TypeScript.
-   **State Management:** For now, use basic component state and services for state management. If a more robust solution is needed, we can discuss implementing a state management library like NgRx or Akita.

## Dependencies

-   Before adding any new dependencies, please ask for confirmation.
-   Use `npm install <package-name>` to install new dependencies and `npm install` to install existing ones.

## Testing

-   When adding new features, please include corresponding unit tests.
-   Tests are written using Jest. Test files are located next to the source files with a `.spec.ts` extension.

## Git Workflow

do NOT do any git operation 

By following these guidelines, the Gemini Code Assistant can provide accurate, consistent, and helpful contributions to this project.