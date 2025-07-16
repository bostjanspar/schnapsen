import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CardHoverHandler {
  private intersectedObject: THREE.Object3D | null = null;

  // Placeholder for hover handling logic
  // This would typically involve raycasting to detect hovers on 3D objects
  handleHover(event: MouseEvent, camera: THREE.Camera, scene: THREE.Scene): THREE.Object3D | null {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      if (this.intersectedObject !== intersects[0].object) {
        // New object hovered
        this.intersectedObject = intersects[0].object;
        return this.intersectedObject;
      }
    } else {
      if (this.intersectedObject) {
        // Hover ended
        const prevIntersected = this.intersectedObject;
        this.intersectedObject = null;
        return prevIntersected; // Return the previously hovered object to unhighlight it
      }
    }
    return null;
  }
}
