import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { AnimationService } from './animation.service';

@Injectable({
  providedIn: 'root'
})
export class CardHoverHandler {
  private intersectedObject: THREE.Object3D | null = null;
  private animationService = inject(AnimationService);

  handleHover(event: MouseEvent, camera: THREE.Camera, scene: THREE.Scene): THREE.Object3D | null {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const newIntersected = intersects[0].object;
      if (this.intersectedObject !== newIntersected) {
        if (this.intersectedObject) {
          this.animationService.unhighlightCard(this.intersectedObject as THREE.Mesh); // Unhighlight previous
        }
        this.intersectedObject = newIntersected;
        this.animationService.highlightCard(this.intersectedObject as THREE.Mesh); // Highlight new
        return this.intersectedObject;
      }
    } else {
      if (this.intersectedObject) {
        this.animationService.unhighlightCard(this.intersectedObject as THREE.Mesh); // Unhighlight current
        this.intersectedObject = null;
      }
    }
    return null;
  }
}
