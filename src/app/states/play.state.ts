import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';

export const playState = (gameService: GameService): State => ({
  name: GameStateName.PLAY,
  onEntry: () => {
    console.log('Entering PLAY');
  },
  onLeave: () => {
    console.log('Leaving PLAY');
  },
  initialSubState: GameStateName.HAND_SETUP,
  subStates: {}
});
