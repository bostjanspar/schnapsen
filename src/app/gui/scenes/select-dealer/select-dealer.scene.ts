import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { BaseScene } from '../base.scene';
import { Card } from '../../../logic/schnapsen.rules';
import { CardManager } from '../game/cards/card-manager';
import { MaterialFactory } from '../../utils/material.factory';
import { UIUtils } from '../../utils/ui.utils';
import { Subject } from 'rxjs';
import { SimpleEvent } from '../../../events/event.enum';

export class SelectDealerScene extends BaseScene {
  private arrow!: THREE.Mesh;

  constructor(private readonly eventPush: Subject<SimpleEvent>,
    protected override readonly camera: THREE.Camera) {
    super(camera);
    this.background = new THREE.Color(0x1a4a3a);
  }

  public async initialize(dealerCardData: Card | null, isPlayerOneDealer: boolean = true){
    if (dealerCardData) {
      const cardManager = new CardManager(this);
      await MaterialFactory.preloadAllMaterials();

      // Display the card
      const dealerCard = cardManager.createCard(dealerCardData, true);
      dealerCard.position.set(0, 0, 0);
      this.add(dealerCard);

      const label = UIUtils.createLabel('Select Dealer', { width: 3, height: 1.5 }, 
      { x: -4, y: 0, z: 0 },
       { foregroundColor: '#ffff00', fontSize: 32 });
    label.name = 'dealerLabel';
    this.add(label);

    }else {

      const label = UIUtils.createLabel('Game Dealer', { width: 3, height: 1.5 }, 
      { x: 0, y: 0, z: 0 },
       { foregroundColor: '#ffff00', fontSize: 32 });
      label.name = 'dealerLabel';
      this.add(label);
    }

    
    
    this.createArrow(isPlayerOneDealer);
    this.animateArrow(isPlayerOneDealer);
    
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
    if (!isPlayerOneDealer) {
      this.arrow.rotation.z = Math.PI;
    }
    this.arrow.position.set(0, isPlayerOneDealer ? 2.5 :-2.5, 0);
    this.add(this.arrow);
  }

private animateArrow(up: boolean): void {
    const initialY = this.arrow.position.y;
    const targetOffset = up ? 0.5 : -0.5;
    const arrowAnim = { progress: 0 };

    new TWEEN.Tween(arrowAnim)
        .to({ progress: 1 }, 5000) // 5 seconds total duration
        .easing(TWEEN.Easing.Linear.None) // Use linear easing for smooth control
        .onUpdate(() => {
            // Create 3 full cycles in 5 seconds
            const cycles = 3;
            const sineValue = Math.sin(arrowAnim.progress * Math.PI * 2 * cycles);
            
            // Apply ease-in-out to create slow down at peaks/valleys
            // This creates a more dramatic slowing effect at extremes
            const easedSine = Math.sign(sineValue) * Math.pow(Math.abs(sineValue), 0.4);
            
            this.arrow.position.y = initialY + (easedSine * targetOffset);
        })
        .onStart(() => {
            this.arrow.visible = true;
        })
        .onComplete(() => {
            this.arrow.position.y = initialY; // Reset to original position
            console.log('Animation is done');
        })
        .start();
  }

  public update() {
    TWEEN.update();
  }

  public onMouseEvent(mouse: THREE.Vector2): void {
  }

  public onMouseMove(mouse: THREE.Vector2): void {
  }
}
