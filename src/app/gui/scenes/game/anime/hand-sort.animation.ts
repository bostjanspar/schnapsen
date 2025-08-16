import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Card } from '../../../../logic/schnapsen.rules';
import { CardLayout } from '../cards/card-layout';
import { BaseAnimation } from './base.animation';
import { GameScene } from '../game.scene';

export class HandSortAnimation extends BaseAnimation {
  constructor(scene: GameScene) {
    super(scene);
  }

  /**
   * Sort the player's hand with animations
   * @param onComplete Callback when sorting is complete
   */
  sortPlayerHand(onComplete: () => void = () => {}): void {
    // Get current positions of cards in player's hand
    const currentCards = [...this.scene.playerHandGroup.children];
    
    // Sort the hand in the game logic
    const sortedHand = this.scene['gameLogic'].sortPlayerHand();
    
    // Calculate new positions for sorted cards
    const newPositions = CardLayout.calculateHandPositions(sortedHand.length);
    
    // Create a mapping of card IDs to their new positions
    const cardIdToNewPosition: Record<string, THREE.Vector3> = {};
    sortedHand.forEach((card, index) => {
      cardIdToNewPosition[card.id] = new THREE.Vector3(
        newPositions[index].x,
        newPositions[index].y,
        newPositions[index].z
      );
    });
    
    // Find cards that need to change position
    const cardsToMove: { cardMesh: THREE.Object3D; targetPosition: THREE.Vector3 }[] = [];
    currentCards.forEach((cardMesh) => {
      const cardId = cardMesh.userData['card']?.id;
      if (cardId && cardIdToNewPosition[cardId]) {
        const targetPosition = cardIdToNewPosition[cardId];
        const currentPosition = cardMesh.position;
        
        // Check if card needs to move
        if (Math.abs(currentPosition.x - targetPosition.x) > 0.01 || 
            Math.abs(currentPosition.z - targetPosition.z) > 0.01) {
          cardsToMove.push({ cardMesh, targetPosition });
        }
      }
    });
    
    // Track completion
    let completedAnimations = 0;
    const totalAnimations = cardsToMove.length;
    
    const checkCompletion = () => {
      completedAnimations++;
      if (completedAnimations === totalAnimations) {
        onComplete();
      }
    };
    
    // Animate cards one by one
    const animationDuration = 300; // ms per card
    const delayBetweenAnimations = 100; // ms
    
    if (totalAnimations === 0) {
      onComplete();
      return;
    }
    
    cardsToMove.forEach(({ cardMesh, targetPosition }, index) => {
      // Adjust target position slightly upward
      const adjustedPosition = targetPosition.clone();
      adjustedPosition.y += 0.3;
      
      // Delay each animation
      setTimeout(() => {
        // First tween: move to adjusted position (slightly up)
        new TWEEN.Tween(cardMesh.position)
          .to(adjustedPosition, animationDuration / 2)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onComplete(() => {
            // Second tween: move down to final position
            new TWEEN.Tween(cardMesh.position)
              .to(targetPosition, animationDuration / 2)
              .easing(TWEEN.Easing.Quadratic.In)
              .onComplete(checkCompletion)
              .start();
          })
          .start();
      }, index * (animationDuration + delayBetweenAnimations));
    });
  }
}