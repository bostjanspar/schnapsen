import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { GameConstants } from '../../../../logic/game.constants';

export class HandAnimation {
  private lastUpdateTime: number = 0;
  private animationPhase: number = 0;

  animateHandReorganization(hand: THREE.Group): void {
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