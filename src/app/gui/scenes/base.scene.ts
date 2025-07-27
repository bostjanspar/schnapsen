import * as THREE from 'three';
import { SchnapsenScene } from './schnapsen-scene.enum';

export abstract class BaseScene extends THREE.Scene {

  constructor(protected readonly camera: THREE.Camera) { 
    super();
  }

  public abstract onMouseEvent(mouse: THREE.Vector2): void;
  public abstract onMouseMove(mouse: THREE.Vector2): void;
  public abstract update(): void;
}
