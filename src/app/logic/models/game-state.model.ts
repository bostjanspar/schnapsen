import { Card } from './card.model';
import { Suit } from './suit.enum';
import { Player } from './player.model';

export interface GameState {
  players: Player[];
  deck: Card[];
  talon: Card[];
  trumpCard?: Card;
  trumpSuit?: Suit;
  isTalonClosed: boolean;
  currentPlayerId: number;
  dealerId: number;
  currentTrick: { player: Player, card: Card }[];
  tricks: { winner: Player, trick: Card[] }[];
}
