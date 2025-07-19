
import { StateEnum } from './state.enum';
import { EventEnum } from './event.enum';

export abstract class BaseState {
  public parent: BaseState | null = null;
  protected children: Map<StateEnum, BaseState> = new Map();
  protected activeSubstate: BaseState | null = null;

  constructor(public readonly id: StateEnum) {}

  public addSubstate(childState: BaseState): void {
    if (this.children.has(childState.id)) {
      throw new Error(`State with ID ${StateEnum[childState.id]} already exists as a substate.`);
    }
    
    let current: BaseState | null = this;
    while (current) {
        if (current === childState) {
            throw new Error('Circular reference detected: a state cannot be its own ancestor.');
        }
        current = current.parent;
    }

    childState.parent = this;
    this.children.set(childState.id, childState);
  }

  public abstract onEntry(): void;
  public abstract onLeave(): void;
  public abstract onEvent(event: EventEnum, ...args: any[]): boolean;

  // Basic transition logic within the scope of the state's children
  public transition(targetStateId: StateEnum): boolean {
    if (this.children.has(targetStateId)) {
      if (this.activeSubstate) {
        this.activeSubstate.onLeave();
      }
      this.activeSubstate = this.children.get(targetStateId)!;
      this.activeSubstate.onEntry();
      return true;
    }
    return false;
  }
}
