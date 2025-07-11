import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { Suit } from '../models/suit.enum';
import { Player } from '../models/player.model';
import { GameState } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class TrickService {

  

  public playCard(gameState: GameState, card: Card): GameState {
    const player = gameState.players.find(p => p.id === gameState.currentPlayerId);
    if (!player) return gameState; // Should not happen

    const cardIndex = player.hand.findIndex(c => c.rank === card.rank && c.suit === card.suit);
    player.hand.splice(cardIndex, 1);

    gameState.currentTrick.push({ player, card });

    if (gameState.currentTrick.length === 2) {
      const winner = this.determineTrickWinner(gameState);
      this.awardTrick(gameState, winner);
      gameState.currentTrick = [];
      gameState.currentPlayerId = winner.id;
    } else {
      const nextPlayer = gameState.players.find(p => p.id !== gameState.currentPlayerId);
      if (nextPlayer) {
        gameState.currentPlayerId = nextPlayer.id;
      }
    }

    return gameState;
  }

  private determineTrickWinner(gameState: GameState): Player {
    const trick = gameState.currentTrick.map(t => t.card);
    const winningCard = this.getWinningCard(trick, gameState.trumpSuit);
    // Find the player who played the winning card in the current trick
    const winningPlayerEntry = gameState.currentTrick.find(t => t.card === winningCard);
    if (winningPlayerEntry) {
      return winningPlayerEntry.player;
    } else {
      // This case should ideally not be reached if logic is correct
      // As a fallback, return the first player in the trick
      return gameState.currentTrick[0].player;
    }
  }

  private getWinningCard(trick: Card[], trumpSuit: Suit | undefined): Card {
    const ledCard = trick[0];
    const ledSuit = ledCard.suit;

    const card1 = trick[0];
    const card2 = trick[1];

    if (trumpSuit !== undefined) {
      if (card1.suit === trumpSuit && card2.suit !== trumpSuit) {
        return card1;
      } else if (card2.suit === trumpSuit && card1.suit !== trumpSuit) {
        return card2;
      } else if (card1.suit === trumpSuit && card2.suit === trumpSuit) {
        return card1.value > card2.value ? card1 : card2;
      }
    }

    if (card1.suit === ledSuit && card2.suit !== ledSuit) {
      return card1;
    } else if (card2.suit === ledSuit && card1.suit !== ledSuit) {
      return card2;
    } else {
      return card1.value > card2.value ? card1 : card2;
    }
  }

  private awardTrick(gameState: GameState, winner: Player): void {
    const trick = gameState.currentTrick.map(t => t.card);
    winner.tricks.push(...trick);
    winner.score += trick.reduce((acc, card) => acc + card.value, 0);
    winner.hasWonTrick = true;
    gameState.tricks.push({ winner, trick });
  }
}
