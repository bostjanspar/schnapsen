import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import {  SimpleEvent } from '../../../events/event.enum';
import { GameStateMachine } from '../game-state-machine';
import { Suit } from '../../../logic/schnapsen.rules';

export class SelectDealerState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.SELECT_DEALER);
  }

  onEntry(): void {
    if (this.machine.gameLogic.dealer$.getValue()< 0){      
      const dealerCard = this.machine.gameLogic.selectDealer();
      const newDealer = (dealerCard.suit  === Suit.HEARTS || (dealerCard.suit  === Suit.DIAMONDS) ) ? 0 : 1;

      this.machine.gameLogic.dealer$.next(newDealer);
      this.machine.guiController.electNewGameDealer(dealerCard, newDealer);
    } else {
      const previousDealer = this.machine.gameLogic.dealer$.getValue();
      this.machine.gameLogic.dealer$.next( previousDealer === 0 ? 1 : 0);
      this.machine.guiController.showNewGameDealer(this.machine.gameLogic.dealer$.getValue());
    }
  }

  override onEvent(simpleEvent: SimpleEvent): boolean {
    return false;
  }

  onLeave(): void {
    console.log('Leaving SelectDealerState');
  }
}
