import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { EventEnum, SimpleEvent } from '../../../events/event.enum';
import { GameStateMachine } from '../game-state-machine';

export class GuiStartedState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.GUI_STARTED);
  }

  onEntry(): void {
    console.log('Entering GuiStartedState');
    // this.gameSceneController.showWinnerBanner('Game Over');
  }

  override onEvent(simpleEvent: SimpleEvent): boolean {
      if (simpleEvent.type == EventEnum.START_GAME) {
        this.transition(StateEnum.SELECT_DEALER)
        console.log('Transitioning to SelectDealerState');
        return true;
      }
      return false;
  }

  onLeave(): void {
    console.log('Leaving GuiStartedState');
  }
}
