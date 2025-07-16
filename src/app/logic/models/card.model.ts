
import { Suit } from './suit.enum';
import { Rank } from './rank.enum';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}
