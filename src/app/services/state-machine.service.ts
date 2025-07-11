import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { GameStateName } from '../models/game-state-name.enum';
import { preGameState } from '../states/pre-game.state';
import { newGameState } from '../states/new-game.state';
import { playState } from '../states/play.state';
import { doneState } from '../states/done.state';
import { handSetupState } from '../states/hand-setup.state';
import { handPlayState } from '../states/hand-play.state';
import { handEndState } from '../states/hand-end.state';
import { trickStartState } from '../states/trick-start.state';
import { trickInProgressState } from '../states/trick-in-progress.state';
import { trickEndState } from '../states/trick-end.state';

export interface State {
  name: GameStateName;
  onEntry?: (payload?: any) => void;
  onLeave?: () => void;
  onEvent?: (event: string, payload?: any) => void;
  subStates?: { [key: string]: State };
  parent?: GameStateName; // Reference to parent state for sub-states
  initialSubState?: GameStateName; // Name of the initial sub-state
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

  public transitionTo(newStateName: GameStateName, payload?: any): void {
    const newState = this.states[newStateName];
    if (!newState) {
      console.error(`State ${newStateName} not found.`);
      return;
    }

    // Handle onLeave for current state and its parents
    let current = this.currentState;
    while (current) {
      current.onLeave?.();
      current = current.parent ? this.states[current.parent] : null;
    }

    this.currentState = newState;

    // Handle onEntry for new state and its parents
    const entryPath: State[] = [];
    let tempState: State | null = newState;
    while (tempState) {
      entryPath.unshift(tempState);
      tempState = tempState.parent ? this.states[tempState.parent] : null;
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
    this.transitionTo(GameStateName.PRE_GAME);
  }

  private addStates(): void {
    const play = playState(this.gameService);
    const handPlay = handPlayState(this.gameService);

    this.addState(preGameState(this.gameService));
    this.addState(newGameState(this.gameService));
    this.addState(play);
    this.addState(doneState(this.gameService));
    this.addState(handSetupState(this.gameService));
    this.addState(handPlay);
    this.addState(handEndState(this.gameService));
    this.addState(trickStartState(this.gameService));
    this.addState(trickInProgressState(this.gameService));
    this.addState(trickEndState(this.gameService));

    // Set up sub-states
    play.subStates![GameStateName.HAND_SETUP] = handSetupState(this.gameService);
    play.subStates![GameStateName.HAND_PLAY] = handPlay;
    play.subStates![GameStateName.HAND_END] = handEndState(this.gameService);

    handPlay.subStates![GameStateName.TRICK_START] = trickStartState(this.gameService);
    handPlay.subStates![GameStateName.TRICK_IN_PROGRESS] = trickInProgressState(this.gameService);
    handPlay.subStates![GameStateName.TRICK_END] = trickEndState(this.gameService);
  }
}
