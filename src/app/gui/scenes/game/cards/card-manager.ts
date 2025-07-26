import * as THREE from 'three';
import { Card, Suit, Rank, CARD_VALUES } from '../../../../logic/schnapsen.rules';
import { GameConstants } from '../../../../logic/game.constants';
import { MaterialFactory } from '../../../utils/material.factory';

export class CardManager {
  private cardGeometry: THREE.BoxGeometry;
  private scene: THREE.Scene;
  public cardMeshes: Map<string, THREE.Mesh> = new Map();


  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.cardGeometry = new THREE.BoxGeometry(
      GameConstants.CARD_DIMENSIONS.width,
      GameConstants.CARD_DIMENSIONS.height,
      GameConstants.CARD_DIMENSIONS.depth
    );
  }

  public createCard(cardData: Card, faceUp: boolean): THREE.Mesh {
    const material = MaterialFactory.getCardMaterial(cardData.id, faceUp);
    const cardMesh = new THREE.Mesh(this.cardGeometry, material);
    cardMesh.userData = { card: cardData, faceUp };
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    this.cardMeshes.set(cardData.id, cardMesh);
    return cardMesh;
  }

  public flipCard(cardMesh: THREE.Mesh): void {
    // Implementation will go here
  }

  public moveCardToHand(card: THREE.Mesh, player: any, position: any): void {
    // Implementation will go here
  }

}
