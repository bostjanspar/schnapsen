import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

export class CardDealAnimation {
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
}