import { StateMachine } from '@/sm/state-machine';
import { StateMachineManager } from '@/sm/state-machine-manager';
import { StateEnum } from '@/sm/state.enum';
import { TestStateA, TestStateB, TestStateC, TestParentState } from '@test/fixtures/test-states';

export class TestStateMachineFactory {
  static createSimpleMachine(): StateMachine {
    const machine = new StateMachine();
    machine.addState(new TestStateA(StateEnum.TEST_STATE_A));
    machine.addState(new TestStateB(StateEnum.TEST_STATE_B));
    machine.addState(new TestStateC(StateEnum.TEST_STATE_C));
    return machine;
  }

  static createHierarchicalMachine(): StateMachine {
    const machine = new StateMachine();
    const parent = new TestParentState(StateEnum.PARENT);
    const childA = new TestStateA(StateEnum.CHILD_A);
    const childB = new TestStateB(StateEnum.CHILD_B);

    parent.addSubstate(childA);
    parent.addSubstate(childB);
    
    machine.addState(parent);

    return machine;
  }

  static createMultiLevelMachine(): StateMachine {
    const machine = new StateMachine();
    const parent = new TestParentState(StateEnum.PARENT);
    const childA = new TestStateA(StateEnum.CHILD_A);
    const grandChild = new TestStateC(StateEnum.GRANDCHILD);

    childA.addSubstate(grandChild);
    parent.addSubstate(childA);
    
    machine.addState(parent);

    return machine;
  }

  static createParallelMachines(): StateMachineManager {
    const manager = new StateMachineManager();
    const machine1 = this.createSimpleMachine();
    const machine2 = this.createSimpleMachine();
    
    manager.registerStateMachine(machine1);
    manager.registerStateMachine(machine2);

    return manager;
  }
}
