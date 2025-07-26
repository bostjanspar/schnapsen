import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateService } from '../../../logic/game-state.service';
import { StateMachine } from '../../state-machine';
import { GameSceneController } from '../../../gui/scenes/game/game-scene.controller';
import { EventEnum } from '../../event.enum';

export class DealCardsState extends BaseState {
  constructor(
    private machine: StateMachine,
    private gameStateService: GameStateService,
    private gameSceneController: GameSceneController
  ) {
    super(StateEnum.DEAL_CARDS);
  }

  onEntry(): void {
    console.log('Entering DealCardsState');
    this.gameStateService.prepareNewHand();
    const { playerHand, opponentHand } = this.gameStateService.getCurrentHands();
    this.gameSceneController.displayHands(playerHand, opponentHand);
    this.gameSceneController.animateDeal();
    this.machine.transition(StateEnum.CURRENT_GAME);
  }

  onEvent(event: EventEnum, ...args: any[]): boolean {
      return false;
  }

  onLeave(): void {
    console.log('Leaving DealCardsState');
  }
}
