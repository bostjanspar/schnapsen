import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';

export const doneState = (gameService: GameService): State => ({
  name: GameStateName.DONE,
  onEntry: () => {
    console.log('Entering DONE');
    // Declare winner, prompt to restart
  },
  onEvent: (event: string) => {
    if (event === 'RESTART') {
      gameService.stateMachineService.transitionTo(GameStateName.PRE_GAME);
    } else if (event === 'QUIT') {
      // Terminate application (handled by external logic)
    }
  }
});
