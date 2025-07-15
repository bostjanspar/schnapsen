import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardMeshFactory } from './card-mesh-factory';
import { Card } from './models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardRenderer {
  private cardMeshFactory = inject(CardMeshFactory);

  async renderCard(card: Card, faceUp: boolean = true): Promise<THREE.Mesh> {
    const cardMesh = this.cardMeshFactory.createCardMesh();

    if (faceUp) {
      cardMesh.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green for face up
    } else {
      cardMesh.material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red for face down
    }

    return cardMesh;
  }
}
