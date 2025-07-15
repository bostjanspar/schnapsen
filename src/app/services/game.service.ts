import { inject, Injectable } from '@angular/core';

import { Card } from '../models/card.model';
import { Player } from '../models/player.model';
import { StateMachineService } from './state-machine.service';
import { TrickService } from './trick.service';
import { PlayerService } from './player.service';
import { GameStateName } from '../models/game-state-name.enum';
import { Suit } from '../models/suit.enum';
import { Rank } from '../models/rank.enum';
import { GameState } from '../models/game-state.model';
import { GameLogicService } from './game-logic.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameState!: GameState;

  stateMachineService = inject(StateMachineService);
  private trickService = inject(TrickService);
  private playerService = inject(PlayerService);
  private gameLogicService = inject(GameLogicService);

  public getGameState(): GameState {
    return this.gameState;
  }

  public newGame(): void {
    const players: Player[] = [
      { id: 1, hand: [], tricks: [], score: 0, gamePoints: 7, hasWonTrick: false },
      { id: 2, hand: [], tricks: [], score: 0, gamePoints: 7, hasWonTrick: false }
    ];

    this.gameState = {
      players,
      deck: this.initializeDeck(),
      talon: [],
      trumpCard: undefined, // Use undefined for optional properties
      trumpSuit: undefined, // Use undefined for optional properties
      isTalonClosed: false,
      currentPlayerId: 1, // Non-dealer starts
      dealerId: 2,
      currentTrick: [],
      tricks: []
    };

    this.dealCards();
  }

  private initializeDeck(): Card[] {
    const suits = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];
    const ranks = [Rank.Ace, Rank.Ten, Rank.King, Rank.Queen, Rank.Jack];
    const values = {
      [Rank.Ace]: 11,
      [Rank.Ten]: 10,
      [Rank.King]: 4,
      [Rank.Queen]: 3,
      [Rank.Jack]: 2
    };

    const deck: Card[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank, value: values[rank] });
      }
    }

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  private dealCards(): void {
    this.gameState.players.forEach((p: Player) => p.hand = []);

    // Deal 3 cards to each player
    for (let i = 0; i < 3; i++) {
      this.gameState.players.forEach((p: Player) => {
        this.playerService.drawCard(this.gameState, p);
      });
    }

    // Set trump card
    const trumpCard = this.gameState.deck.pop();
    if (trumpCard) {
      this.gameState.trumpCard = trumpCard;
      this.gameState.trumpSuit = trumpCard.suit;
    }


    // Deal 2 more cards to each player
    for (let i = 0; i < 2; i++) {
      this.gameState.players.forEach((p: Player) => {
        this.playerService.drawCard(this.gameState, p);
      });
    }

    this.gameState.talon = [...this.gameState.deck];
    this.gameState.deck = [];
  }

  public playCard(card: Card): void {
    if (this.gameLogicService.isValidMove(this.gameState, card)) {
      this.trickService.playCard(this.gameState, card);

      if (this.gameState.currentTrick.length === 0) {
        const winner = this.gameLogicService.getLastTrickWinner(this.gameState);
        if (winner) {
          const loser = this.gameState.players.find((p: Player) => p.id !== winner.id);
          if (loser) {
            this.playerService.drawCard(this.gameState, winner);
            this.playerService.drawCard(this.gameState, loser);
          }
        }
        const handWinner = this.gameLogicService.checkHandWinner(this.gameState);
        if (handWinner) {
          this.stateMachineService.transitionTo(GameStateName.HAND_END, handWinner);
        } else if (this.isLastTrick()) { 
          const lastTrickWinner = this.gameLogicService.getLastTrickWinner(this.gameState); 
          if (lastTrickWinner) {
            this.stateMachineService.transitionTo(GameStateName.HAND_END, lastTrickWinner);
          }
        } else {
          this.stateMachineService.transitionTo(GameStateName.TRICK_START); // Winner leads next
        }
      }
    }
  }

  public calculateHandResult(winner: Player): void {
    const loser = this.gameState.players.find((p: Player) => p.id !== winner.id);
    if (!loser) return; 

    let points = 1;
    if (loser.score < 33) {
      points = 2; // Schneider
    }
    if (loser.tricks.length === 0) {
      points = 3; // Schwarz
    }
    winner.gamePoints -= points;
  }

  public resetHand(): void {
    this.gameState.deck = this.initializeDeck();
    this.gameState.talon = [];
    this.gameState.trumpCard = undefined; 
    this.gameState.trumpSuit = undefined; 
    this.gameState.isTalonClosed = false;
    this.gameState.currentTrick = [];
    this.gameState.tricks = [];
    this.gameState.players.forEach((p: Player) => {
      p.hand = [];
      p.tricks = [];
      p.score = 0;
      p.hasWonTrick = false;
    });
    this.dealCards();
  }

  public exchangeTrumpJack(): void {
    const player = this.gameState.players.find((p: Player) => p.id === this.gameState.currentPlayerId);
    if (!player) return;

    if (this.gameState.trumpSuit === undefined) return;

    const jackIndex = player.hand.findIndex((c: Card) => c.rank === Rank.Jack && c.suit === this.gameState.trumpSuit);
    if (jackIndex === -1) return; 

    if (this.gameState.talon.length === 0 || this.gameState.isTalonClosed) return; 

    const jack = player.hand[jackIndex];
    const trumpCard = this.gameState.trumpCard; 
    if (trumpCard) { 
      player.hand.splice(jackIndex, 1);
      player.hand.push(trumpCard);
      this.gameState.trumpCard = jack;
    }
  }

  public declareMarriage(marriage: { king: Card, queen: Card }): void {
    const player = this.gameState.players[this.gameState.currentPlayerId - 1]; // Assuming currentPlayerId is 1-based
    if (!player || !player.hasWonTrick) return;

    const kingIndex = player.hand.findIndex((c: Card) => c.rank === marriage.king.rank && c.suit === marriage.king.suit);
    const queenIndex = player.hand.findIndex((c: Card) => c.rank === marriage.queen.rank && c.suit === marriage.queen.suit);

    if (kingIndex === -1 || queenIndex === -1) return; 

    if (this.gameState.trumpSuit === undefined) return;

    const points = marriage.king.suit === this.gameState.trumpSuit ? 40 : 20;
    player.score += points;
  }

  public closeTalon(): void {
    if (this.gameState.talon.length < 3) return;
    this.gameState.isTalonClosed = true;
  }

  public checkHandWinner(): Player | null {
    return this.gameLogicService.checkHandWinner(this.gameState);
  }

  public getLastTrickWinner(): Player | null {
    return this.gameLogicService.getLastTrickWinner(this.gameState);
  }

  public checkGameWinner(): Player | null {
    return this.gameLogicService.checkGameWinner(this.gameState);
  }

  public isLastTrick(): boolean {
    return this.gameState.talon.length === 0 && this.gameState.players.every((p: Player) => p.hand.length === 1);
  }
}
