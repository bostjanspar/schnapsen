import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardRenderer } from './card-renderer';
import { Card } from '../../logic/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class TrickRenderer {
  private cardRenderer = inject(CardRenderer);

  async renderTrick(trickCards: Card[]): Promise<THREE.Group> {
    const trickGroup = new THREE.Group();
    for (let i = 0; i < trickCards.length; i++) {
      const cardMesh = await this.cardRenderer.renderCard(trickCards[i]);
      cardMesh.position.x = i * 0.7; // Simple horizontal layout for trick
      trickGroup.add(cardMesh);
    }
    return trickGroup;
  }
}
