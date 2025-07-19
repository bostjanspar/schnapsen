import * as THREE from 'three';
import { BaseScene } from './base.scene';
import { Card, Suit, Rank, CARD_VALUES } from '../schnapsen.rules';
import { GameConstants } from '../game.constants';
import { CardManager } from './card-manager';
import { CardLayout } from './card-layout';
import { GameInteractions } from './game-interactions';
import { GameAnimations } from './game-animations';
import { MaterialFactory } from '../utils/material.factory';
import { UIUtils } from '../utils/ui.utils';
import TWEEN from '@tweenjs/tween.js';



export class GameScene extends BaseScene {
  private cardManager!: CardManager;
  private gameInteractions!: GameInteractions;

  // Game state
  private deck!: Card[];
  private trumpSuit!: Suit;
  
  // Card groups for easy management
  private playerHandGroup: THREE.Group = new THREE.Group();
  private opponentHandGroup: THREE.Group = new THREE.Group();
  private talonGroup: THREE.Group = new THREE.Group();
  private currentTrickGroup: THREE.Group = new THREE.Group();
  private playerTricksGroup: THREE.Group = new THREE.Group();
  private opponentTricksGroup: THREE.Group = new THREE.Group();

 

  constructor() {
    super();
    this.background = new THREE.Color(0x1a4a3a); // Dark green table color
    this.allowMouseEvent = true;
  }

  public async initialize() {
    this.cardManager = new CardManager(this);
    this.gameInteractions = new GameInteractions(this.camera, this);

    await MaterialFactory.preloadAllMaterials();

    this.deck = this.initializeDeck();
    this.createCardGroups();
    this.setupTable();
    this.layoutCards(this.deck);

    const closeTalonButton = UIUtils.createButton('Close Talon', { width: 1, height: 0.5 }, {});
    closeTalonButton.position.set(3, -2.5, 0);
    this.add(closeTalonButton);

    const scoreLabel = UIUtils.createLabel('Score: 0', { x: -4, y: 2.5, z: 0 }, {});
    this.add(scoreLabel);
  }


  private initializeDeck(): Card[] {
    const deck: Card[] = [];
    Object.values(Suit).forEach(suit => {
      Object.values(Rank).forEach(rank => {
        deck.push({
          suit,
          rank,
          value: CARD_VALUES[rank],
          id: `${suit}_${rank}`
        });
      });
    });
    
    return this.cardManager.shuffleDeck(deck);
  }

  private createCardGroups(): void {
    // Create groups for different card areas
    this.playerHandGroup = new THREE.Group();
    this.playerHandGroup.name = 'playerHand';
    this.add(this.playerHandGroup);

    this.opponentHandGroup = new THREE.Group();
    this.opponentHandGroup.name = 'opponentHand';
    this.add(this.opponentHandGroup);

    this.talonGroup = new THREE.Group();
    this.talonGroup.name = 'talon';
    this.add(this.talonGroup);

    this.currentTrickGroup = new THREE.Group();
    this.currentTrickGroup.name = 'currentTrick';
    this.add(this.currentTrickGroup);

    this.playerTricksGroup = new THREE.Group();
    this.playerTricksGroup.name = 'playerTricks';
    this.add(this.playerTricksGroup);

    this.opponentTricksGroup = new THREE.Group();
    this.opponentTricksGroup.name = 'opponentTricks';
    this.add(this.opponentTricksGroup);
  }

