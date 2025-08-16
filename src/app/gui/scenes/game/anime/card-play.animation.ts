import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

export class CardPlayAnimation {
  static animateCardPlay(card: THREE.Mesh, fromPos: any, toPos: any): void {
    new TWEEN.Tween(fromPos)
      .to(toPos, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        card.position.set(fromPos.x, fromPos.y, fromPos.z);
      })
      .start();
  }
}