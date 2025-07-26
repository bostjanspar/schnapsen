# Detailed Execution Plan: Select Dealer Scene

This document outlines the steps to create and integrate a new "Select Dealer" scene into the application.

## 1. Create New Scene File and Directory

1.  **Create Directory**: Create a new directory to house the scene files.
    ```bash
    mkdir -p src/app/gui/scenes/select-dealer
    ```

2.  **Create Scene File**: Create the new scene file `src/app/gui/scenes/select-dealer/select-dealer.scene.ts`.

3.  **Initial Scene Code**: Add the following code to the new file. This code defines the scene, displays a card, and shows an animated arrow indicating the dealer.

    ```typescript
    import * as THREE from 'three';
    import TWEEN from '@tweenjs/tween.js';
    import { BaseScene } from '../base.scene';
    import { Card, Suit } from '../../../logic/schnapsen.rules';
    import { CardManager } from '../game/cards/card-manager';
    import { GameAnimations } from '../game/interactions/game-animations';
    import { MaterialFactory } from '../../utils/material.factory';

    export class SelectDealerScene extends BaseScene {
      private cardManager!: CardManager;
      private dealerCard!: THREE.Mesh;
      private arrow!: THREE.Mesh;

      constructor() {
        super();
        this.background = new THREE.Color(0x1a4a3a);
      }

      public async initialize(dealerCardData: Card) {
        this.cardManager = new CardManager(this);
        await MaterialFactory.preloadAllMaterials();

        // Display the card
        this.dealerCard = this.cardManager.createCard(dealerCardData, true);
        this.dealerCard.position.set(0, 0, 0);
        this.add(this.dealerCard);

        // Determine dealer and show arrow
        const isPlayerOneDealer = dealerCardData.suit === Suit.Hearts || dealerCardData.suit === Suit.Diamonds;
        this.createArrow(isPlayerOneDealer);

        // Animate the arrow
        if (isPlayerOneDealer) {
          GameAnimations.animateArrowDown(this.arrow);
        } else {
          GameAnimations.animateArrowUp(this.arrow);
        }
      }

      private createArrow(isPlayerOneDealer: boolean) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.5);
        shape.lineTo(0.5, 0);
        shape.lineTo(0.2, 0);
        shape.lineTo(0.2, -0.5);
        shape.lineTo(-0.2, -0.5);
        shape.lineTo(-0.2, 0);
        shape.lineTo(-0.5, 0);
        shape.lineTo(0, 0.5);

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.arrow = new THREE.Mesh(geometry, material);
        this.arrow.position.set(0, isPlayerOneDealer ? -2 : 2, 0);
        this.add(this.arrow);
      }

      public update() {
        TWEEN.update();
      }
    }
    ```

## 2. Add Arrow Animations

1.  **Modify `game-animations.ts`**: Open `src/app/gui/scenes/game/interactions/game-animations.ts`.
2.  **Add Animation Functions**: Add the following static methods to the `GameAnimations` class.

    ```typescript
    static animateArrowUp(arrow: THREE.Mesh): void {
        const initialY = arrow.position.y;
        new TWEEN.Tween(arrow.position)
            .to({ y: initialY + 0.5 }, 500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    }

    static animateArrowDown(arrow: THREE.Mesh): void {
        const initialY = arrow.position.y;
        new TWEEN.Tween(arrow.position)
            .to({ y: initialY - 0.5 }, 500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    }
    ```

## 3. Integrate Scene into Game Flow (State Machine)

The new scene needs to be integrated into the game's startup sequence. This will be managed by the state machine.

1.  **Add New Game State**: In the file containing the game state definitions (likely `src/app/sm/game/game-state.enum.ts` or similar), add a new state for selecting the dealer.
    ```typescript
    export enum GameState {
      SELECT_DEALER,
      // ... other states
    }
    ```

2.  **Create a New State Class**: Create a new file for the `SelectDealerState` logic. This state will manage the scene's lifecycle.

3.  **Update State Machine**: Modify `src/app/sm/game/game-state-machine.ts` to:
    *   Set `SELECT_DEALER` as the initial state.
    *   Implement the logic within the `SelectDealerState` to show the `SelectDealerScene` via the `GameSceneController`.
    *   After a delay, transition from `SELECT_DEALER` to the next state (e.g., `DEALING_CARDS`).

4.  **Update Scene Controller**: Modify `src/app/gui/scenes/game/game-scene.controller.ts` to include a method for displaying the `SelectDealerScene` and passing the required card data to it.

This plan provides a comprehensive roadmap for implementing the feature.