  private setupTable(): void {
    // Table surface
    const tableGeometry = new THREE.CircleGeometry(12, 64);
    // Use MeshBasicMaterial directly to ensure color is correct
    const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x1a4a3a }); // Dark green
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = -0.1;
    table.position.z = -5;
    table.name = 'table';
    this.add(table);
  }

  private layoutCards(deck: Card[]): void {
    const { player1Hand, player2Hand, talon } = this.cardManager.dealCards(deck);

    const player1HandPositions = CardLayout.calculateHandPositions(player1Hand.length, {});
    player1Hand.forEach((card: Card, i: number) => {
      const cardMesh = this.cardManager.createCard(card, true);
      cardMesh.position.set(player1HandPositions[i].x, player1HandPositions[i].y, player1HandPositions[i].z);
      this.playerHandGroup.add(cardMesh);
    });

    const player2HandPositions = CardLayout.calculateHandPositions(player2Hand.length, {});
    player2Hand.forEach((card: Card, i: number) => {
      const cardMesh = this.cardManager.createCard(card, false);
      cardMesh.position.set(player2HandPositions[i].x, player2HandPositions[i].y + 5, player2HandPositions[i].z);
      this.opponentHandGroup.add(cardMesh);
    });

    const talonLayout = CardLayout.getTalonLayout();
    talon.forEach((card: Card, i: number) => {
      const cardMesh = this.cardManager.createCard(card, i === 0);
      cardMesh.position.set(talonLayout.position.x, talonLayout.position.y, talonLayout.position.z + i * 0.02);
      this.talonGroup.add(cardMesh);
    });

    this.trumpSuit = talon[0].suit;
  }




  public playCardToTrick(cardName: string, isPlayer: boolean): void {
    const cardMesh = this.cardManager.cardMeshes.get(cardName);
    if (!cardMesh) return;

    // Move card to current trick area
    const fromPos = cardMesh.position.clone();
    const trickPosition = isPlayer ?
      new THREE.Vector3(0, 0, -1) :
      new THREE.Vector3(0, 0, 1);
    GameAnimations.animateCardPlay(cardMesh, fromPos, trickPosition);

    // Remove from hand group and add to trick group
    if (isPlayer) {
      this.playerHandGroup.remove(cardMesh);
    } else {
      this.opponentHandGroup.remove(cardMesh);
    }
    this.currentTrickGroup.add(cardMesh);
  }

  public collectTrick(winner: 'player' | 'opponent'): void {
    const tricksGroup = winner === 'player' ? this.playerTricksGroup : this.opponentTricksGroup;
    const tricksPile = winner === 'player' ? 
      this.cardManager.cardMeshes.get('playerTricksPile')! : 
      this.cardManager.cardMeshes.get('opponentTricksPile')!;

    // Move all cards from current trick to winner's pile
    this.currentTrickGroup.children.forEach(cardMesh => {
      tricksGroup.add(cardMesh);
      cardMesh.position.copy(tricksPile.position);
      cardMesh.position.y += tricksGroup.children.length * 0.01;
    });

    // Clear current trick group
    this.currentTrickGroup.clear();
    
    // Show tricks pile
    tricksPile.visible = true;
  }

  public drawFromTalon(playerName: string): void {
    // Find the top talon card
    const talonCards = this.talonGroup.children.filter(child => 
      child.name.startsWith('talonCard_')
    );
    
    if (talonCards.length === 0) return;

    const topCard = talonCards[talonCards.length - 1] as THREE.Mesh;
    this.talonGroup.remove(topCard);

    // Add to appropriate hand
    if (playerName.startsWith('player')) {
      this.playerHandGroup.add(topCard);
      // Reposition in hand
      const handSize = this.playerHandGroup.children.length;
      topCard.position.set((handSize - 3) * (GameConstants.CARD_DIMENSIONS.width + GameConstants.CARD_SPACING), 0, -5);
    } else {
      this.opponentHandGroup.add(topCard);
      const handSize = this.opponentHandGroup.children.length;
      topCard.position.set((handSize - 3) * (GameConstants.CARD_DIMENSIONS.width + GameConstants.CARD_SPACING), 0, 5);
    }
  }

  public closeTalon(): void {
    // Flip trump card face down
    const trumpCard = this.cardManager.cardMeshes.get('trumpCard');
    if (trumpCard) {
      trumpCard.rotation.y = Math.PI;
    }
  }

  public onMouseEvent(mouse: THREE.Vector2): void {
    this.gameInteractions.handleCardClick(mouse, (card) => {
      this.onCardClick(card);
    });
  }

  private onCardClick(card: THREE.Object3D): void {
    // Example: highlight selected card
    if (card.userData['selected']) {
      card.position.y = GameConstants.HAND_POSITIONS.player1.y;
      card.userData['selected'] = false;
    } else {
      card.position.y = GameConstants.HAND_POSITIONS.player1.y + 0.3;
      card.userData['selected'] = true;
    }
  }

  public update(): void {
    TWEEN.update();
    GameAnimations.animateHandReorganization(this.playerHandGroup);
  }

  public onMouseMove(mouse: THREE.Vector2): void {
    this.gameInteractions.handleCardHover(mouse, (card) => {
      // Handle hover effect, e.g., by scaling the card
    });
  }
}
