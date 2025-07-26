import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { StateMachine } from '../../state-machine';
import { GameStateService } from '../../../logic/game-state.service';
import { EventEnum } from '../../event.enum';

export class CheckGamePointsState extends BaseState {
  constructor(
    private machine: StateMachine,
    private gameStateService: GameStateService
  ) {
    super(StateEnum.CHECK_GAME_POINTS);
  }

  onEntry(): void {
    console.log('Entering CheckGamePointsState');
    // Here, we would calculate points and update the game state service
    const playerPoints = this.gameStateService.playerPoints$.getValue();
    const opponentPoints = this.gameStateService.opponentPoints$.getValue();

    if (playerPoints <= 0 || opponentPoints <= 0) {
      this.machine.transition(StateEnum.FINAL_GAME);
    } else {
      this.machine.transition(StateEnum.DEAL_CARDS);
    }
  }

  onEvent(event: EventEnum, ...args: any[]): boolean {
      return false;
  }

  onLeave(): void {
    console.log('Leaving CheckGamePointsState');
  }
}
