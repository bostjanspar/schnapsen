import { State } from '../services/state-machine.service';
import { GameService } from '../services/game.service';
import { GameStateName } from '../models/game-state-name.enum';
import { Card } from '../models/card.model';

export const trickStartState = (gameService: GameService): State => ({
  name: GameStateName.TRICK_START,
  onEntry: () => {
    console.log('Entering TRICK_START');
    // Reset current trick, activate current player (handled by GameService)
  },
  onEvent: (event: string, payload?: unknown) => {
    switch (event) {
      case 'EXCHANGE_TRUMP_JACK':
        gameService.exchangeTrumpJack();
        break;
      case 'DECLARE_MARRIAGE':
        gameService.declareMarriage(payload.marriage);
        break;
      case 'CLOSE_TALON':
        gameService.closeTalon();
        break;
      case 'LEAD_CARD':
        gameService.playCard(payload.card as Card);
        gameService.stateMachineService.transitionTo(GameStateName.TRICK_IN_PROGRESS);
        break;
    }
  },
  parent: GameStateName.HAND_PLAY
});
