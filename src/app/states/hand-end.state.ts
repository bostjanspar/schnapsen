import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';
import { Player } from '../models/player.model';

export const handEndState = (gameService: GameService): State => ({
  name: GameStateName.HAND_END,
  onEntry: (winner: Player) => {
    console.log('Entering HAND_END');
    gameService.calculateHandResult(winner);

    const gameWinner = gameService.checkGameWinner();
    if (gameWinner) {
      gameService.stateMachineService.transitionTo(GameStateName.DONE);
    } else {
      gameService.stateMachineService.transitionTo(GameStateName.HAND_SETUP); // Rotate dealer, start new hand
    }
  },
  parent: GameStateName.PLAY
});
