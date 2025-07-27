import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateMachine } from '../game-state-machine';

export class CurrentGameState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.CURRENT_GAME);
  }

  onEntry(): void {
    console.log('Entering CurrentGameState');
    // Sub-state machine for talon open/closed will be managed here
  }

  
  onLeave(): void {
    console.log('Leaving CurrentGameState');
  }
}
