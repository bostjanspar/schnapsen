import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardRenderer } from './card-renderer';
import { Card } from '../../logic/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class HandRenderer {
  private cardRenderer = inject(CardRenderer);

  async renderHand(cards: Card[], isOpponent: boolean = false): Promise<THREE.Group> {
    const handGroup = new THREE.Group();
    const cardWidth = 2; // Adjusted card width
    const cardSpacing = 0.2; // Adjusted spacing between cards
    const totalHandWidth = (cards.length * cardWidth) + ((cards.length - 1) * cardSpacing);
    const startX = -totalHandWidth / 2 + cardWidth / 2;

    for (let i = 0; i < cards.length; i++) {
      const cardMesh = await this.cardRenderer.renderCard(cards[i], !isOpponent, false, false, isOpponent);
      cardMesh.position.x = startX + i * (cardWidth + cardSpacing);
      handGroup.add(cardMesh);
    }
    return handGroup;
  }
}
