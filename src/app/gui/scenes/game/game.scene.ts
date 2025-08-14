import * as THREE from 'three';
import { BaseScene } from '../base.scene';
import { GameConstants } from '../../../logic/game.constants';
import { CardManager } from './cards/card-manager';
import { GameInteractions } from './interactions/game-interactions';
import { GameAnimations } from './interactions/game-animations';
import { MaterialFactory } from '../../utils/material.factory';
import { ThreeService } from '../../services/three.service';
import TWEEN from '@tweenjs/tween.js';
import { Card } from '../../../logic/schnapsen.rules';
import { CardLayout } from './cards/card-layout';
import { GameLogic } from '../../../logic/game-logic';



export class GameScene extends BaseScene {
  public cardManager!: CardManager;
  private gameInteractions!: GameInteractions;
  private hoveredCard: THREE.Object3D | null = null;
  private hoveredCardPlayable: boolean = false;
  private needsUpdate: boolean = false;
  private gameLogic: GameLogic;
  private trumpCardMesh: THREE.Mesh | null = null;

  
  // Card groups for easy management
  public playerHandGroup: THREE.Group = new THREE.Group();
  public opponentHandGroup: THREE.Group = new THREE.Group();
  public talonGroup: THREE.Group = new THREE.Group();
  public currentTrickGroup: THREE.Group = new THREE.Group();
  public playerTricksGroup: THREE.Group = new THREE.Group();
  public opponentTricksGroup: THREE.Group = new THREE.Group();

 

  constructor(protected override readonly camera: THREE.Camera, gameLogic: GameLogic) {     
    super(camera);
    this.gameLogic = gameLogic;
    //this.background = new THREE.Color(0x1a4a3a); // Dark green table color
    this.background = new THREE.Color(0x111111);
  }

  public async initialize(threeService: ThreeService) {
    this.cardManager = new CardManager(this);
    this.gameInteractions = new GameInteractions(this);

    await MaterialFactory.preloadAllMaterials();
    this.setupTable();
    this.createCardGroups();
    
    console.log('GameScene initialized');
    
  }

  private createCardGroups(): void {
    // Create groups for different card areas
    this.playerHandGroup.name = 'playerHand';
    this.playerHandGroup.visible = true;
    this.add(this.playerHandGroup);

    this.opponentHandGroup.name = 'opponentHand';
    this.add(this.opponentHandGroup);

    this.talonGroup.name = 'talon';
    this.add(this.talonGroup);

    this.currentTrickGroup.name = 'currentTrick';
    this.add(this.currentTrickGroup);

    this.playerTricksGroup.name = 'playerTricks';
    this.add(this.playerTricksGroup);


    this.opponentTricksGroup.name = 'opponentTricks';
    this.add(this.opponentTricksGroup);
  }

  private setupTable(): void {
    // Table surface
    const tableGeometry = new THREE.CircleGeometry(12, 64);
    // Use MeshBasicMaterial directly to ensure color is correct
    const tableMaterial = new THREE.MeshBasicMaterial({ color: GameConstants.TABLE_COLOR }); // Dark green
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = -0.1;
    table.position.z = -5;
    table.name = 'table';
    this.add(table);
  }

  
  public displayHands(playerCards: Card[], opponentCards: Card[]): void {
    this.playerHandGroup.clear();
    const playerHandPositions = CardLayout.calculateHandPositions(playerCards.length);
    playerCards.forEach((card, i) => {
      const cardMesh = this.cardManager.createCard(card, true);
      cardMesh.position.set(playerHandPositions[i].x, playerHandPositions[i].y, playerHandPositions[i].z);
      this.playerHandGroup.add(cardMesh);
    });


    this.opponentHandGroup.clear();
    const opponentHandPositions = CardLayout.calculateHandPositions(opponentCards.length, 0.05);
    opponentCards.forEach((card, i) => {
        const cardMesh = this.cardManager.createCard(card, false);
        cardMesh.position.set(opponentHandPositions[i].x, opponentHandPositions[i].y + 5.5, opponentHandPositions[i].z);
        this.opponentHandGroup.add(cardMesh);
    });
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
    this.gameInteractions.handleCardClick(mouse, this.camera, (card) => {
      if (card.parent !== this.playerHandGroup) {
        return;
      }
      const cardId = card.userData['card']?.id;
      if (cardId) {
        //this.stateMachineManager.onEvent(GameEvent.PLAYER_CLICKED_CARD, { cardId });
      }
    });
  }

