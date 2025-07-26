import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateService } from '../../../logic/game-state.service';
import { StateMachine } from '../../state-machine';
import { EventEnum } from '../../event.enum';

export class SelectDealerState extends BaseState {
  constructor(
    private machine: StateMachine,
    private gameStateService: GameStateService
  ) {
    super(StateEnum.SELECT_DEALER);
  }

  onEntry(): void {
    console.log('Entering SelectDealerState');
    this.machine.transition(StateEnum.DEAL_CARDS);
  }
  
  onEvent(event: EventEnum, ...args: any[]): boolean {
    return false;
  }

  onLeave(): void {
    console.log('Leaving SelectDealerState');
  }
}
