import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';

export const preGameState = (gameService: GameService): State => ({
  name: GameStateName.PRE_GAME,
  onEntry: () => {
    console.log('Entering PRE_GAME');
    // Display welcome message, prompt to start game
  },
  onEvent: (event: string) => {
    if (event === 'START_GAME') {
      gameService.stateMachineService.transitionTo(GameStateName.NEW_GAME);
    }
  },
  onLeave: () => {
    console.log('Leaving PRE_GAME');
    // Initialize game settings (handled by NEW_GAME entry)
  }
});
