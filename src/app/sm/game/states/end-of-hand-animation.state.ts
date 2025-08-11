import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateMachine } from '../game-state-machine';

export class EndOfHandAnimationState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.END_OF_HAND_ANIMATION);
  }

  onEntry(): void {
    console.log('Entering EndOfHandAnimationState');
    
    this.transition(StateEnum.CHECK_GAME_POINTS);
  }

  

  onLeave(): void {
    console.log('Leaving EndOfHandAnimationState');
  }
}
