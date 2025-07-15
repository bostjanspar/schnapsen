import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardRenderer } from './card-renderer';
import { Card } from './models/card.model';

@Injectable({
  providedIn: 'root'
})
export class HandRenderer {
  private cardRenderer = inject(CardRenderer);

  async renderHand(cards: Card[]): Promise<THREE.Group> {
    const handGroup = new THREE.Group();
    for (let i = 0; i < cards.length; i++) {
      const cardMesh = await this.cardRenderer.renderCard(cards[i]);
      cardMesh.position.x = i * 0.6; // Simple horizontal layout
      handGroup.add(cardMesh);
    }
    return handGroup;
  }
}
