import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { Card } from '../models/card.model';
import { GameState } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor() { }

  public drawCard(gameState: GameState, player: Player): void {
    const card = gameState.talon.pop();
    if (card) {
      player.hand.push(card);
    }
  }
}