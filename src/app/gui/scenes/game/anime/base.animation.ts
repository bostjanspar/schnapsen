import * as THREE from 'three';
import { GameScene } from '../game.scene';

export abstract class BaseAnimation {
  protected scene: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  protected getScene(): GameScene {
    return this.scene;
  }
}