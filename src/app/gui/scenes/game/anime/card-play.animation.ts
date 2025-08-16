import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { BaseAnimation } from './base.animation';
import { GameScene } from '../game.scene';

export class CardPlayAnimation extends BaseAnimation {
  constructor(scene: GameScene) {
    super(scene);
  }

  animateCardPlay(card: THREE.Mesh, fromPos: any, toPos: any): void {
    new TWEEN.Tween(fromPos)
      .to(toPos, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        card.position.set(fromPos.x, fromPos.y, fromPos.z);
      })
      .start();
  }
}