import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';

export const trickEndState = (gameService: GameService): State => ({
  name: GameStateName.TRICK_END,
  onEntry: () => {
    console.log('Entering TRICK_END');
    // Determine winner, award points, draw cards (handled by GameService.playCard)

    const handWinner = gameService.checkHandWinner();
    if (handWinner) {
      gameService.stateMachineService.transitionTo(GameStateName.HAND_END, handWinner);
    } else if (gameService.isLastTrick()) { 
      const lastTrickWinner = gameService.getLastTrickWinner(); 
      if (lastTrickWinner) {
        gameService.stateMachineService.transitionTo(GameStateName.HAND_END, lastTrickWinner);
      }
    } else {
      gameService.stateMachineService.transitionTo(GameStateName.TRICK_START); // Winner leads next
    }
  },
  parent: GameStateName.HAND_PLAY
});
