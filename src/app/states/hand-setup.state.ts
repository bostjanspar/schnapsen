import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';

export const handSetupState = (gameService: GameService): State => ({
  name: GameStateName.HAND_SETUP,
  onEntry: () => {
    console.log('Entering HAND_SETUP');
    gameService.resetHand(); // Shuffle, deal, set trump, form talon
    gameService.stateMachineService.transitionTo(GameStateName.TRICK_START); // non-dealer starts
  },
  parent: GameStateName.PLAY
});
