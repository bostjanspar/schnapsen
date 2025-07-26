import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameSceneController } from '../../../gui/scenes/game/game-scene.controller';
import { EventEnum } from '../../event.enum';

export class FinalGameState extends BaseState {
  constructor(
    private gameSceneController: GameSceneController
  ) {
    super(StateEnum.FINAL_GAME);
  }

  onEntry(): void {
    console.log('Entering FinalGameState');
    // this.gameSceneController.showWinnerBanner('Game Over');
  }

  onEvent(event: EventEnum, ...args: any[]): boolean {
      return false;
  }

  onLeave(): void {
    console.log('Leaving FinalGameState');
  }
}
