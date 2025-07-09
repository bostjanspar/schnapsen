import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { Card } from '../models/card.model';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {

  constructor() { }

  public isValidMove(gameState: GameState, card: Card): boolean {
    const player = gameState.players.find(p => p.id === gameState.currentPlayerId);
    if (!player) return false; // Add check for undefined player
    if (!player.hand.includes(card)) return false;

    if (gameState.isTalonClosed || gameState.talon.length === 0) {
      // Strict rules apply
      const ledCard = gameState.currentTrick.length > 0 ? gameState.currentTrick[0].card : null;
      if (ledCard) {
        const ledSuit = ledCard.suit;
        if (card.suit !== ledSuit && player.hand.some(c => c.suit === ledSuit)) {
          return false; // Must follow suit
        }
        if (card.suit === ledSuit && card.value < ledCard.value && player.hand.some(c => c.suit === ledSuit && c.value > ledCard.value)) {
          return false; // Must play a higher card of the same suit if possible
        }
        if (card.suit !== gameState.trumpSuit && player.hand.some(c => c.suit === gameState.trumpSuit) && !player.hand.some(c => c.suit === ledSuit)) {
          return false; // Must play trump if unable to follow suit
        }
      }
    }

    return true;
  }

  public checkHandWinner(gameState: GameState): Player | null {
    for (const player of gameState.players) {
      if (player.score >= 66) {
        return player;
      }
    }

    if (gameState.talon.length === 0 && gameState.players.every(p => p.hand.length === 0)) {
      // Last trick winner wins the hand
      const lastTrickWinner = this.getLastTrickWinner(gameState);
      return lastTrickWinner;
    }

    return null;
  }

  public getLastTrickWinner(gameState: GameState): Player | null {
    if (gameState.tricks.length === 0) return null;
    return gameState.tricks[gameState.tricks.length - 1].winner;
  }

  public checkGameWinner(gameState: GameState): Player | null {
    return gameState.players.find(p => p.gamePoints <= 0) || null;
  }
}