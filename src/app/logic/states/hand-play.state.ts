import { State } from '../services/state-machine.service';

import { GameStateName } from '../models/game-state-name.enum';

export const handPlayState = (): State => ({
  name: GameStateName.HAND_PLAY,
  onEntry: () => {
    console.log('Entering HAND_PLAY');
  },
  initialSubState: GameStateName.TRICK_START,
  parent: GameStateName.PLAY,
  subStates: {}
});
