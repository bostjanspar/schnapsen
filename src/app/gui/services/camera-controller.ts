import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraController {
  initCamera(width: number, height: number): THREE.PerspectiveCamera {
    const aspectRatio = width / height;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.z = 5;
    return camera;
  }

  onWindowResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, width: number, height: number): void {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
}
