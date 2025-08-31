
import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateMachine } from '../game-state-machine';
import { environment } from '../../../../environments/environment';
import { EventEnum, SimpleEvent } from '../../../events/event.enum';

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

    if (environment['fast-card-deal']) {
      gameLogic.sortPlayerHand();
      this.machine.guiController.displayHands();
      this.transition(StateEnum.CURRENT_GAME);
    } else {
       this.machine.guiController.dealTheCards();
    }
  }

  override onEvent(simpleEvent: SimpleEvent): boolean {
    if (simpleEvent.type === EventEnum.CARDS_DEALT) {
      this.transition(StateEnum.CURRENT_GAME);
      return true;
    }
    return false;
  }

  onLeave(): void {
    console.log('Leaving DealCardsState');
  }
}
