import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card, Suit, Rank, CARD_VALUES } from './schnapsen.rules';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  public playerPoints$ = new BehaviorSubject<number>(7);
  public opponentPoints$ = new BehaviorSubject<number>(7);
  public deck$ = new BehaviorSubject<Card[]>([]);
  public playerHand$ = new BehaviorSubject<Card[]>([]);
  public opponentHand$ = new BehaviorSubject<Card[]>([]);
  public talon$ = new BehaviorSubject<Card[]>([]);
  public trumpCard$ = new BehaviorSubject<Card | null>(null);
  public isTalonClosed$ = new BehaviorSubject<boolean>(false);

  constructor(private randomService: RandomService) { }

  public selectDealer(): Card {
    const deck = this.initializeDeck();
    const shuffledDeck = this.shuffleDeck(deck);
    return shuffledDeck[0];
  }

  public prepareNewHand(): void {
    const deck = this.initializeDeck();
    const shuffledDeck = this.shuffleDeck(deck);
    this.dealCards(shuffledDeck);
  }

  private initializeDeck(): Card[] {
    const deck: Card[] = [];
    Object.values(Suit).forEach(suit => {
      Object.values(Rank).forEach(rank => {
        deck.push({
          suit,
          rank,
          value: CARD_VALUES[rank],
          id: `${suit}_${rank}`
        });
      });
    });
    return deck;
  }

  private shuffleDeck(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = this.randomService.getRandomNumber(i + 1);
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  private dealCards(deck: Card[]): void {
    const playerHand = deck.slice(0, 5);
    const opponentHand = deck.slice(5, 10);
    const talon = deck.slice(11); // 10 cards for players, 1 for trump
    const trumpCard = deck[10];

    this.playerHand$.next(playerHand);
    this.opponentHand$.next(opponentHand);
    this.talon$.next(talon);
    this.trumpCard$.next(trumpCard);
    this.deck$.next(deck);
  }

  public getCurrentHands(): { playerHand: Card[], opponentHand: Card[] } {
    return {
      playerHand: this.playerHand$.getValue(),
      opponentHand: this.opponentHand$.getValue()
    };
  }
}
