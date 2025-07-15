Detailed Plan for Schnapsen Implementation with Angular and Three.js
Core Principles
Strict Separation: Game logic and GUI logic are isolated. Game logic handles rules/state; GUI handles rendering/animation.

Communication: Game logic triggers GUI actions via events. GUI uses callbacks to notify completion.

State Machine: Game logic drives state transitions. GUI reflects state visually.

Phase 1: Game Logic (State Machine)
Card/Deck Models

Define Card class (suit, rank, value, isTrump).

Define Deck class (generate 20-card deck, shuffle, deal).

Game State

Create GameState class tracking:

Players (hands, won tricks, points).

Talon (cards, closed status, trump visibility).

Current trick (cards played, leader).

Phase (1: talon available, 2: talon closed/exhausted).

Turn owner (non-dealer/dealer).

Rules Engine

Implement RulesService with methods:

validateMove(card): Checks Phase 2 constraints (follow suit, trumping).

resolveTrick(): Determines winner via suit/trump hierarchy.

processSpecialAction(action): Handles marriages, Jack exchange, closing talon.

calculatePoints(): Tallies card/marriage points for claims.

checkWinConditions(): Validates "66" claims/Schneider/Schwarz.

State Machine

Create GameEngine with:

States: INIT, PLAY_TALON_OPEN, PLAY_TALON_CLOSED, TRICK_RESOLUTION, HAND_END.

Transitions triggered by actions (play card, close talon, claim 66).

Event emitters (e.g., cardPlayed$, talonClosed$) to notify GUI.

Phase 2: GUI (Angular + Three.js)
Scene Setup

Three.js Service: Initialize scene, camera, lights, renderer in GameSceneService.

Card Meshes: Preload textures for card faces/backs. Create CardObject class extending Mesh with suit/rank data.

Angular Components

GameBoardComponent: Hosts Three.js canvas.

PlayerHandComponent: Renders player's cards as clickable 3D objects.

TalonComponent: Visualizes talon stack with trump card (crosswise placement).

TrickAreaComponent: Displays current trick cards.

User Input Handling

Map card clicks to GameEngine actions (e.g., playCard(card)).

Disable inputs during animations/AI turns.

Animation System

Animation Queue: Process animations sequentially (e.g., play card → resolve trick → draw talon).

Tweening: Use gsap or Three.js animations for:

Moving cards to trick area.

Flipping cards (marriage reveal).

Drawing talon cards.

Callback System: Invoke onAnimationComplete() to resume game logic.