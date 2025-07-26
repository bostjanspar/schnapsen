import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { GameConstants } from '../../../../logic/game.constants';

export class GameAnimations {
  static animateCardDeal(cards: THREE.Mesh[], positions: any[], timing: number): void {
    // Implementation will go here
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
    hand.children.forEach(child => {
      if (child.userData['selected']) {
        child.position.y = (GameConstants.HAND_POSITIONS.player1.y+0.3) + Math.sin(Date.now() * 0.003) * 0.1;
      }
    });
  }
}
