import * as THREE from 'three';
import { BaseScene } from '../base.scene';
import { UIUtils } from '../../utils/ui.utils';

export class StartupScene extends BaseScene {
  private raycaster = new THREE.Raycaster();

  constructor(private switchScene: () => void) {
    super();
    this.background = new THREE.Color(0xcccccc);
    this.allowMouseEvent = true;

    const button = UIUtils.createButton('Start Game', { width: 2, height: 0.5 }, { backgroundColor: '#007bff' });
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

  public onMouseMove(mouse: THREE.Vector2): void {
    // No mouse move interaction in the startup scene
  }
}