  public update(): void {
    // Only update if there are active animations or tweens
    if (TWEEN.getAll().length > 0) {
      TWEEN.update();
      this.needsUpdate = true;
    }
    
    // Only animate hand reorganization if there are selected cards
    const hasSelectedCards = this.playerHandGroup.children.some(child => child.userData['selected']);
    if (hasSelectedCards) {
      GameAnimations.animateHandReorganization(this.playerHandGroup);
      this.needsUpdate = true;
    }
    
    // Reset needsUpdate flag
    this.needsUpdate = false;
  }

  public onMouseMove(mouse: THREE.Vector2): void {
    this.gameInteractions.handleCardHover(mouse, this.camera, (intersectedCard, isPlayable) => {
      let card: THREE.Object3D | null = intersectedCard;

      // Only player cards can be hovered
      if (card && card.parent !== this.playerHandGroup) {
        card = null;
      }
      
      // Case 1: Mouse is not over a new card, but a card was hovered before. Unhover it.
      if (this.hoveredCard && this.hoveredCard !== card) {
        if (this.hoveredCardPlayable) {
          GameAnimations.animatePlayableCardHover(this.hoveredCard as THREE.Mesh, false);
        } else {
          GameAnimations.animateNonPlayableCardHover(this.hoveredCard as THREE.Mesh, false);
        }
        this.hoveredCard = null;
      }

      // Case 2: Mouse is over a new player card. Hover it.
      if (card && card !== this.hoveredCard) {
        this.hoveredCard = card;
        this.hoveredCardPlayable = isPlayable;
        if (isPlayable) {
          GameAnimations.animatePlayableCardHover(card as THREE.Mesh, true);
        } else {
          GameAnimations.animateNonPlayableCardHover(card as THREE.Mesh, true);
        }
      }
    });
  }


