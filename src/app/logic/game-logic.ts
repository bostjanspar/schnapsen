import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card, Suit, Rank, CARD_VALUES } from './schnapsen.rules';
import { RandomService } from './random.service';


export class GameLogic {

  public dealer$ = new BehaviorSubject<number>(-1);
  public playerPoints$ = new BehaviorSubject<number>(7);
  public opponentPoints$ = new BehaviorSubject<number>(7);
  public deck$ = new BehaviorSubject<Card[]>([]);
  public playerHand$ = new BehaviorSubject<Card[]>([]);
  public opponentHand$ = new BehaviorSubject<Card[]>([]);
  public talon$ = new BehaviorSubject<Card[]>([]);
  public trumpCard$ = new BehaviorSubject<Card | null>(null);
  public isTalonClosed$ = new BehaviorSubject<boolean>(false);

  // Getter methods for read-only access
  public get dealer(): number {
    return this.dealer$.getValue();
  }

  public get playerPoints(): number {
    return this.playerPoints$.getValue();
  }

  public get opponentPoints(): number {
    return this.opponentPoints$.getValue();
  }

  public get deck(): Card[] {
    return this.deck$.getValue();
  }

  public get playerHand(): Card[] {
    return this.playerHand$.getValue();
  }

  public get opponentHand(): Card[] {
    return this.opponentHand$.getValue();
  }

  public get talon(): Card[] {
    return this.talon$.getValue();
  }

  public get trumpCard(): Card | null {
    return this.trumpCard$.getValue();
  }

  public get isTalonClosed(): boolean {
    return this.isTalonClosed$.getValue();
  }

  constructor(private readonly randomService: RandomService) { 

  }

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
}
