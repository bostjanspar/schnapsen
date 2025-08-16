import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Card } from '../../../../logic/schnapsen.rules';
import { GameConstants } from '../../../../logic/game.constants';
import { CardLayout } from '../cards/card-layout';
import { BaseAnimation } from './base.animation';
import { GameScene } from '../game.scene';
import { HandSortAnimation } from './hand-sort.animation';

export class CardDealAnimation extends BaseAnimation {
  constructor(scene: GameScene) {
    super(scene);
  }

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

  /**
   * Animate the entire deal process
   * @param playerHand The player's cards
   * @param opponentHand The opponent's cards
   * @param trumpCard The trump card
   * @param talon The remaining cards in the talon
   * @param onComplete Callback when the entire deal animation is complete
   */
  animateCompleteDeal(
    playerHand: Card[],
    opponentHand: Card[],
    trumpCard: Card | null,
    talon: Card[],
    onComplete: () => void = () => {}
  ): void {
    const dealOrder = this.createDealOrder(playerHand, opponentHand);
    const deckPosition = this.getDeckPosition();
    let animationDelay = 0;
    const animationStepDelay = 200;
    let completedAnimations = 0;
    const totalAnimations = dealOrder.length + (trumpCard ? 1 : 0) + (talon.length > 0 ? 1 : 0);

    // Helper function to track completion
    const checkCompletion = () => {
      completedAnimations++;
      if (completedAnimations === totalAnimations) {
        // After all deal animations are complete, sort the player's hand
        const handSortAnimation = new HandSortAnimation(this.scene);
        handSortAnimation.sortPlayerHand(onComplete);
      }
    };

    // Animate cards
    dealOrder.forEach((deal) => {
      const card = deal.hand[deal.cardIndex];
      // Create cards with correct face orientation:
      // - Opponent cards: always face down (false) - back texture shown
      // - Player cards: always face up (true) - face texture shown
      const cardMesh = this.scene.cardManager.createCard(card, deal.isPlayer);
      cardMesh.position.copy(deckPosition);
      this.scene.add(cardMesh);

      // Calculate correct positions based on the displayHands method
      const targetPosition = this.calculateTargetPosition(
        deal.isPlayer,
        deal.cardIndex,
        playerHand.length,
        opponentHand.length
      );

      this.animateCardDeal(cardMesh, deal.isPlayer, targetPosition, animationDelay, () => {
        const targetGroup = deal.isPlayer ? this.scene.playerHandGroup : this.scene.opponentHandGroup;
        targetGroup.add(cardMesh);
        checkCompletion();
      });
      animationDelay += animationStepDelay;
    });

    // Animate trump card
    if (trumpCard) {
      // Trump card should be face up (player can see it)
      const trumpMesh = this.scene.cardManager.createCard(trumpCard, true);
      trumpMesh.position.copy(deckPosition);
      this.scene.add(trumpMesh);
      
      const trumpPosition = this.getTrumpPosition();

      this.animateCardDeal(trumpMesh, true, trumpPosition, animationDelay, () => {
        // Use a public method or direct property access pattern
        (this.scene as any).trumpCardMesh = trumpMesh;
        this.scene.talonGroup.add(trumpMesh);
        trumpMesh.rotateZ(-Math.PI/2);
        checkCompletion();
      });
      animationDelay += animationStepDelay;
    }

    // Animate talon
    if (talon.length > 0) {
      // Talon card should be face down (player cannot see it)
      const talonStack = this.scene.cardManager.createCard(talon[0], false);
      talonStack.position.copy(deckPosition);
      this.scene.add(talonStack);
      
      const talonPosition = this.getTalonPosition();

      this.animateCardDeal(talonStack, false, talonPosition, animationDelay, () => {
        this.scene.talonGroup.add(talonStack);
        this.scene.displayHands(playerHand, opponentHand);
        this.scene['updateTalonDisplay'](talon);
        if (trumpCard) {
          this.scene['updateTrumpCardDisplay'](trumpCard);
        }
        // The hand sorting will be called after all deal animations are complete
        checkCompletion();
      });
    }
    
    // Handle case where there are no deal animations
    if (totalAnimations === 0) {
      const handSortAnimation = new HandSortAnimation(this.scene);
      handSortAnimation.sortPlayerHand(onComplete);
    }
  }
}