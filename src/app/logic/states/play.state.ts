import { State } from '../services/state-machine.service';

import { GameStateName } from '../models/game-state-name.enum';

export const playState = (): State => ({
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
