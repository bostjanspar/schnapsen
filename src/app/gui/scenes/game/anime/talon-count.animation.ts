import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { BaseAnimation } from './base.animation';
import { GameScene } from '../game.scene';
import { Text } from 'troika-three-text';
import { GameConstants } from '../../../../logic/game.constants';

export class TalonCountAnimation extends BaseAnimation {
  constructor(
    scene: GameScene,
    private readonly countText: Text | null
  ) {
    super(scene);
  }

  public updateCountText(count: number): void {
    if (!this.countText) {
      console.warn('countText not provided to TalonCountAnimation');
      return;
    }

    if (count > 0) {
      this.countText.text = count.toString();
      this.countText.sync();
      this.countText.visible = true;
    } else {
      this.countText.visible = false;
    }

    const basePosition = GameConstants.TALON_LAYOUT.position;
    const position = new THREE.Vector3(
      basePosition.x,
      basePosition.y + 0.5,
      basePosition.z + 0.1
    );

    this.countText.position.copy(position);
  }

  public triggerHeartbeatAnimation(): void {
    if (!this.countText || !this.countText.visible) {
      return;
    }

    // Ensure we start from a clean state
    TWEEN.remove(this.countText.scale as any);
    this.countText.scale.set(1, 1, 1);

    const targetScale = { x: 1.4, y: 1.4, z: 1.4 };

    // Animate with a "bouncy pop"
    new TWEEN.Tween(this.countText.scale)
      .to(targetScale, 300)
      .easing(TWEEN.Easing.Back.Out) // This easing overshoots and comes back
      .start();
  }

  public removeCountDisplay(): void {
    if (this.countText) {
      this.countText.visible = false;
    }
  }
}