import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateMachine } from '../game-state-machine';


export class FinalGameState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.FINAL_GAME);
  }

  onEntry(): void {
    console.log('Entering FinalGameState');
    // this.gameSceneController.showWinnerBanner('Game Over');
  }


  onLeave(): void {
    console.log('Leaving FinalGameState');
  }
}
