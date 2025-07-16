import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CardDragHandler {
  private isDragging = false;
  private draggedObject: THREE.Object3D | null = null;
  private plane = new THREE.Plane();
  private raycaster = new THREE.Raycaster();
  private offset = new THREE.Vector3();

  startDrag(event: MouseEvent, camera: THREE.Camera, scene: THREE.Scene): void {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(mouse, camera);

    const intersects = this.raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      this.isDragging = true;
      this.draggedObject = intersects[0].object;

      this.plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(this.plane.normal), this.draggedObject.position);
      this.raycaster.ray.intersectPlane(this.plane, this.offset);
    }
  }

  drag(event: MouseEvent, camera: THREE.Camera): void {
    if (!this.isDragging || !this.draggedObject) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(mouse, camera);

    this.raycaster.ray.intersectPlane(this.plane, this.draggedObject.position);
    this.draggedObject.position.sub(this.offset);
  }

  endDrag(): void {
    this.isDragging = false;
    this.draggedObject = null;
  }
}
