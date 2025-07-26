import * as THREE from 'three';
import { Card, Suit, Rank, CARD_VALUES } from '../logic/schnapsen.rules';
import { MaterialFactory } from '../../../utils/material.factory';
import { GameConstants } from '../logic/game.constants';

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

  public dealCards(deck: Card[]): any {
    const player1Hand: Card[] = [];
    const player2Hand: Card[] = [];
    const talon: Card[] = [];

    for (let i = 0; i < 5; i++) {
      player1Hand.push(deck[i]);
      player2Hand.push(deck[i + 5]);
    }
    for (let i = 10; i < deck.length; i++) {
      talon.push(deck[i]);
    }

    return { player1Hand, player2Hand, talon };
  }

  public shuffleDeck(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
}
