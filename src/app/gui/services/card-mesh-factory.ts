import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CardMeshFactory {
  createCardMesh(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1, 1.4, 0.05); // Standard card dimensions
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White material for now
    const card = new THREE.Mesh(geometry, material);
    return card;
  }
}
