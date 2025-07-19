
import { BaseState } from './base-state';
import { StateEnum } from './state.enum';
import { EventEnum } from './event.enum';

export class StateMachine {
  private states: Map<StateEnum, BaseState> = new Map();
  private currentState: BaseState | null = null;
  public priority: number;

  constructor(priority: number = 0) {
    this.priority = priority;
  }

  public addState(state: BaseState): void {
    if (this.states.has(state.id)) {
      throw new Error(`State with ID ${StateEnum[state.id]} already exists in this state machine.`);
    }
    this.states.set(state.id, state);
  }

  public getInitialState(): BaseState | null {
    if (this.states.size === 0) {
      return null;
    }
    // Return the first state added as the initial state
    return this.states.values().next().value || null;
  }
  
  public start(): void {
    if (this.currentState === null) {
      this.currentState = this.getInitialState();
      if (this.currentState) {
        this.currentState.onEntry();
      }
    }
  }

  public transition(targetStateId: StateEnum): boolean {
    if (!this.states.has(targetStateId)) {
      console.warn(`Target state ${StateEnum[targetStateId]} not found in this state machine.`);
      return false;
    }

    if (this.currentState) {
      this.currentState.onLeave();
    }

    this.currentState = this.states.get(targetStateId)!;
    this.currentState.onEntry();
    return true;
  }

  public onEvent(event: EventEnum, ...args: any[]): boolean {
    if (!this.currentState) {
      return false;
    }

    let activeState: BaseState | null = this.currentState;
    // @ts-ignore
    while (activeState && activeState.activeSubstate) {
        // @ts-ignore
      activeState = activeState.activeSubstate;
    }

    // Hierarchical event handling from leaf to root
    let state: BaseState | null = activeState;
    while (state) {
      if (state.onEvent(event, ...args)) {
        return true; // Event consumed
      }
      state = state.parent;
    }

    return false; // Event not handled
  }
}
