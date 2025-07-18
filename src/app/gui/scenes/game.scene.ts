import * as THREE from 'three';
import { BaseScene } from './base.scene';

// Card dimensions and layout constants
const CARD_WIDTH = 1.6;
const CARD_HEIGHT = 2.2;
const CARD_THICKNESS = 0.02;

// Card suits and ranks for Schnapsen (20-card deck)
export enum Suit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades'
}

export enum Rank {
  ACE = 'ace',
  TEN = 'ten',
  KING = 'king',
  QUEEN = 'queen',
  JACK = 'jack'
}

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  id: string;
}

// Card values according to Schnapsen rules
const CARD_VALUES: Record<Rank, number> = {
  [Rank.ACE]: 11,
  [Rank.TEN]: 10,
  [Rank.KING]: 4,
  [Rank.QUEEN]: 3,
  [Rank.JACK]: 2
};

export interface CardPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
  faceUp: boolean;
}

const player_Y: number = -2.5;

export class GameScene extends BaseScene {
  private raycaster = new THREE.Raycaster();
  private cardGeometry!: THREE.BoxGeometry;
  private cardMaterials!: Map<string, THREE.MeshLambertMaterial>;
  private cardMeshes!: Map<string, THREE.Mesh>;
  
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
    this.cardMeshes = new Map();
    this.setupGeometry();
    await this.setupMaterials();
    this.initializeDeck();
    this.createCardGroups();
    this.setupTable();
    this.layoutCards();
  }

  private setupGeometry(): void {
    this.cardGeometry = new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, CARD_THICKNESS);
  }

  private async setupMaterials(): Promise<void> {
    this.cardMaterials = new Map();
    const textureLoader = new THREE.TextureLoader();

    // Create card back material
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 356;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(0, 0, 256, 356);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCHNAPSEN', 128, 180);
    const cardBackTexture = new THREE.CanvasTexture(canvas);
    const cardBackMaterial = new THREE.MeshLambertMaterial({ map: cardBackTexture });
    this.cardMaterials.set('back', cardBackMaterial);

    // Load card face textures
    const cardFaces = [];
    for (const suit of Object.values(Suit)) {
      for (const rank of Object.values(Rank)) {
        const cardId = `${suit}_${rank}`;
        const path = `/assets/cards/${suit}_${rank}.svg`;
        cardFaces.push(new Promise((resolve) => {
          textureLoader.load(path, (texture) => {
            this.cardMaterials.set(cardId, new THREE.MeshLambertMaterial({ map: texture }));
            resolve(null);
          });
        }));
      }
    }

    await Promise.all(cardFaces);

    console.log('Card materials:', this.cardMaterials);

    // Table material
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5a3d });
    this.cardMaterials.set('table', tableMaterial);
  }

  private initializeDeck(): void {
    this.deck = [];
    Object.values(Suit).forEach(suit => {
      Object.values(Rank).forEach(rank => {
        this.deck.push({
          suit,
          rank,
          value: CARD_VALUES[rank],
          id: `${suit}_${rank}`
        });
      });
    });
    
    // Shuffle deck
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    
    // Set trump suit (first card after dealing)
    this.trumpSuit = this.deck[10].suit; // 10th card is trump indicator
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
    const tableMaterial = this.cardMaterials.get('table')!;
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    //table.rotation.x = -Math.PI / 2;
    table.position.y = -0.1;
    table.position.z = -5;
    table.name = 'table';
    this.add(table);
  }

  private layoutCards(): void {
    // Deal initial cards according to Schnapsen rules
    this.dealInitialCards();
    this.setupTalon();
    this.setupCollectedTricks();
  }

  private dealInitialCards(): void {
    // Player hand (bottom) - 5 cards face up
    for (let i = 0; i < 5; i++) {
      const card = this.deck[i];
      const cardMesh = this.createCardMesh(card, true);
      cardMesh.position.set((i - 2) * (CARD_WIDTH + 0.1), player_Y, 0);
      cardMesh.name = `playerCard_${i}`;
      this.playerHandGroup.add(cardMesh);
      this.cardMeshes.set(`playerCard_${i}`, cardMesh);
    }

    // Opponent hand (top) - 5 cards face down
    for (let i = 0; i < 5; i++) {
      const card = this.deck[i + 5];
      const cardMesh = this.createCardMesh(card, false);
      cardMesh.position.set((i - 2) * (CARD_WIDTH + 0.1), 4, -2);
      cardMesh.rotation.y = Math.PI;
      cardMesh.name = `opponentCard_${i}`;
      this.opponentHandGroup.add(cardMesh);
      this.cardMeshes.set(`opponentCard_${i}`, cardMesh);
    }
  }

  private setupTalon(): void {
    // Trump card (face up) - 11th card
    const trumpCard = this.deck[10];
    const trumpCardMesh = this.createCardMesh(trumpCard, true);
    trumpCardMesh.rotation.z = -Math.PI / 2;
    trumpCardMesh.position.set(-2, 0, 0);
    trumpCardMesh.name = 'trumpCard';
    this.talonGroup.add(trumpCardMesh);
    this.cardMeshes.set('trumpCard', trumpCardMesh);

    // Remaining talon cards (face down stack) - 10 cards
    for (let i = 0; i < 9; i++) {
      const card = this.deck[i + 11];
      const cardMesh = this.createCardMesh(card, false);
      cardMesh.position.set(-3, i * 0.01, 0.2);
      cardMesh.name = `talonCard_${i}`;
      this.talonGroup.add(cardMesh);
      this.cardMeshes.set(`talonCard_${i}`, cardMesh);
    }
  }

  private setupCollectedTricks(): void {
    // Current trick area (center)
    // These will be populated during gameplay
    
    // Player collected tricks pile (bottom right)
    const playerTricksPile = new THREE.Mesh(
      this.cardGeometry,
      this.cardMaterials.get('back')!
    );
    playerTricksPile.position.set(5, 0, -3);
    playerTricksPile.name = 'playerTricksPile';
    playerTricksPile.visible = false; // Initially hidden
    this.playerTricksGroup.add(playerTricksPile);
    this.cardMeshes.set('playerTricksPile', playerTricksPile);

    // Opponent collected tricks pile (top right)
    const opponentTricksPile = new THREE.Mesh(
      this.cardGeometry,
      this.cardMaterials.get('back')!
    );
    opponentTricksPile.position.set(5, 0, 3);
    opponentTricksPile.name = 'opponentTricksPile';
    opponentTricksPile.visible = false; // Initially hidden
    this.opponentTricksGroup.add(opponentTricksPile);
    this.cardMeshes.set('opponentTricksPile', opponentTricksPile);
  }

  private createCardMesh(card: Card, faceUp: boolean): THREE.Mesh {
    console.log('Applying material:', this.cardMaterials.get(card.id));
    const materials = [
      this.cardMaterials.get('back')!, // Right
      this.cardMaterials.get('back')!, // Left  
      this.cardMaterials.get('back')!, // Top
      this.cardMaterials.get('back')!, // Bottom
      faceUp ? this.cardMaterials.get(card.id)! : this.cardMaterials.get('back')!, // Front
      this.cardMaterials.get('back')!  // Back
    ];

    const cardMesh = new THREE.Mesh(this.cardGeometry, materials);
    cardMesh.userData = { card, faceUp };
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    
    return cardMesh;
  }

  public playCardToTrick(cardName: string, isPlayer: boolean): void {
    const cardMesh = this.cardMeshes.get(cardName);
    if (!cardMesh) return;

    // Move card to current trick area
    const trickPosition = isPlayer ? 
      new THREE.Vector3(0, 0, -1) : 
      new THREE.Vector3(0, 0, 1);
    
    cardMesh.position.copy(trickPosition);
    
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
      this.cardMeshes.get('playerTricksPile')! : 
      this.cardMeshes.get('opponentTricksPile')!;

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
      topCard.position.set((handSize - 3) * (CARD_WIDTH + 0.1), 0, -5);
    } else {
      this.opponentHandGroup.add(topCard);
      const handSize = this.opponentHandGroup.children.length;
      topCard.position.set((handSize - 3) * (CARD_WIDTH + 0.1), 0, 5);
    }
  }

  public closeTalon(): void {
    // Flip trump card face down
    const trumpCard = this.cardMeshes.get('trumpCard');
    if (trumpCard) {
      trumpCard.rotation.y = Math.PI;
    }
  }

  public onMouseEvent(mouse: THREE.Vector2): void {
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object as THREE.Mesh;
      
      // Handle card clicks
      if (clickedObject.name.startsWith('playerCard_')) {
        this.onCardClick(clickedObject);
      }
    }
  }

  private onCardClick(cardMesh: THREE.Mesh): void {
    // Example: highlight selected card
    if (cardMesh.userData['selected']) {
      cardMesh.position.y = player_Y;
      cardMesh.userData['selected'] = false;
    } else {
      cardMesh.position.y = player_Y+0.3;
      cardMesh.userData['selected'] = true;
    }
  }

  public update(): void {
    // Add any animations or updates here
    // For example, gentle floating animation for selected cards
    this.children.forEach(group => {
      if (group instanceof THREE.Group) {
        group.children.forEach(child => {
          if (child.userData['selected']) {
            child.position.y = (player_Y+0.3) + Math.sin(Date.now() * 0.003) * 0.1;
          }
        });
      }
    });
  }
}
