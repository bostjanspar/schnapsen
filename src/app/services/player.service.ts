import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';

import { GameState } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  

  public drawCard(gameState: GameState, player: Player): void {
    const card = gameState.talon.pop();
    if (card) {
      player.hand.push(card);
    }
  }
}