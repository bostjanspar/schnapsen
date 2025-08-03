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

     this.machine.guiController.dealTheCards();
    // this.gameStateService.prepareNewHand();
    // const { playerHand, opponentHand } = this.gameStateService.getCurrentHands();
    // this.gameSceneController.displayHands(playerHand, opponentHand);
    // this.gameSceneController.animateDeal();
    // this.machine.transition(StateEnum.CURRENT_GAME);
  }

  onLeave(): void {
    console.log('Leaving DealCardsState');
  }
}
