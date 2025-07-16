import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { TweenService } from './tween-service';
import { CardRenderer } from './card-renderer';
import { Card } from '../../logic/models/card.model';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private tweenService = inject(TweenService);
  private cardRenderer = inject(CardRenderer);

  // CardMoveAnimation methods
  moveCard(cardMesh: THREE.Mesh, targetPosition: THREE.Vector3, duration: number = 1): Promise<void> {
    return new Promise(resolve => {
      this.tweenService.to(cardMesh.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: duration,
        onComplete: resolve
      });
    });
  }

  // CardFlipAnimation methods
  flipCard(cardMesh: THREE.Mesh, duration: number = 0.5): Promise<void> {
    return new Promise(resolve => {
      this.tweenService.to(cardMesh.rotation, {
        y: cardMesh.rotation.y + Math.PI, // Flip 180 degrees around Y-axis
        duration: duration,
        onComplete: resolve
      });
    });
  }

  // CardDealAnimation methods
  async dealCard(card: Card, startPosition: THREE.Vector3, targetPosition: THREE.Vector3, scene: THREE.Scene, duration: number = 0.5): Promise<THREE.Mesh> {
    const cardMesh = await this.cardRenderer.renderCard(card, false, false, false, false); // Deal face down
    cardMesh.position.copy(startPosition);
    scene.add(cardMesh);

    await this.moveCard(cardMesh, targetPosition, duration);
    return cardMesh;
  }

  // CardHighlightAnimation methods
  highlightCard(cardMesh: THREE.Mesh, duration: number = 0.2): Promise<void> {
    return new Promise(resolve => {
      this.tweenService.to(cardMesh.position, {
        y: cardMesh.position.y + 0.1, // Lift card slightly
        duration: duration,
        yoyo: true, // Go back to original position
        repeat: 1, // Repeat once (up and down)
        onComplete: resolve
      });
    });
  }

  unhighlightCard(cardMesh: THREE.Mesh, duration: number = 0.2): Promise<void> {
    return new Promise(resolve => {
      this.tweenService.to(cardMesh.position, {
        y: cardMesh.position.y, // Return to original Y position
        duration: duration,
        onComplete: resolve
      });
    });
  }

  // TrickAnimation methods
  async playTrick(leadCardMesh: THREE.Mesh, followCardMesh: THREE.Mesh, trickAreaPosition: THREE.Vector3): Promise<void> {
    // Animate lead card to trick area
    await this.moveCard(leadCardMesh, trickAreaPosition.clone().add(new THREE.Vector3(-0.3, 0, 0)));

    // Animate follow card to trick area
    await this.moveCard(followCardMesh, trickAreaPosition.clone().add(new THREE.Vector3(0.3, 0, 0)));

    // Placeholder for trick resolution animation (e.g., cards flying to winner)
    console.log('Trick played, animating resolution...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate animation time
  }

  // MarriageAnimation methods
  async declareMarriage(kingCardMesh: THREE.Mesh, queenCardMesh: THREE.Mesh, scoreDisplayPosition: THREE.Vector3): Promise<void> {
    // Animate cards to a prominent position
    await Promise.all([
      this.moveCard(kingCardMesh, scoreDisplayPosition.clone().add(new THREE.Vector3(-0.5, 0, 0))),
      this.moveCard(queenCardMesh, scoreDisplayPosition.clone().add(new THREE.Vector3(0.5, 0, 0)))
    ]);

    // Placeholder for score popup animation
    console.log('Marriage declared, animating score popup...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate animation time

    // Animate cards back to hand or collected pile
    // (This would depend on game logic, omitted for now)
  }

  // TrumpExchangeAnimation methods
  async exchangeTrump(jackCardMesh: THREE.Mesh, trumpCardMesh: THREE.Mesh, playerHandPosition: THREE.Vector3, trumpPosition: THREE.Vector3): Promise<void> {
    // Animate jack to trump position
    await this.moveCard(jackCardMesh, trumpPosition);

    // Animate trump card to player hand position
    await this.moveCard(trumpCardMesh, playerHandPosition);

    console.log('Trump exchange animated.');
  }

  // TalonCloseAnimation methods
  async closeTalonAnimation(trumpCardMesh: THREE.Mesh, talonStackMeshes: THREE.Mesh[]): Promise<void> {
    // Animate trump card flip
    await this.flipCard(trumpCardMesh);

    // Animate talon cards to stack (if not already stacked)
    for (const cardMesh of talonStackMeshes) {
      await this.moveCard(cardMesh, trumpCardMesh.position); // Move to trump card position
    }

    console.log('Talon closing animated.');
  }
}

