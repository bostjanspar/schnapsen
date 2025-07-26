import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { StateMachine } from '../../state-machine';
import { GameSceneController } from '../../../gui/scenes/game/game-scene.controller';
import { EventEnum } from '../../event.enum';

export class EndOfHandAnimationState extends BaseState {
  constructor(
    private machine: StateMachine,
    private gameSceneController: GameSceneController
  ) {
    super(StateEnum.END_OF_HAND_ANIMATION);
  }

  onEntry(): void {
    console.log('Entering EndOfHandAnimationState');
    // this.gameSceneController.animateEndOfHand();
    // For now, transition immediately.
    this.machine.transition(StateEnum.CHECK_GAME_POINTS);
  }

  onEvent(event: EventEnum, ...args: any[]): boolean {
      return false;
  }

  onLeave(): void {
    console.log('Leaving EndOfHandAnimationState');
  }
}
