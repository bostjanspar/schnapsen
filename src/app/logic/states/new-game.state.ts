import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';

export const newGameState = (gameService: GameService): State => ({
  name: GameStateName.NEW_GAME,
  onEntry: () => {
    console.log('Entering NEW_GAME');
    gameService.newGame(); // Initialize game state
    gameService.stateMachineService.transitionTo(GameStateName.PLAY); // Transition to PLAY parent state
  }
});
