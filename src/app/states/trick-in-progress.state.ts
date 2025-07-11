import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';
import { Card } from '../models/card.model';

export const trickInProgressState = (gameService: GameService): State => ({
  name: GameStateName.TRICK_IN_PROGRESS,
  onEntry: () => {
    console.log('Entering TRICK_IN_PROGRESS');
  },
  onEvent: (event: string, payload?: unknown) => {
    if (event === 'PLAY_CARD') {
      gameService.playCard(payload.card as Card);
      // After playing the second card, the trick is over, so transition to TRICK_END
      gameService.stateMachineService.transitionTo(GameStateName.TRICK_END);
    }
  },
  parent: GameStateName.HAND_PLAY
});
