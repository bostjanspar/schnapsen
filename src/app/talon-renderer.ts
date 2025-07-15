import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CardRenderer } from './card-renderer';
import { Card } from './models/card.model';

@Injectable({
  providedIn: 'root'
})
export class TalonRenderer {
  private cardRenderer = inject(CardRenderer);

  async renderTalon(talonCards: Card[], trumpCard: Card | undefined, isTalonClosed: boolean): Promise<THREE.Group> {
    const talonGroup = new THREE.Group();

    // Render talon stack
    for (let i = 0; i < talonCards.length; i++) {
      const cardMesh = await this.cardRenderer.renderCard(talonCards[i], false); // Face down
      cardMesh.position.y = i * 0.05; // Stack cards with slight offset
      talonGroup.add(cardMesh);
    }

    // Render trump card
    if (trumpCard) {
      const trumpMesh = await this.cardRenderer.renderCard(trumpCard, true);
      trumpMesh.position.set(0, talonCards.length * 0.05 + 0.1, 0); // Position above talon
      trumpMesh.rotation.z = Math.PI / 2; // Rotate to show trump suit
      talonGroup.add(trumpMesh);
    }

    return talonGroup;
  }
}
