import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Card } from '../../../../logic/schnapsen.rules';
import { GameConstants } from '../../../../logic/game.constants';
import { CardLayout } from '../cards/card-layout';

export class CardDealAnimation {
  animateCardDeal(card: THREE.Mesh, isPlayer: boolean, toPos: THREE.Vector3, delay: number, onComplete: () => void = () => {}): void {
    const fromPos = card.position.clone();

    // Set initial rotation based on card type
    // The card textures are already set correctly in cardManager.createCard()
    // - For opponent cards (isPlayer = false): created with faceUp = false, so front shows back texture
    // - For player cards (isPlayer = true): created with faceUp = true, so front shows face texture
    // 
    // According to requirements: "never rotate opponentHand cards, but rotate player card"
    // This means:
    // - Opponent cards should always show their front face (which has the back texture)
    // - Player cards should always show their front face (which has the face texture)
    card.rotation.y = 0; // No rotation for both player and opponent cards

    new TWEEN.Tween({ val: 0 })
      .to({ val: 1 }, 500)
      .delay(delay)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        card.position.lerpVectors(fromPos, toPos, obj.val);
      })
      .onComplete(onComplete)
      .start();
  }

  calculateTargetPosition(
    isPlayer: boolean, 
    cardIndex: number, 
    playerHandLength: number, 
    opponentHandLength: number
  ): THREE.Vector3 {
    const playerHandPositions = CardLayout.calculateHandPositions(playerHandLength);
    const opponentHandPositions = CardLayout.calculateHandPositions(opponentHandLength, 0.05); // Use 0.05 spacing for opponent
    
    if (isPlayer) {
      // Player cards at bottom
      return new THREE.Vector3(
        playerHandPositions[cardIndex].x, 
        playerHandPositions[cardIndex].y, 
        playerHandPositions[cardIndex].z
      );
    } else {
      // Opponent cards at top (y + 5.5)
      return new THREE.Vector3(
        opponentHandPositions[cardIndex].x, 
        opponentHandPositions[cardIndex].y + 5.5, 
        opponentHandPositions[cardIndex].z
      );
    }
  }

  createDealOrder(
    playerHand: Card[], 
    opponentHand: Card[]
  ): Array<{ isPlayer: boolean; hand: Card[]; cardIndex: number }> {
    return [
      // First 3 cards
      { isPlayer: false, hand: opponentHand, cardIndex: 0 },
      { isPlayer: true, hand: playerHand, cardIndex: 0 },
      { isPlayer: false, hand: opponentHand, cardIndex: 1 },
      { isPlayer: true, hand: playerHand, cardIndex: 1 },
      { isPlayer: false, hand: opponentHand, cardIndex: 2 },
      { isPlayer: true, hand: playerHand, cardIndex: 2 },
      // Next 2 cards
      { isPlayer: false, hand: opponentHand, cardIndex: 3 },
      { isPlayer: true, hand: playerHand, cardIndex: 3 },
      { isPlayer: false, hand: opponentHand, cardIndex: 4 },
      { isPlayer: true, hand: playerHand, cardIndex: 4 },
    ];
  }

  getDeckPosition(): THREE.Vector3 {
    return new THREE.Vector3(
      GameConstants.DECK_LAYOUT.position.x, 
      GameConstants.DECK_LAYOUT.position.y, 
      GameConstants.DECK_LAYOUT.position.z
    );
  }

  getTrumpPosition(): THREE.Vector3 {
    return new THREE.Vector3(
      GameConstants.TALON_LAYOUT.position.x + 1, 
      GameConstants.TALON_LAYOUT.position.y, 
      GameConstants.TALON_LAYOUT.position.z - 0.1
    );
  }

  getTalonPosition(): THREE.Vector3 {
    return new THREE.Vector3(
      GameConstants.TALON_LAYOUT.position.x, 
      GameConstants.TALON_LAYOUT.position.y, 
      GameConstants.TALON_LAYOUT.position.z
    );
  }
}