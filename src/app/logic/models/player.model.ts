import { Card } from './card.model';

export interface Player {
  id: number;
  hand: Card[];
  tricks: Card[];
  score: number;
  gamePoints: number;
  hasWonTrick: boolean;
}
