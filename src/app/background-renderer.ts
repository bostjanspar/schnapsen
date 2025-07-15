import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class BackgroundRenderer {
  createBackground(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(50, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }); // Sky blue background
    const background = new THREE.Mesh(geometry, material);
    return background;
  }
}
