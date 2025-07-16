import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class TableRenderer {
  createTable(): THREE.Mesh {
    // Use a PlaneGeometry for the table top for a flat surface.
    const geometry = new THREE.PlaneGeometry(20, 12); // Adjusted to a 16:9 aspect ratio
    const material = new THREE.MeshStandardMaterial({ color: 0x004d00, side: THREE.DoubleSide }); // Dark green color
    const table = new THREE.Mesh(geometry, material);
    table.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
    table.position.y = 0; // Position at y=0
    return table;
  }
}
