import * as THREE from 'three';
import { Card, Suit, Rank } from './schnapsen.rules';
import { GameScene } from './scenes/game.scene';
import { CardLayout } from './scenes/card-layout';

export interface GUIState {
  playerCards: Card[];
  opponentCards: number;
  currentTrick: Card[];
  playerWonTricks: Card[];
  opponentWonTricks: number;
  talonCards: number;
  trumpCard: Card | null;
}

export class GUIStateManager {
  private scene: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  private getCardsFromGroup(group: THREE.Group): Card[] {
    return group.children
      .map(cardMesh => cardMesh.userData as Card)
      .filter(card => card && card['id']);
  }

  private getTrumpCard(): Card | null {
    if (this.scene.talonGroup.children.length > 0) {
      const trumpCardMesh = this.scene.talonGroup.children[0];
       if (trumpCardMesh && trumpCardMesh.userData['id']) {
          return trumpCardMesh.userData as Card;
      }
    }
    return null;
  }

  public captureState(): GUIState {
    return {
      playerCards: this.getCardsFromGroup(this.scene.playerHandGroup),
      opponentCards: this.scene.opponentHandGroup.children.length,
      currentTrick: this.getCardsFromGroup(this.scene.currentTrickGroup),
      playerWonTricks: this.getCardsFromGroup(this.scene.playerTricksGroup),
      opponentWonTricks: this.scene.opponentTricksGroup.children.length,
      talonCards: this.scene.talonGroup.children.length,
      trumpCard: this.getTrumpCard(),
    };
  }

  public restoreState(state: GUIState): void {
    this.clearAllGroups();
    this.createCardsInGroup(state.playerCards, this.scene.playerHandGroup, 'fan');
    this.createDummyCardsInGroup(state.opponentCards, this.scene.opponentHandGroup, 'fan');
    this.createCardsInGroup(state.currentTrick, this.scene.currentTrickGroup, 'line');
    this.createCardsInGroup(state.playerWonTricks, this.scene.playerTricksGroup, 'pile');
    this.createDummyCardsInGroup(state.opponentWonTricks, this.scene.opponentTricksGroup, 'pile');
    
    // For the talon, we create dummy cards for all but the trump card
    const talonDummies = state.talonCards > 0 ? state.talonCards -1 : 0;
    this.createDummyCardsInGroup(talonDummies, this.scene.talonGroup, 'stack');
    if (state.trumpCard) {
        // The trump card is part of the talon, and we render it face up
        const trumpMesh = this.scene.cardManager.createCard(state.trumpCard, true);
        const talonLayout = CardLayout.getTalonLayout();
        trumpMesh.position.set(talonLayout.position.x, talonLayout.position.y, talonLayout.position.z);
        this.scene.talonGroup.add(trumpMesh);
    }
  }

  private clearAllGroups(): void {
    this.scene.playerHandGroup.clear();
    this.scene.opponentHandGroup.clear();
    this.scene.currentTrickGroup.clear();
    this.scene.playerTricksGroup.clear();
    this.scene.opponentTricksGroup.clear();
    this.scene.talonGroup.clear();
  }

  private createCardsInGroup(cards: Card[], group: THREE.Group, layout: string): void {
    const cardManager = this.scene.cardManager;
    if (!cardManager) return;

    if (layout === 'fan') {
        const positions = CardLayout.calculateHandPositions(cards.length, {});
        cards.forEach((card, i) => {
            const cardMesh = cardManager.createCard(card, group.name === 'playerHand');
            cardMesh.position.set(positions[i].x, positions[i].y, positions[i].z);
            if (group.name === 'opponentHand') {
                cardMesh.position.y += 5;
            }
            group.add(cardMesh);
        });
    } else if (layout === 'line') {
        cards.forEach((card, i) => {
            const cardMesh = cardManager.createCard(card, true);
            cardMesh.position.set(i * 0.5, 0, 0); // Simple side-by-side for the trick
            group.add(cardMesh);
        });
    } else if (layout === 'pile') {
        const pileLayout = CardLayout.getCollectedTricksLayout();
        const position = group.name === 'playerTricksGroup' ? pileLayout.player1 : pileLayout.player2;
        cards.forEach((card, i) => {
            const cardMesh = cardManager.createCard(card, true);
            cardMesh.position.set(position.x, position.y, position.z + i * 0.01);
            group.add(cardMesh);
        });
    }
  }

  private createDummyCardsInGroup(count: number, group: THREE.Group, layout: string): void {
    const cardManager = this.scene.cardManager;
    if (!cardManager) return;

    const dummyCard: Card = { id: 'dummy', suit: Suit.HEARTS, rank: Rank.ACE, value: 0 };

    if (layout === 'fan') {
        const positions = CardLayout.calculateHandPositions(count, {});
        for (let i = 0; i < count; i++) {
            const cardMesh = cardManager.createCard(dummyCard, false);
            cardMesh.position.set(positions[i].x, positions[i].y + 5, positions[i].z);
            group.add(cardMesh);
        }
    } else if (layout === 'stack') {
        const talonLayout = CardLayout.getTalonLayout();
        for (let i = 0; i < count; i++) {
            const cardMesh = cardManager.createCard(dummyCard, false);
            cardMesh.position.set(talonLayout.position.x, talonLayout.position.y, talonLayout.position.z + (i+1) * 0.02);
            group.add(cardMesh);
        }
    } else if (layout === 'pile') {
        const pileLayout = CardLayout.getCollectedTricksLayout();
        const position = group.name === 'opponentTricksGroup' ? pileLayout.player2 : pileLayout.player1;
        for (let i = 0; i < count; i++) {
            const cardMesh = cardManager.createCard(dummyCard, false);
            cardMesh.position.set(position.x, position.y, position.z + i * 0.01);
            group.add(cardMesh);
        }
    }
  }
}
