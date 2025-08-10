
import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateMachine } from '../game-state-machine';

export class DealCardsState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.DEAL_CARDS);
  }

  onEntry(): void {
    console.log('Entering DealCardsState');
     const gameLogic = this.machine.gameLogic;
     gameLogic.prepareNewHand();

    
       this.machine.guiController.dealTheCards();
  }

  onLeave(): void {
    console.log('Leaving DealCardsState');
  }
}
