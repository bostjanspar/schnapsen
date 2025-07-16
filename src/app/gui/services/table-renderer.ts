import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class TableRenderer {
  createTable(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(10, 0.1, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x008000 }); // Green table
    const table = new THREE.Mesh(geometry, material);
    table.position.y = -0.5;
    return table;
  }
}
