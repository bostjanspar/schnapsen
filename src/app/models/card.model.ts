
export enum Suit {
  Hearts,
  Diamonds,
  Clubs,
  Spades
}

export enum Rank {
  Ace = 'A',
  Ten = '10',
  King = 'K',
  Queen = 'Q',
  Jack = 'J'
}

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}
