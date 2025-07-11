import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';

export const handPlayState = (gameService: GameService): State => ({
  name: GameStateName.HAND_PLAY,
  onEntry: () => {
    console.log('Entering HAND_PLAY');
  },
  initialSubState: GameStateName.TRICK_START,
  parent: GameStateName.PLAY,
  subStates: {}
});
