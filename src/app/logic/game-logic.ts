import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card, Suit, Rank, CARD_VALUES } from './schnapsen.rules';
import { RandomService } from './random.service';


export class GameLogic {

  //overall game state 
  public dealer$ = new BehaviorSubject<number>(-1);
  public playerPoints$ = new BehaviorSubject<number>(7);
  public opponentPoints$ = new BehaviorSubject<number>(7);

  //current game state
  public deck$ = new BehaviorSubject<Card[]>([]);
  public playerHand$ = new BehaviorSubject<Card[]>([]);
  public opponentHand$ = new BehaviorSubject<Card[]>([]);
  public talon$ = new BehaviorSubject<Card[]>([]);
  public trumpCard$ = new BehaviorSubject<Card | null>(null);
  public isTalonClosed$ = new BehaviorSubject<boolean>(false);
  
  public isPlayerTurn$ = new BehaviorSubject<boolean>(false);
  public playerTricks$ = new BehaviorSubject<Card[]>([]);
  public opponentTricks$ = new BehaviorSubject<Card[]>([]);

  //trick
  public currentTrick$ = new BehaviorSubject<[Card | null, Card | null]>([null, null]);

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

  public evaluate(trick: [Card, Card],  playerLeads: boolean): boolean {
    const [playerCard, opponentCard] = trick;
    const leaderCard = playerLeads ? playerCard : opponentCard;
    const followerCard = playerLeads ? opponentCard : playerCard;
    const trumpSuit = this.trumpCard?.suit;

    const leaderIsTrump = leaderCard.suit === trumpSuit
    const followerIsTrump = followerCard.suit === trumpSuit;

    // Case 1: One card is a trump, the other is not. The trump card wins.
    if (leaderIsTrump && !followerIsTrump) {
      return playerLeads // Leader played trump, follower didn't. Leader wins.
    }
    if (!leaderIsTrump && followerIsTrump) {
      return !playerLeads // Follower played trump. Follower wins.
    }

    // Case 2: Both cards are of the same suit (either trump or non-trump). The higher value card wins.
    if (leaderCard.suit === followerCard.suit) {
      return leaderCard.value > followerCard.value // Leader's card is higher. Leader wins.        
    }

    // Case 3: Both cards are non-trump and of different suits. The leader wins.
    return playerLeads; // Leader wins because follower did not follow suit.
  }

  public canPlayerPlayCard(card: Card, playerLeads: boolean): boolean {
    return this.canPlayCard(card, playerLeads ? null : this.currentTrick$.getValue()[1], this.playerHand$.getValue());
  }

  public canOpponentPlayCard(card: Card, playerLeads: boolean): boolean {
    return this.canPlayCard(card, playerLeads ? null : this.currentTrick$.getValue()[0], this.opponentHand$.getValue());
  }

  private canPlayCard(card: Card, opponentCard: Card | null, playerHand: Card[]): boolean {
    if (opponentCard) {
      if (this.isTalonClosed) {        
        // Talon is closed, must follow suit if possible, or  otherwise can play any card
        if (card.suit === opponentCard.suit) {
          return true; // Following suit
        }

        if (card.suit === this.trumpCard?.suit) {
          return true; // Playing trump
        }

        for (const handCard of playerHand) { 
          if (handCard.suit === opponentCard.suit){
            return false; // Must follow suit if possible
          }
        }
        return false;
      } else {// Talon is open, can play any card
        return true;
      }      
    } 
    return true; // No opponent card, can play any card
  }
      
      


  /**
   * Sorts the player's hand first by suit, then by rank and updates the playerHand$ BehaviorSubject
   * @returns A new sorted array of cards
   */
  public sortPlayerHand(): Card[] {
    // If no hand is provided, use the current player hand
    const cardsToSort = [...this.playerHand];
    
    // Define suit order (you can adjust this as needed)
    const suitOrder: Record<Suit, number> = {
      [Suit.HEARTS]: 0,
      [Suit.DIAMONDS]: 1,
      [Suit.CLUBS]: 2,
      [Suit.SPADES]: 3
    };
    
    // Define rank order (from lowest to highest according to Schnapsen rules)
    const rankOrder: Record<Rank, number> = {
      [Rank.JACK]: 1,
      [Rank.QUEEN]: 2,
      [Rank.KING]: 3,
      [Rank.TEN]: 4,
      [Rank.ACE]: 5
    };
    
    // Sort the cards
    const sortedCards = cardsToSort.sort((a, b) => {
      // First sort by suit
      if (suitOrder[a.suit] !== suitOrder[b.suit]) {
        return suitOrder[a.suit] - suitOrder[b.suit];
      }
      // Then sort by rank
      return rankOrder[a.rank] - rankOrder[b.rank];
    });
    
    this.playerHand$.next(sortedCards);
    return sortedCards;
  }

}
