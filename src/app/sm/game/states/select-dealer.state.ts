import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateService } from '../../../logic/game-state.service';
import { StateMachine } from '../../state-machine';
import { EventEnum } from '../../event.enum';

import { GameSceneController } from '../../../gui/scenes/game/game-scene.controller';

export class SelectDealerState extends BaseState {
  constructor(
    private machine: StateMachine,
    private gameStateService: GameStateService,
    private gameSceneController: GameSceneController
  ) {
    super(StateEnum.SELECT_DEALER);
  }

  onEntry(): void {
    const dealerCard = this.gameStateService.selectDealer();
    this.gameSceneController.showSelectDealerScene(dealerCard);

    setTimeout(() => {
      this.machine.transition(StateEnum.DEAL_CARDS);
    }, 2000);
  }
  
  onEvent(event: EventEnum, ...args: any[]): boolean {
    return false;
  }

  onLeave(): void {
    console.log('Leaving SelectDealerState');
  }
}
