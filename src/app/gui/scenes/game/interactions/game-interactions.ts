import * as THREE from 'three';
import { Card } from '../logic/schnapsen.rules';

export class GameInteractions {
  private raycaster = new THREE.Raycaster();
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public handleCardClick(mouse: THREE.Vector2, camera: THREE.Camera, onCardClick: (card: THREE.Object3D) => void): void {
    this.raycaster.setFromCamera(mouse, camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject.userData['card']) {
        onCardClick(clickedObject);
      }
    }
  }

  public handleCardHover(mouse: THREE.Vector2, camera: THREE.Camera, onCardHover: (card: THREE.Object3D | null, isPlayable: boolean) => void): void {
    this.raycaster.setFromCamera(mouse, camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      if (hoveredObject.userData['card']) {
        const isPlayable = this.validateMove(hoveredObject.userData['card'], {}); // Placeholder
        onCardHover(hoveredObject, isPlayable);
      } else {
        onCardHover(null, false);
      }
    } else {
      onCardHover(null, false);
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
