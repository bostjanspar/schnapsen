import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameStateMachine } from '../game-state-machine';

export class CheckGamePointsState extends BaseState {
  constructor(
    private machine: GameStateMachine
  ) {
    super(StateEnum.CHECK_GAME_POINTS);
  }

  onEntry(): void {
    console.log('Entering CheckGamePointsState');
    // Here, we would calculate points and update the game state service
    const playerPoints = this.machine.gameLogic.playerPoints$.getValue();
    const opponentPoints = this.machine.gameLogic.opponentPoints$.getValue();

    if (playerPoints <= 0 || opponentPoints <= 0) {
      this.transition(StateEnum.FINAL_GAME);
    } else {
      this.transition(StateEnum.DEAL_CARDS);
    }
  }


  onLeave(): void {
    console.log('Leaving CheckGamePointsState');
  }
}
