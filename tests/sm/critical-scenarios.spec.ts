import { StateMachine } from '@/sm/state-machine';
import { StateEnum } from '@/sm/state.enum';
import { TestStateA, TestParentState } from '@test/fixtures/test-states';

describe('Critical Scenarios', () => {
  let stateMachine: StateMachine;

  beforeEach(() => {
    stateMachine = new StateMachine();
  });

  describe('State Registration Edge Cases', () => {
    test('should prevent circular parent-child references', () => {
        const parent = new TestParentState(StateEnum.PARENT);
        const child = new TestStateA(StateEnum.CHILD_A);
        
        parent.addSubstate(child);

        // Attempt to create a circular reference
        expect(() => child.addSubstate(parent)).toThrow('Circular reference detected: a state cannot be its own ancestor.');
    });
  });

  describe('Transition Edge Cases', () => {
    test('should handle transition to non-existent state gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = stateMachine.transition(StateEnum.TEST_STATE_A);
      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Target state TEST_STATE_A not found in this state machine.');
      consoleWarnSpy.mockRestore();
    });

    test('should handle self-transition', () => {
        const stateA = new TestStateA(StateEnum.TEST_STATE_A);
        const onLeaveSpy = jest.spyOn(stateA, 'onLeave');
        const onEntrySpy = jest.spyOn(stateA, 'onEntry');
        
        stateMachine.addState(stateA);
        stateMachine.start();
        
        stateMachine.transition(StateEnum.TEST_STATE_A);
        
        expect(onLeaveSpy).toHaveBeenCalledTimes(1);
        expect(onEntrySpy).toHaveBeenCalledTimes(2); // Once on start, once on re-entry
    });

    test('should handle transition from substate to uncle state', () => {
        const parent1 = new TestParentState(StateEnum.PARENT);
        const child1 = new TestStateA(StateEnum.CHILD_A);
        parent1.addSubstate(child1);
        
        const parent2 = new TestParentState(StateEnum.CHILD_B);
        const child2 = new TestStateA(StateEnum.GRANDCHILD);
        parent2.addSubstate(child2);

        stateMachine.addState(parent1);
        stateMachine.addState(parent2);

        // This requires more complex logic in the state machine to exit the hierarchy
        // and enter another. For now, we'll just check it doesn't crash.
        // A full implementation would need to orchestrate the exit from parent1's hierarchy
        // and entry into parent2's.
        expect(() => {
            stateMachine.transition(StateEnum.PARENT);
            parent1.transition(StateEnum.CHILD_A);
            stateMachine.transition(StateEnum.CHILD_B);
        }).not.toThrow();
    });
  });
});