  public animateDeal(): void {
    const dealOrder = [
      // First 3 cards
      { isPlayer: false, hand: this.gameLogic.opponentHand, cardIndex: 0 },
      { isPlayer: true, hand: this.gameLogic.playerHand, cardIndex: 0 },
      { isPlayer: false, hand: this.gameLogic.opponentHand, cardIndex: 1 },
      { isPlayer: true, hand: this.gameLogic.playerHand, cardIndex: 1 },
      { isPlayer: false, hand: this.gameLogic.opponentHand, cardIndex: 2 },
      { isPlayer: true, hand: this.gameLogic.playerHand, cardIndex: 2 },
    ];

    const deckPosition = new THREE.Vector3(GameConstants.DECK_LAYOUT.position.x, GameConstants.DECK_LAYOUT.position.y, GameConstants.DECK_LAYOUT.position.z);
    let animationDelay = 0;
    const animationStepDelay = 200;

    // Animate first 3 cards
    dealOrder.forEach((deal) => {
      const card = deal.hand[deal.cardIndex];
      // Create cards with correct face orientation:
      // - Opponent cards: always face down (false) - back texture shown
      // - Player cards: always face up (true) - face texture shown
      const cardMesh = this.cardManager.createCard(card, deal.isPlayer);
      cardMesh.position.copy(deckPosition);
      this.add(cardMesh);

      // Calculate correct positions based on the displayHands method
      const playerHandPositions = CardLayout.calculateHandPositions(this.gameLogic.playerHand.length);
      const opponentHandPositions = CardLayout.calculateHandPositions(this.gameLogic.opponentHand.length, 0.05); // Use 0.05 spacing for opponent
      
      let targetPosition;
      if (deal.isPlayer) {
        // Player cards at bottom
        targetPosition = new THREE.Vector3(
          playerHandPositions[deal.cardIndex].x, 
          playerHandPositions[deal.cardIndex].y, 
          playerHandPositions[deal.cardIndex].z
        );
      } else {
        // Opponent cards at top (y + 5.5)
        targetPosition = new THREE.Vector3(
          opponentHandPositions[deal.cardIndex].x, 
          opponentHandPositions[deal.cardIndex].y + 5.5, 
          opponentHandPositions[deal.cardIndex].z
        );
      }

      GameAnimations.animateCardDeal(cardMesh, deal.isPlayer, targetPosition, animationDelay, () => {
        const targetGroup = deal.isPlayer ? this.playerHandGroup : this.opponentHandGroup;
        targetGroup.add(cardMesh);
      });
      animationDelay += animationStepDelay;
    });

    // Animate trump card
    const trumpCard = this.gameLogic.trumpCard;
    if (trumpCard) {
      // Trump card should be face up (player can see it)
      const trumpMesh = this.cardManager.createCard(trumpCard, true);
      trumpMesh.position.copy(deckPosition);
      this.add(trumpMesh);
      
      const trumpPosition = new THREE.Vector3(
        GameConstants.TALON_LAYOUT.position.x + 1, 
        GameConstants.TALON_LAYOUT.position.y, 
        GameConstants.TALON_LAYOUT.position.z - 0.1
      );

      GameAnimations.animateCardDeal(trumpMesh, true, trumpPosition, animationDelay, () => {
        this.trumpCardMesh = trumpMesh;
        this.talonGroup.add(trumpMesh);
        trumpMesh.rotateZ(Math.PI/2);
      });
      animationDelay += animationStepDelay;
    }

    const dealOrder2 = [
      // Next 2 cards
      { isPlayer: false, hand: this.gameLogic.opponentHand, cardIndex: 3 },
      { isPlayer: true, hand: this.gameLogic.playerHand, cardIndex: 3 },
      { isPlayer: false, hand: this.gameLogic.opponentHand, cardIndex: 4 },
      { isPlayer: true, hand: this.gameLogic.playerHand, cardIndex: 4 },
    ];

    dealOrder2.forEach((deal) => {
      const card = deal.hand[deal.cardIndex];
      // Create cards with correct face orientation:
      // - Opponent cards: always face down (false) - back texture shown
      // - Player cards: always face up (true) - face texture shown
      const cardMesh = this.cardManager.createCard(card, deal.isPlayer);
      cardMesh.position.copy(deckPosition);
      this.add(cardMesh);

      // Calculate correct positions based on the displayHands method
      const playerHandPositions = CardLayout.calculateHandPositions(this.gameLogic.playerHand.length);
      const opponentHandPositions = CardLayout.calculateHandPositions(this.gameLogic.opponentHand.length, 0.05); // Use 0.05 spacing for opponent
      
      let targetPosition;
      if (deal.isPlayer) {
        // Player cards at bottom
        targetPosition = new THREE.Vector3(
          playerHandPositions[deal.cardIndex].x, 
          playerHandPositions[deal.cardIndex].y, 
          playerHandPositions[deal.cardIndex].z
        );
      } else {
        // Opponent cards at top (y + 5.5)
        targetPosition = new THREE.Vector3(
          opponentHandPositions[deal.cardIndex].x, 
          opponentHandPositions[deal.cardIndex].y + 5.5, 
          opponentHandPositions[deal.cardIndex].z
        );
      }

      GameAnimations.animateCardDeal(cardMesh, deal.isPlayer, targetPosition, animationDelay, () => {
        const targetGroup = deal.isPlayer ? this.playerHandGroup : this.opponentHandGroup;
        targetGroup.add(cardMesh);
      });
      animationDelay += animationStepDelay;
    });

    // Animate talon
    if (this.gameLogic.talon.length > 0) {
      // Talon card should be face down (player cannot see it)
      const talonStack = this.cardManager.createCard(this.gameLogic.talon[0], false);
      talonStack.position.copy(deckPosition);
      this.add(talonStack);
      
      const talonPosition = new THREE.Vector3(
        GameConstants.TALON_LAYOUT.position.x, 
        GameConstants.TALON_LAYOUT.position.y, 
        GameConstants.TALON_LAYOUT.position.z
      );

      GameAnimations.animateCardDeal(talonStack, false, talonPosition, animationDelay, () => {
        this.talonGroup.add(talonStack);

        this.displayHands(this.gameLogic.playerHand, this.gameLogic.opponentHand);
        this.updateTalonDisplay(this.gameLogic.talon);
        if (this.gameLogic.trumpCard) {
          this.updateTrumpCardDisplay(this.gameLogic.trumpCard);
        }
        this.sortPlayerHand();
        console.log("animation done");
        
      });
    }
  }

