import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { BaseAnimation } from './base.animation';
import { GameScene } from '../game.scene';

export class CardHoverAnimation extends BaseAnimation {
  constructor(scene: GameScene) {
    super(scene);
  }

  animatePlayableCardHover(card: THREE.Mesh, isHovering: boolean): void {
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

  animateNonPlayableCardHover(card: THREE.Mesh, isHovering: boolean): void {
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
}