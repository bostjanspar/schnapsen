import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class LayoutManager {
  // Placeholder for layout calculations
  // This service will be responsible for positioning cards, players, etc.
  // For now, it just returns a dummy position.
  getCardPosition(index: number): THREE.Vector3 {
    return new THREE.Vector3(index * 0.5, 0, 0);
  }
}
