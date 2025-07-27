import * as THREE from 'three';
import { BaseScene } from '../base.scene';
import { UIUtils } from '../../utils/ui.utils';

export class StartupScene extends BaseScene {
  private raycaster = new THREE.Raycaster();

  constructor(protected override readonly camera: THREE.Camera) {
    super(camera);
    this.background = new THREE.Color(0xcccccc);

    const button = UIUtils.createButton('Start Game', { width: 2, height: 0.5 }, { backgroundColor: '#007bff' });
    button.name = 'startButton';
    this.add(button);
  }

  public onMouseEvent(mouse: THREE.Vector2): void {
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.children);

    if (intersects.length > 0 && intersects[0].object.name === 'startButton') {

    }
  }

  public update(): void {
    // No animation in the startup scene
  }

  public onMouseMove(mouse: THREE.Vector2): void {
    // No mouse move interaction in the startup scene
  }
}
