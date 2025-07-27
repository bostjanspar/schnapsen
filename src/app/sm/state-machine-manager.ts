
import { StateMachine } from './state-machine';
import { EventEnum, SimpleEvent } from '../events/event.enum';
import { GameEvent } from './game/game-event.enum';

export class StateMachineManager {
  private stateMachines: StateMachine[] = [];

  public registerStateMachine(sm: StateMachine): void {
    if (this.stateMachines.includes(sm)) {
      console.warn('State machine has already been registered.');
      return;
    }
    this.stateMachines.push(sm);
    // Sort by priority descending (higher priority first)
    this.stateMachines.sort((a, b) => b.priority - a.priority);
  }

  public deregisterStateMachine(sm: StateMachine): void {
    const index = this.stateMachines.indexOf(sm);
    if (index > -1) {
      this.stateMachines.splice(index, 1);
    }
  }

  public onEvent(simpleEvent: SimpleEvent): void {
    for (const sm of this.stateMachines) {
      if (sm.onEvent(simpleEvent)) {
        return; // Event consumed, stop propagation
      }
    }
    console.warn(`Event ${event} was not handled by any state machine.`);
  }

  public startAll(): void {
    for (const sm of this.stateMachines) {
      sm.start();
    }
  }
}
