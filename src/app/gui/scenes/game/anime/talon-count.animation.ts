import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { BaseAnimation } from './base.animation';
import { GameScene } from '../game.scene';
import { Text } from 'troika-three-text';
import { GameConstants } from '../../../../logic/game.constants';

export class TalonCountAnimation extends BaseAnimation {
  private scaleTween: TWEEN.Tween<THREE.Vector3> | null = null;

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

    if (this.scaleTween) {
      this.scaleTween.stop();
    }

    // Ensure we start from a clean state
    this.countText.scale.set(1, 1, 1);

    // Animate with a "bouncy pop"
    this.scaleTween = new TWEEN.Tween(this.countText.scale)
      .to({ x: 1.5, y: 1.5, z: 1.5 }, 500)
      .repeat(1)
      .yoyo(true)
      .easing(TWEEN.Easing.Elastic.Out)
      .start();
  }

  public removeCountDisplay(): void {
    if (this.countText) {
      this.countText.visible = false;
    }
  }
}
