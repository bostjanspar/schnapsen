import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { BaseAnimation } from './base.animation';
import { GameScene } from '../game.scene';
import { Text } from 'troika-three-text';

export class TalonCountAnimation extends BaseAnimation {
  private countText: Text | null = null;

  constructor(scene: GameScene) {
    super(scene);
  }

  /**
   * Animate the talon count display with the specified sequence
   * @param count The number of cards in the talon
   */
  public animateTalonCount(count: number): void {
    // Step 1: Click Feedback - Small bounce or lift with glow
    this.animateClickFeedback(() => {
      // Step 2: Deck Expansion - Stack stretches upward
      this.animateDeckExpansion(() => {
        // Step 3: Card Count Reveal - Floating number fades in
        this.animateCountReveal(count, () => {
          // Step 4: Deck Collapse - Stack compresses back down
          this.animateDeckCollapse();
        });
      });
    });
  }

  private animateClickFeedback(onComplete: () => void): void {
    const talonGroup = this.scene.talonGroup;
    if (talonGroup.children.length === 0) {
      onComplete();
      return;
    }

    // Get the top card of the talon (the visible one)
    const topCard = talonGroup.children[talonGroup.children.length - 1] as THREE.Mesh;
    const originalPosition = topCard.position.clone();

    // Create a subtle glow effect using a temporary material
    const originalMaterial = Array.isArray(topCard.material) 
      ? (topCard.material[0] as THREE.Material).clone() 
      : (topCard.material as THREE.Material).clone();
    
    const glowMaterial = originalMaterial.clone();
    // @ts-ignore - Custom shader property
    if (glowMaterial.hasOwnProperty('emissive')) {
      // @ts-ignore - Custom shader property
      glowMaterial.emissive = new THREE.Color(0xffffff);
      // @ts-ignore - Custom shader property
      glowMaterial.emissiveIntensity = 0.5;
    }

    // Animation sequence: lift up then back down
    new TWEEN.Tween(topCard.position)
      .to({ y: originalPosition.y + 0.2 }, 150)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onStart(() => {
        if (glowMaterial.hasOwnProperty('emissive')) {
          topCard.material = glowMaterial;
        }
      })
      .onComplete(() => {
        new TWEEN.Tween(topCard.position)
          .to({ y: originalPosition.y }, 150)
          .easing(TWEEN.Easing.Quadratic.In)
          .onComplete(() => {
            topCard.material = originalMaterial;
            onComplete();
          })
          .start();
      })
      .start();
  }

  private animateDeckExpansion(onComplete: () => void): void {
    const talonGroup = this.scene.talonGroup;
    if (talonGroup.children.length === 0) {
      onComplete();
      return;
    }

    // Animate cards to separate slightly (expand the deck)
    const animationDuration = 400; // 0.4 seconds
    let completed = 0;
    const totalCards = talonGroup.children.length;

    // We'll expand the cards upward, each card moving slightly more than the one below it
    talonGroup.children.forEach((card, index) => {
      const mesh = card as THREE.Mesh;
      const originalY = mesh.position.y;
      const targetY = originalY + (index * 0.05); // Each card moves 0.05 units higher

      new TWEEN.Tween(mesh.position)
        .to({ y: targetY }, animationDuration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          completed++;
          if (completed === totalCards) {
            onComplete();
          }
        })
        .start();
    });
  }

  private animateCountReveal(count: number, onComplete: () => void): void {
    // Remove existing count text if it exists
    if (this.countText) {
      this.scene.remove(this.countText);
      this.countText = null;
    }

    // Create new text mesh for the count
    const textService = (this.scene as any).textService;
    if (!textService) {
      console.warn('TextService not available in GameScene');
      onComplete();
      return;
    }

    this.countText = textService.createText(count.toString(), 0.5, 0xffffff);
    
    // Position the text above the talon
    const talonPosition = this.scene.talonGroup.position.clone();
    if (this.countText) {
      this.countText.position.set(talonPosition.x, talonPosition.y + 1.5, talonPosition.z);
      this.scene.add(this.countText);
    }

    // Animate text fading in
    new TWEEN.Tween({ opacity: 0 })
      .to({ opacity: 1 }, 300)
      .onUpdate((obj: any) => {
        if (this.countText) {
          // @ts-ignore - Custom property for animation
          this.countText.material.opacity = obj.opacity;
        }
      })
      .onComplete(() => {
        // After fading in, wait 1-2 seconds before collapsing
        setTimeout(() => {
          onComplete();
        }, 1500); // 1.5 seconds delay
      })
      .start();
  }

  private animateDeckCollapse(): void {
    const talonGroup = this.scene.talonGroup;
    if (talonGroup.children.length === 0) {
      return;
    }

    // Animate cards back to their original positions (collapse the deck)
    const animationDuration = 300;
    let completed = 0;
    const totalCards = talonGroup.children.length;

    talonGroup.children.forEach((card) => {
      const mesh = card as THREE.Mesh;
      const targetY = mesh.userData['originalY'] !== undefined 
        ? mesh.userData['originalY'] 
        : mesh.position.y;

      new TWEEN.Tween(mesh.position)
        .to({ y: targetY }, animationDuration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
          completed++;
        })
        .start();
    });
  }

  /**
   * Update the displayed count without animation
   * @param count The new count to display
   */
  public updateCount(count: number): void {
    if (this.countText) {
      this.countText.text = count.toString();
      this.countText.sync();
    } else if (count > 0) {
      // If no text exists but we have cards, create it
      const textService = (this.scene as any).textService;
      if (textService) {
        this.countText = textService.createText(count.toString(), 0.5, 0xffffff);
        
        // Position the text above the talon
        const talonPosition = this.scene.talonGroup.position.clone();
        if (this.countText) {
          this.countText.position.set(talonPosition.x, talonPosition.y + 1.5, talonPosition.z);
          this.scene.add(this.countText);
        }
      }
    }
  }

  /**
   * Remove the count display
   */
  public removeCountDisplay(): void {
    if (this.countText) {
      this.scene.remove(this.countText);
      this.countText = null;
    }
  }
}