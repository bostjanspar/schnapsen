import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardMeshFactory } from './card-mesh-factory';
import { Card } from '../../logic/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardRenderer {
  private cardMeshFactory = inject(CardMeshFactory);

  async renderCard(card: Card, faceUp: boolean = true, isTrump: boolean = false, isMarriage: boolean = false, isQuestionMark: boolean = false): Promise<THREE.Mesh> {
    let cardMesh: THREE.Mesh;
    if (isQuestionMark) {
      cardMesh = await this.cardMeshFactory.createQuestionMarkCardMesh();
    } else {
      cardMesh = faceUp ? await this.cardMeshFactory.createCardMesh(card.suit, card.rank) : this.cardMeshFactory.createCardBackMesh();
    }

    if (isTrump) {
      // Apply a visual distinction for trump cards, e.g., a subtle emissive color
      if (Array.isArray(cardMesh.material)) {
        const frontMaterial = cardMesh.material[5]; // Assuming front face is the 6th material
        if (frontMaterial instanceof THREE.MeshStandardMaterial) {
          frontMaterial.emissive.setHex(0x00ff00); // Green emissive color
          frontMaterial.emissiveIntensity = 0.5;
        }
      } else if (cardMesh.material instanceof THREE.MeshStandardMaterial) {
        cardMesh.material.emissive.setHex(0x00ff00);
        cardMesh.material.emissiveIntensity = 0.5;
      }
    }

    if (isMarriage) {
      // Apply a visual distinction for marriage cards, e.g., a subtle emissive color
      if (Array.isArray(cardMesh.material)) {
        const frontMaterial = cardMesh.material[5]; // Assuming front face is the 6th material
        if (frontMaterial instanceof THREE.MeshStandardMaterial) {
          frontMaterial.emissive.setHex(0xffd700); // Gold emissive color
          frontMaterial.emissiveIntensity = 0.5;
        }
      } else if (cardMesh.material instanceof THREE.MeshStandardMaterial) {
        cardMesh.material.emissive.setHex(0xffd700);
        cardMesh.material.emissiveIntensity = 0.5;
      }
    }

    return cardMesh;
  }
}
