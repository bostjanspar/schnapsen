import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { GameConstants } from '../../../../logic/game.constants';

export class GameAnimations {
  private static lastUpdateTime: number = 0;
  private static animationPhase: number = 0;

  static animateCardDeal(card: THREE.Mesh, isPlayer: boolean, toPos: THREE.Vector3, delay: number, onComplete: () => void = () => {}): void {
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

  static animateCardPlay(card: THREE.Mesh, fromPos: any, toPos: any): void {
    new TWEEN.Tween(fromPos)
      .to(toPos, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        card.position.set(fromPos.x, fromPos.y, fromPos.z);
      })
      .start();
  }

  static animateCardCollection(cards: THREE.Mesh[], winnerPile: any): void {
    // Implementation will go here
  }

  static animatePlayableCardHover(card: THREE.Mesh, isHovering: boolean): void {
    const initialY = card.userData['initialY'] || card.position.y;
    if (isHovering) {
      card.userData['initialY'] = initialY;
      new TWEEN.Tween(card.position)
        .to({ y: initialY + 0.5 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    } else {
      new TWEEN.Tween(card.position)
        .to({ y: initialY }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    }
  }

  static animateNonPlayableCardHover(card: THREE.Mesh, isHovering: boolean): void {
    const initialX = card.userData['initialX'] = card.userData['initialX'] || card.position.x;
    
    TWEEN.remove(card.userData['tween']);

    if (isHovering) {
      card.userData['tween'] = new TWEEN.Tween(card.position)
        .to({ x: initialX + 0.1 }, 100)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .yoyo(true)
        .repeat(1)
        .start();
    } else {
      card.userData['tween'] = new TWEEN.Tween(card.position)
        .to({ x: initialX }, 100)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    }
  }

  static animateHandReorganization(hand: THREE.Group): void {
    const now = performance.now();
    
    // Limit animation updates to 30fps to reduce CPU usage
    if (now - this.lastUpdateTime < 1000/30) {
      return;
    }
    
    this.lastUpdateTime = now;
    this.animationPhase += 0.1;
    
    hand.children.forEach(child => {
      if (child.userData['selected']) {
        child.position.y = (GameConstants.HAND_POSITIONS.player1.y+0.3) + Math.sin(this.animationPhase) * 0.1;
      }
    });
  }
}
