import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { EventEnum, SimpleEvent } from '../../../events/event.enum';
import { GameStateMachine } from '../game-state-machine';
import { MaterialFactory } from '../../../gui/utils/material.factory';
import { environment } from '../../../../environments/environment';

export class GuiStartedState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.GUI_STARTED);
  }

  onEntry(): void {
    console.log('Entering GuiStartedState');
     MaterialFactory.preloadAllMaterials().then(() => {
        if (environment['fast-game-start']) {
            this.transition(StateEnum.SELECT_DEALER);
        }
    });
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
