import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { GameConstants } from '../../../../logic/game.constants';
import { BaseAnimation } from './base.animation';
import { GameScene } from '../game.scene';

export class TrickAnimation extends BaseAnimation {
  constructor(scene: GameScene) {
    super(scene);
  }

  /**
   * Animate a card to the trick area, positioning it based on who played first
   * @param cardMesh The card mesh to animate
   * @param fromPos The starting position of the card
   * @param isPlayer Whether the card is from the player's hand
   * @param isPlayerFirst Whether the player played the first card in this trick
   * @param onComplete Callback when animation is complete
   */
  animateCardToTrick(
    cardMesh: THREE.Mesh,
    fromPos: THREE.Vector3,
    isPlayer: boolean,
    isPlayerFirst: boolean,
    onComplete: () => void = () => {}
  ): void {
    // Calculate target position based on who played first
    const targetPosition = this.calculateTrickCardPosition(isPlayer, isPlayerFirst);

    new TWEEN.Tween(fromPos)
      .to(targetPosition, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        cardMesh.position.set(fromPos.x, fromPos.y, fromPos.z);
      })
      .onComplete(onComplete)
      .start();
  }

  /**
   * Calculate the position for a card in the trick area
   * @param isPlayer Whether this is the player's card
   * @param isPlayerFirst Whether the player played first in this trick
   * @returns The target position for the card
   */
  private calculateTrickCardPosition(isPlayer: boolean, isPlayerFirst: boolean): THREE.Vector3 {
    // Base trick area position
    const baseX = GameConstants.TRICK_AREA_LAYOUT.position.x;
    const baseY = GameConstants.TRICK_AREA_LAYOUT.position.y;
    const baseZ = GameConstants.TRICK_AREA_LAYOUT.position.z;

    // Determine positions based on who played first
    if (isPlayerFirst) {
      // Player played first - player card on left, opponent on right
      return isPlayer 
        ? new THREE.Vector3(baseX - 0.75, baseY, baseZ)  // Player card on left
        : new THREE.Vector3(baseX + 0.75, baseY, baseZ); // Opponent card on right
    } else {
      // Opponent played first - opponent card on left, player on right
      return isPlayer 
        ? new THREE.Vector3(baseX + 0.75, baseY, baseZ)  // Player card on right
        : new THREE.Vector3(baseX - 0.75, baseY, baseZ); // Opponent card on left
    }
  }
}