import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { BaseScene } from '../base.scene';
import { Card, Suit } from '../../../logic/schnapsen.rules';
import { CardManager } from '../game/cards/card-manager';
import { GameAnimations } from '../game/interactions/game-animations';
import { MaterialFactory } from '../../utils/material.factory';

export class SelectDealerScene extends BaseScene {
  private cardManager!: CardManager;
  private dealerCard!: THREE.Mesh;
  private arrow!: THREE.Mesh;

  constructor(protected override readonly camera: THREE.Camera) {
    super(camera);
    this.background = new THREE.Color(0x1a4a3a);
  }

  public  async initialize(dealerCardData: Card) {
    this.cardManager = new CardManager(this);
    await MaterialFactory.preloadAllMaterials();

    // Display the card
    this.dealerCard = this.cardManager.createCard(dealerCardData, true);
    this.dealerCard.position.set(0, 0, 0);
    this.add(this.dealerCard);

    // Determine dealer and show arrow
    const isPlayerOneDealer = dealerCardData.suit === Suit.HEARTS || dealerCardData.suit === Suit.DIAMONDS;
    this.createArrow(isPlayerOneDealer);

    // Animate the arrow
    if (isPlayerOneDealer) {
      GameAnimations.animateArrowDown(this.arrow);
    } else {
      GameAnimations.animateArrowUp(this.arrow);
    }
  }

  private createArrow(isPlayerOneDealer: boolean) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.5);
    shape.lineTo(0.5, 0);
    shape.lineTo(0.2, 0);
    shape.lineTo(0.2, -0.5);
    shape.lineTo(-0.2, -0.5);
    shape.lineTo(-0.2, 0);
    shape.lineTo(-0.5, 0);
    shape.lineTo(0, 0.5);

    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.arrow = new THREE.Mesh(geometry, material);
    this.arrow.position.set(0, isPlayerOneDealer ? -2 : 2, 0);
    this.add(this.arrow);
  }

  public update() {
    TWEEN.update();
  }

  public onMouseEvent(mouse: THREE.Vector2): void {
  }

  public onMouseMove(mouse: THREE.Vector2): void {
  }
}
