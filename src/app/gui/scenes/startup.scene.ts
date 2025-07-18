import * as THREE from 'three';
import { BaseScene } from './base.scene';

export class StartupScene extends BaseScene {
  private raycaster = new THREE.Raycaster();

  constructor(private switchScene: () => void) {
    super();
    this.background = new THREE.Color(0xcccccc);
    this.allowMouseEvent = true;

    const geometry = new THREE.BoxGeometry(2, 0.5, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x007bff });
    const button = new THREE.Mesh(geometry, material);
    button.name = 'startButton';
    this.add(button);
  }

  public onMouseEvent(mouse: THREE.Vector2): void {
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.children);

    if (intersects.length > 0 && intersects[0].object.name === 'startButton') {
      this.switchScene();
    }
  }

  public update(): void {
    // No animation in the startup scene
  }
}
