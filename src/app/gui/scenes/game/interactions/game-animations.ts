import * as THREE from 'three';
import { CardDealAnimation } from '../anime/card-deal.animation';
import { CardPlayAnimation } from '../anime/card-play.animation';
import { CardHoverAnimation } from '../anime/card-hover.animation';
import { HandAnimation } from '../anime/hand.animation';
import { GameScene } from '../game.scene';

// Facade class that delegates to specialized animation classes
export class GameAnimations {
  static animateCardDeal(card: THREE.Mesh, isPlayer: boolean, toPos: THREE.Vector3, delay: number, onComplete: () => void = () => {}): void {
    // This is a static method, so we can't pass a real GameScene instance
    // We'll need to create a minimal implementation or refactor code that uses this
    const cardDealAnimation = new CardDealAnimation(null as any);
    cardDealAnimation.animateCardDeal(card, isPlayer, toPos, delay, onComplete);
  }

  static animateCardPlay(card: THREE.Mesh, fromPos: any, toPos: any): void {
    const cardPlayAnimation = new CardPlayAnimation(null as any);
    cardPlayAnimation.animateCardPlay(card, fromPos, toPos);
  }

  static animatePlayableCardHover(card: THREE.Mesh, isHovering: boolean): void {
    const cardHoverAnimation = new CardHoverAnimation(null as any);
    cardHoverAnimation.animatePlayableCardHover(card, isHovering);
  }

  static animateNonPlayableCardHover(card: THREE.Mesh, isHovering: boolean): void {
    const cardHoverAnimation = new CardHoverAnimation(null as any);
    cardHoverAnimation.animateNonPlayableCardHover(card, isHovering);
  }

  static animateHandReorganization(hand: THREE.Group): void {
    const handAnimation = new HandAnimation(null as any);
    handAnimation.animateHandReorganization(hand);
  }
}
