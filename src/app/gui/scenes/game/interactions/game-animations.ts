import * as THREE from 'three';
import { CardDealAnimation } from '../anime/card-deal.animation';
import { CardPlayAnimation } from '../anime/card-play.animation';
import { CardHoverAnimation } from '../anime/card-hover.animation';
import { HandAnimation } from '../anime/hand.animation';

// Facade class that delegates to specialized animation classes
export class GameAnimations {
  static animateCardDeal(card: THREE.Mesh, isPlayer: boolean, toPos: THREE.Vector3, delay: number, onComplete: () => void = () => {}): void {
    const cardDealAnimation = new CardDealAnimation();
    cardDealAnimation.animateCardDeal(card, isPlayer, toPos, delay, onComplete);
  }

  static animateCardPlay(card: THREE.Mesh, fromPos: any, toPos: any): void {
    const cardPlayAnimation = new CardPlayAnimation();
    cardPlayAnimation.animateCardPlay(card, fromPos, toPos);
  }

  static animatePlayableCardHover(card: THREE.Mesh, isHovering: boolean): void {
    const cardHoverAnimation = new CardHoverAnimation();
    cardHoverAnimation.animatePlayableCardHover(card, isHovering);
  }

  static animateNonPlayableCardHover(card: THREE.Mesh, isHovering: boolean): void {
    const cardHoverAnimation = new CardHoverAnimation();
    cardHoverAnimation.animateNonPlayableCardHover(card, isHovering);
  }

  static animateHandReorganization(hand: THREE.Group): void {
    const handAnimation = new HandAnimation();
    handAnimation.animateHandReorganization(hand);
  }
}
