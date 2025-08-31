import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import {  EventEnum, SimpleEvent } from '../../../events/event.enum';
import { GameStateMachine } from '../game-state-machine';
import { Suit } from '../../../logic/schnapsen.rules';
import { environment } from '../../../../environments/environment';

export class SelectDealerState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.SELECT_DEALER);
  }

  onEntry(): void {
    console.log('Entering SelectDealerState');
    if (this.machine.gameLogic.dealer$.getValue()< 0){      
      const dealerCard = this.machine.gameLogic.selectDealer();
      const newDealer = (dealerCard.suit  === Suit.HEARTS || (dealerCard.suit  === Suit.DIAMONDS) ) ? 0 : 1;

      this.machine.gameLogic.dealer$.next(newDealer);
      if (environment['fast-dealer-election']) {
        this.transition(StateEnum.DEAL_CARDS);
      } else {
        this.machine.guiController.electNewGameDealer(dealerCard, newDealer);
      }
    } else {
      const newDealer = this.machine.gameLogic.dealer$.getValue() === 0 ? 1 : 0;
      this.machine.gameLogic.dealer$.next( newDealer);
      if (environment['fast-dealer-election']) {
        this.transition(StateEnum.DEAL_CARDS);
      } else {
        this.machine.guiController.electNewGameDealer(null, newDealer);
      }
    }
  }

  override onEvent(simpleEvent: SimpleEvent): boolean {
    if (simpleEvent.type == EventEnum.DEALER_SELECTED) {
          this.transition(StateEnum.DEAL_CARDS)
          console.log('Transitioning to DealCardsState');
          return true;
      }
    return false;
  }

  onLeave(): void {
    console.log('Leaving SelectDealerState');
  }
}
