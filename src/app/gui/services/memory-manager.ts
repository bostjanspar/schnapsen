import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class MemoryManager {
  disposeObject(object: THREE.Object3D): void {
    // Dispose of geometry and material if it's a Mesh
    if (object instanceof THREE.Mesh) {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }

    // Recursively dispose of children
    if (object.children) {
      object.children.forEach(child => this.disposeObject(child));
    }
  }
}
