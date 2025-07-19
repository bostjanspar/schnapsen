import * as THREE from 'three';
import { Card } from '../schnapsen.rules';

export class GameInteractions {
  private raycaster = new THREE.Raycaster();
  private camera: THREE.Camera;
  private scene: THREE.Scene;

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    this.camera = camera;
    this.scene = scene;
  }

  public handleCardClick(mouse: THREE.Vector2, onCardClick: (card: THREE.Object3D) => void): void {
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject.userData['card']) {
        onCardClick(clickedObject);
      }
    }
  }

  public handleCardHover(mouse: THREE.Vector2, onCardHover: (card: THREE.Object3D | null) => void): void {
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      if (hoveredObject.userData['card']) {
        onCardHover(hoveredObject);
      } else {
        onCardHover(null);
      }
    } else {
      onCardHover(null);
    }
  }

  public handleTableClick(mouse: THREE.Vector2): void {
    // Implementation will go here
  }

  public validateMove(card: Card, gameState: any): boolean {
    // This might be better in SchnapsenRules, but can be here for interaction-specific validation
    return true;
  }
}
