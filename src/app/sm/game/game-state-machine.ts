import { StateMachine } from '../state-machine';
import { GameStateService } from '../../logic/game-state.service';
import { StateMachineManager } from '../state-machine-manager';
import { GameSceneController } from '../../gui/scenes/game/game-scene.controller';
import { StateEnum } from '../state.enum';

import { SelectDealerState } from './states/select-dealer.state';
import { DealCardsState } from './states/deal-cards.state';
import { CurrentGameState } from './states/current-game.state';
import { EndOfHandAnimationState } from './states/end-of-hand-animation.state';
import { CheckGamePointsState } from './states/check-game-points.state';
import { FinalGameState } from './states/final-game.state';

export class GameStateMachine extends StateMachine {
  constructor(
    private gameStateService: GameStateService,
    private stateMachineManager: StateMachineManager,
    private gameSceneController: GameSceneController
  ) {
    super();

    this.addState(new SelectDealerState(this, this.gameStateService));
    this.addState(new DealCardsState(this, this.gameStateService, this.gameSceneController));
    this.addState(new CurrentGameState(this, this.gameStateService, this.gameSceneController));
    this.addState(new EndOfHandAnimationState(this, this.gameSceneController));
    this.addState(new CheckGamePointsState(this, this.gameStateService));
    this.addState(new FinalGameState(this.gameSceneController));

    this.setInitialState(StateEnum.SELECT_DEALER);
    this.start();
  }
}
