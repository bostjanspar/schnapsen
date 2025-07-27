import { StateMachine } from '../state-machine';
import { StateEnum } from '../state.enum';

import { SelectDealerState } from './states/select-dealer.state';
import { DealCardsState } from './states/deal-cards.state';
import { CurrentGameState } from './states/current-game.state';
import { EndOfHandAnimationState } from './states/end-of-hand-animation.state';
import { CheckGamePointsState } from './states/check-game-points.state';
import { FinalGameState } from './states/final-game.state';
import { GuiController } from '../../gui/scenes/gui-controller';
import { RandomService } from '../../logic/random.service';
import { GameLogic } from '../../logic/game-logic';

export class GameStateMachine extends StateMachine {
  
  constructor(
    public readonly gameLogic: GameLogic,
    public readonly guiController: GuiController) {
    super();

    this.addState(new SelectDealerState(this));
    this.addState(new DealCardsState(this));
    this.addState(new CurrentGameState(this));
    this.addState(new EndOfHandAnimationState(this));
    this.addState(new CheckGamePointsState(this));
    this.addState(new FinalGameState(this));

    this.start();
  }
}
