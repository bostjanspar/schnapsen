import * as THREE from 'three';

export abstract class BaseScene extends THREE.Scene {
  public allowMouseEvent = false;
  public camera!: THREE.Camera;

  public abstract onMouseEvent(mouse: THREE.Vector2): void;
  public abstract update(): void;
}
