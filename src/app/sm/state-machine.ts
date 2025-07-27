
import { BaseState } from './base-state';
import { StateEnum } from './state.enum';
import { SimpleEvent } from '../events/event.enum';


 class RootState extends BaseState {
  constructor(
  ) {
    super(StateEnum.ROOT);
  }
  onEntry(): void {    
  }

  onLeave(): void {
  }

  public start(): void {
    if (this.children.length === 0) {
      throw new Error('Root state must have at least one child state.');
    }
    this.activeSubstate = this.children[0];
    this.children[0].onEntry()
  }
  
  public override onEvent(simpleEvent: SimpleEvent): boolean {
    
    let activeState: BaseState | null = this.activeSubstate;
    // @ts-ignore
    while (activeState && activeState.activeSubstate) {
        // @ts-ignore
      activeState = activeState.activeSubstate;
    }

    // Hierarchical event handling from leaf to root
    let state: BaseState | null = activeState;
    while (state) {
      if (state.onEvent(simpleEvent)) {
        return true; // Event consumed
      }
      state = state.parent;
    }

    return false; // Event not handled
  }
}

export class StateMachine {
  public priority: number;
  private rootState: RootState = new RootState();

  constructor(priority: number = 0) {
    this.priority = priority;
  }

  public addState(state: BaseState): void {    
    this.rootState.addSubstate(state);    
  }


  public start(): void {    
    this.rootState.start();
  }


  public onEvent(simpleEvent: SimpleEvent): boolean {
    return this.rootState.onEvent(simpleEvent);
  }
}
