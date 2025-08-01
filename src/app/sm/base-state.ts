
import { StateEnum } from './state.enum';
import { SimpleEvent } from '../events/event.enum';


export abstract class BaseState {  
  public parent: BaseState | null = null;
  protected children: BaseState[] = [];
  protected activeSubstate: BaseState | null = null;

  constructor(public readonly id: StateEnum) {
  }

  public addSubstate(childState: BaseState): void {
    if (this.children.some(child => child.id === childState.id)) {
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
    this.children.push(childState);
  }

  public abstract onEntry(): void;
  public abstract onLeave(): void;
  
  public  onEvent(_simpleEvent: SimpleEvent): boolean{
    return false;
  }

  // Basic transition logic within the scope of the state's children
  public transition(targetStateId: StateEnum) {
    if(this.parent){
      const parentMachine = this.parent;
      parentMachine._findTransition(targetStateId).then((foundState) => {
        if (foundState) {
          parentMachine._internalTransition(foundState);
        } else {
          throw new Error(`State with ID ${StateEnum[targetStateId]} does not exist under state ${StateEnum[this.id]}.`);
        }
      });
    }
  }

  // This method is for internal use only, it should not be called directly
  private _findTransition(targetStateId: StateEnum): Promise<BaseState | null> {
    return new Promise((resolve) => {
      const foundState = this.children.find(child => child.id === targetStateId);
      resolve(foundState || null);
    });
  }
  // This method is for internal use only, it should not be called directly
  // Internal transition logic never call this method unless you are really sure what are you doing
  private _internalTransition(transToState: BaseState): boolean {

    let activeState= this.activeSubstate;
    while (activeState) {
      activeState.onLeave();
      activeState = activeState.activeSubstate;    
    }

    
    transToState.onEntry();
    this.activeSubstate = transToState;
    while (transToState && transToState.children.length > 0) {
      let childState: BaseState = transToState.children[0];
      transToState.activeSubstate = childState;
      transToState = childState;
      this.activeSubstate = transToState;
      transToState.onEntry();
    }    
    return false;
  }
}
