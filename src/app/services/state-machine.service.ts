import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { GameState } from '../models/game-state.model';
import { Card } from '../models/card.model';
import { Player } from '../models/player.model';

export interface State {
  name: string;
  onEntry?: (payload?: any) => void;
  onLeave?: () => void;
  onEvent?: (event: string, payload?: any) => void;
  subStates?: { [key: string]: State };
  parent?: State; // Reference to parent state for sub-states
  initialSubState?: string; // Name of the initial sub-state
}

@Injectable({
  providedIn: 'root'
})
export class StateMachineService {
  private currentState: State | null = null;
  private states: { [key: string]: State } = {};

  constructor(private gameService: GameService) { }

  public addState(state: State): void {
    this.states[state.name] = state;
  }

  public transitionTo(newStateName: string, payload?: any): void {
    const newState = this.states[newStateName];
    if (!newState) {
      console.error(`State ${newStateName} not found.`);
      return;
    }

    // Handle onLeave for current state and its parents
    let current = this.currentState;
    while (current) {
      current.onLeave?.();
      current = current.parent || null;
    }

    this.currentState = newState;

    // Handle onEntry for new state and its parents
    const entryPath: State[] = [];
    let tempState: State | null = newState;
    while (tempState) {
      entryPath.unshift(tempState);
      tempState = tempState.parent || null;
    }
    for (const stateToEnter of entryPath) {
      stateToEnter.onEntry?.(payload);
    }

    // If the new state has an initial sub-state, transition to it
    if (newState.initialSubState) {
      this.transitionTo(newState.initialSubState, payload);
    }
  }

  public onEvent(event: string, payload?: any): void {
    if (this.currentState) {
      this.currentState.onEvent?.(event, payload);
    } else {
      console.warn(`Event ${event} received but no current state.`);
    }
  }

  public getCurrentState(): State | null {
    return this.currentState;
  }

  public initialize(): void {
    this.addStates();
    this.transitionTo('PRE_GAME');
  }

  private addStates(): void {
    // Global States
    this.addState({
      name: 'PRE_GAME',
      onEntry: () => {
        console.log('Entering PRE_GAME');
        // Display welcome message, prompt to start game
      },
      onEvent: (event: string) => {
        if (event === 'START_GAME') {
          this.transitionTo('NEW_GAME');
        }
      },
      onLeave: () => {
        console.log('Leaving PRE_GAME');
        // Initialize game settings (handled by NEW_GAME entry)
      }
    });

    this.addState({
      name: 'NEW_GAME',
      onEntry: () => {
        console.log('Entering NEW_GAME');
        this.gameService.newGame(); // Initialize game state
        this.transitionTo('PLAY'); // Transition to PLAY parent state
      }
    });

    const playState: State = {
      name: 'PLAY',
      onEntry: () => {
        console.log('Entering PLAY');
      },
      onLeave: () => {
        console.log('Leaving PLAY');
      },
      initialSubState: 'HAND_SETUP', // Start with HAND_SETUP
      subStates: {}
    };
    this.addState(playState);

    this.addState({
      name: 'DONE',
      onEntry: () => {
        console.log('Entering DONE');
        // Declare winner, prompt to restart
      },
      onEvent: (event: string) => {
        if (event === 'RESTART') {
          this.transitionTo('PRE_GAME');
        } else if (event === 'QUIT') {
          // Terminate application (handled by external logic)
        }
      }
    });

    // Substates within PLAY
    const handSetupState: State = {
      name: 'HAND_SETUP',
      onEntry: () => {
        console.log('Entering HAND_SETUP');
        this.gameService.resetHand(); // Shuffle, deal, set trump, form talon
        this.transitionTo('TRICK_START'); // non-dealer starts
      },
      parent: playState
    };
    this.addState(handSetupState);
    playState.subStates!['HAND_SETUP'] = handSetupState;

    const handPlayState: State = {
      name: 'HAND_PLAY',
      onEntry: () => {
        console.log('Entering HAND_PLAY');
      },
      initialSubState: 'TRICK_START',
      parent: playState,
      subStates: {}
    };
    this.addState(handPlayState);
    playState.subStates!['HAND_PLAY'] = handPlayState;

    const handEndState: State = {
      name: 'HAND_END',
      onEntry: (winner: Player) => {
        console.log('Entering HAND_END');
        this.gameService.calculateHandResult(winner);

        const gameWinner = this.gameService.checkGameWinner();
        if (gameWinner) {
          this.transitionTo('DONE');
        } else {
          this.transitionTo('HAND_SETUP'); // Rotate dealer, start new hand
        }
      },
      parent: playState
    };
    this.addState(handEndState);
    playState.subStates!['HAND_END'] = handEndState;

    // States within HAND_PLAY
    const trickStartState: State = {
      name: 'TRICK_START',
      onEntry: () => {
        console.log('Entering TRICK_START');
        // Reset current trick, activate current player (handled by GameService)
      },
      onEvent: (event: string, payload?: any) => {
        switch (event) {
          case 'EXCHANGE_TRUMP_JACK':
            this.gameService.exchangeTrumpJack();
            break;
          case 'DECLARE_MARRIAGE':
            this.gameService.declareMarriage(payload.marriage);
            break;
          case 'CLOSE_TALON':
            this.gameService.closeTalon();
            break;
          case 'LEAD_CARD':
            this.gameService.playCard(payload.card);
            this.transitionTo('TRICK_IN_PROGRESS');
            break;
        }
      },
      parent: handPlayState
    };
    this.addState(trickStartState);
    handPlayState.subStates!['TRICK_START'] = trickStartState;

    const trickInProgressState: State = {
      name: 'TRICK_IN_PROGRESS',
      onEntry: () => {
        console.log('Entering TRICK_IN_PROGRESS');
      },
      onEvent: (event: string, payload?: any) => {
        if (event === 'PLAY_CARD') {
          this.gameService.playCard(payload.card);
          // After playing the second card, the trick is over, so transition to TRICK_END
          this.transitionTo('TRICK_END');
        }
      },
      parent: handPlayState
    };
    this.addState(trickInProgressState);
    handPlayState.subStates!['TRICK_IN_PROGRESS'] = trickInProgressState;

    const trickEndState: State = {
      name: 'TRICK_END',
      onEntry: () => {
        console.log('Entering TRICK_END');
        // Determine winner, award points, draw cards (handled by GameService.playCard)

        const handWinner = this.gameService.checkHandWinner();
        if (handWinner) {
          this.transitionTo('HAND_END', handWinner);
        } else if (this.gameService.isLastTrick()) { 
          const lastTrickWinner = this.gameService.getLastTrickWinner(); 
          if (lastTrickWinner) {
            this.transitionTo('HAND_END', lastTrickWinner);
          }
        } else {
          this.transitionTo('TRICK_START'); // Winner leads next
        }
      },
      parent: handPlayState
    };
    this.addState(trickEndState);
    handPlayState.subStates!['TRICK_END'] = trickEndState;
  }
}
