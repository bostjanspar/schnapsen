import { BaseState } from '../../base-state';
import { StateEnum } from '../../state.enum';
import { GameEvent } from '../game-event.enum';
import { StateMachine } from '../../state-machine';
import { GameStateService } from '../../../logic/game-state.service';
import { GameSceneController } from '../../../gui/scenes/game/game-scene.controller';
import { EventEnum } from '../../event.enum';

export class CurrentGameState extends BaseState {
  constructor(
    private machine: StateMachine,
    private gameStateService: GameStateService,
    private gameSceneController: GameSceneController
  ) {
    super(StateEnum.CURRENT_GAME);
  }

  onEntry(): void {
    console.log('Entering CurrentGameState');
    // Sub-state machine for talon open/closed will be managed here
  }

  onEvent(event: EventEnum | GameEvent, ...args: any[]): boolean {
    if (event === GameEvent.HAND_COMPLETED) {
      this.machine.transition(StateEnum.END_OF_HAND_ANIMATION);
      return true;
    }
    if (event === GameEvent.PLAYER_CLICKED_CARD) {
        const [payload] = args;
        console.log('Player clicked card', payload.cardId);
        // Here we would validate the move and command the controller
        return true;
    }
    return false;
  }

  onLeave(): void {
    console.log('Leaving CurrentGameState');
  }
}
