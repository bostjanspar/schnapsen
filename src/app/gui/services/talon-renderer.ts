import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardRenderer } from './card-renderer';
import { Card } from '../../logic/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class TalonRenderer {
  private cardRenderer = inject(CardRenderer);

  async renderTalon(talonCards: Card[], trumpCard: Card | undefined, isTalonClosed: boolean): Promise<THREE.Group> {
    const talonGroup = new THREE.Group();

    // Render talon stack
    for (let i = 0; i < talonCards.length; i++) {
      const cardMesh = await this.cardRenderer.renderCard(talonCards[i], false, false, false, true); // Render all talon cards as question marks
      cardMesh.position.y = i * 0.05; // Tighter stack
      talonGroup.add(cardMesh);
    }

    // Render trump card
    if (trumpCard) {
      const trumpMesh = await this.cardRenderer.renderCard(trumpCard, true, true, false, false);
      // Position trump card next to the talon stack, slightly overlapping
      trumpMesh.position.set(2.5, (talonCards.length - 1) * 0.05 / 2, 0);
      talonGroup.add(trumpMesh);
    }

    return talonGroup;
  }
}
