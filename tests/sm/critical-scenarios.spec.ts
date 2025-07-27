import { StateMachine } from '../../src/app/sm/state-machine';
import { StateEnum } from '../../src/app/sm/state.enum';
import { TestStateA, TestParentState } from '../fixtures/test-states';

describe('Critical Scenarios', () => {
  let stateMachine: StateMachine;

  beforeEach(() => {
    stateMachine = new StateMachine();
  });

  describe('State Registration Edge Cases', () => {
    test('should prevent circular parent-child references', () => {
        const parent = new TestParentState(StateEnum.UNIT_TEST_PARENT);
        const child = new TestStateA(StateEnum.UNIT_TEST_CHILD_A);
        
        parent.addSubstate(child);

        // Attempt to create a circular reference
        expect(() => child.addSubstate(parent)).toThrow('Circular reference detected: a state cannot be its own ancestor.');
    });
  });

  describe('Transition Edge Cases', () => {
    test('should handle transition to non-existent state gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const parent = new TestParentState(StateEnum.UNIT_TEST_PARENT);
      const child = new TestStateA(StateEnum.UNIT_TEST_CHILD_A);
      parent.addSubstate(child);

      const result = child.transition(StateEnum.UNIT_TEST_STATE_A);

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Target state UNIT_TEST_STATE_A not found in this state machine.');
      consoleWarnSpy.mockRestore();
    });

    test('should handle self-transition', () => {
        const stateA = new TestStateA(StateEnum.UNIT_TEST_STATE_A);
        const onLeaveSpy = jest.spyOn(stateA, 'onLeave');
        const onEntrySpy = jest.spyOn(stateA, 'onEntry');
        
        stateMachine.addState(stateA);
        stateMachine.start();
        
        stateA.transition(StateEnum.UNIT_TEST_STATE_A);
        
        expect(onLeaveSpy).toHaveBeenCalledTimes(1);
        expect(onEntrySpy).toHaveBeenCalledTimes(2); // Once on start, once on re-entry
    });

  });
});
