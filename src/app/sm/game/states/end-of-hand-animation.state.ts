import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { StateMachine } from '../../state-machine';
import { GameSceneController } from '../../../gui/scenes/game/game-scene.controller';
import { EventEnum } from '../../../events/event.enum';
import { GameStateMachine } from '../game-state-machine';

export class EndOfHandAnimationState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.END_OF_HAND_ANIMATION);
  }

  onEntry(): void {
    console.log('Entering EndOfHandAnimationState');
    // this.gameSceneController.animateEndOfHand();
    // For now, transition immediately.
    this.transition(StateEnum.CHECK_GAME_POINTS);
  }

  

  onLeave(): void {
    console.log('Leaving EndOfHandAnimationState');
  }
}