  private sortPlayerHand(): void {
    // Get current positions of cards in player's hand
    const currentCards = [...this.playerHandGroup.children];
    const currentPositions = currentCards.map(card => card.position.clone());
    
    // Sort the hand in the game logic
    const sortedHand = this.gameLogic.sortPlayerHand();
    
    // Calculate new positions for sorted cards
    const newPositions = CardLayout.calculateHandPositions(sortedHand.length);
    
    // Create a mapping of card IDs to their new positions
    const cardIdToNewPosition: Record<string, THREE.Vector3> = {};
    sortedHand.forEach((card, index) => {
      cardIdToNewPosition[card.id] = new THREE.Vector3(
        newPositions[index].x,
        newPositions[index].y,
        newPositions[index].z
      );
    });
    
    // Animate each card to its new position
    const animationDuration = 500; // ms
    currentCards.forEach((cardMesh, index) => {
      const cardId = cardMesh.userData['card']?.id;
      if (cardId && cardIdToNewPosition[cardId]) {
        const targetPosition = cardIdToNewPosition[cardId];
        
        new TWEEN.Tween(cardMesh.position)
          .to(targetPosition, animationDuration)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
      }
    });
  }

  /**
   * Refresh the display based on current GameLogic state
   * This method should be called manually from the GUI controller when game state changes
   */
  public dealNewCards(): void {
    this.animateDeal();
  }

  private updateTalonDisplay(talonCards: Card[]): void {
    // Clear existing talon display
    this.talonGroup.clear();
    
    // Create a simple visual representation of the talon (just showing the count)
    const talonPosition = GameConstants.TALON_LAYOUT.position;
    
    // Create a placeholder card to represent the talon stack
    if (talonCards.length > 0) {
      
      const cardMesh = this.cardManager.createCard(talonCards[0], false);;
      cardMesh.position.set(talonPosition.x, talonPosition.y, talonPosition.z);
      cardMesh.name = 'talonStack';
      
      this.talonGroup.add(cardMesh);
      
      
    }
  }

  private updateTrumpCardDisplay(trumpCard: Card): void {
    // Remove existing trump card if it exists
    if (this.trumpCardMesh) {
      this.remove(this.trumpCardMesh);
      this.trumpCardMesh = null;
    }
    
    // Create a new trump card mesh and position it below the talon
    const trumpCardMesh = this.cardManager.createCard(trumpCard, true); // Trump card is face up
    const talonPosition = GameConstants.TALON_LAYOUT.position;

    trumpCardMesh.rotateZ(Math.PI/2); // Rotate trump card 90 degrees
    // Position trump card below the talon
    trumpCardMesh.position.set(
      talonPosition.x + 1,
      talonPosition.y,  // Position below the talon
      talonPosition.z - 0.1
     );
    trumpCardMesh.name = 'trumpCard';
    
    // Store reference to the trump card mesh
    this.trumpCardMesh = trumpCardMesh;
    
    // Add to scene
    this.add(trumpCardMesh);
  }

}
