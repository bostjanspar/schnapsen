import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardRenderer } from './card-renderer';
import { Card } from '../../logic/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class TrickRenderer {
  private cardRenderer = inject(CardRenderer);

  async renderTrick(trickCards: Card[], isPile: boolean = false): Promise<THREE.Group> {
    const trickGroup = new THREE.Group();
    for (let i = 0; i < trickCards.length; i++) {
      const cardMesh = await this.cardRenderer.renderCard(trickCards[i], true, false, false, false);
      if (isPile) {
        cardMesh.position.y = i * 0.1; // Stack cards with 0.1 unit offset for piles
      } else {
        // Position cards side-by-side for the current trick
        cardMesh.position.x = i * 2.2; 
      }
      trickGroup.add(cardMesh);
    }
    return trickGroup;
  }
}
