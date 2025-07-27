import { StateMachine } from '../../src/app/sm/state-machine';
import { MockStateFactory } from '../utils/mock-state-factory';
import { BaseState } from '../../src/app/sm/base-state';

import { EventEnum } from '../../src/app/events/event.enum';
import { StateEnum } from '../../src/app/sm/state.enum';
import { TestParentState, TestStateA, TestStateB, TestStateC } from '../fixtures/test-states';

describe('Hierarchical States', () => {
  let stateMachine: StateMachine;
  let parentState: jest.Mocked<BaseState>;
  let childStateA: jest.Mocked<BaseState>;
  let childStateB: jest.Mocked<BaseState>;
  let grandChildState: jest.Mocked<BaseState>;

  beforeEach(() => {
    stateMachine = new StateMachine();
    
    parentState = MockStateFactory.createSpyState(StateEnum.UNIT_TEST_PARENT);
    childStateA = MockStateFactory.createSpyState(StateEnum.UNIT_TEST_CHILD_A);
    childStateB = MockStateFactory.createSpyState(StateEnum.UNIT_TEST_CHILD_B);
    grandChildState = MockStateFactory.createSpyState(StateEnum.UNIT_TEST_GRANDCHILD);

    // Setup hierarchy
    parentState.parent = null;
    childStateA.parent = parentState;
    childStateB.parent = parentState;
    grandChildState.parent = childStateA;

    // @ts-ignore
    parentState.children.set(childStateA.id, childStateA);
    // @ts-ignore
    parentState.children.set(childStateB.id, childStateB);
    // @ts-ignore
    childStateA.children.set(grandChildState.id, grandChildState);

    stateMachine.addState(parentState);
    stateMachine.addState(childStateA);
    stateMachine.addState(childStateB);
    stateMachine.addState(grandChildState);

    // Mock transition implementations
    parentState.transition.mockImplementation((targetId) => {
        if (targetId === StateEnum.UNIT_TEST_CHILD_A) {
            // @ts-ignore
            parentState.activeSubstate = childStateA;
            return true;
        }
        return false;
    });

    childStateA.transition.mockImplementation((targetId) => {
        if (targetId === StateEnum.UNIT_TEST_GRANDCHILD) {
            // @ts-ignore
            childStateA.activeSubstate = grandChildState;
            return true;
        }
        return false;
    })

  });

  // describe('Event Bubbling', () => {
  //   beforeEach(() => {
  //       stateMachine.transition(StateEnum.UNIT_TEST_PARENT);
  //       // @ts-ignore
  //       stateMachine.currentState.activeSubstate = childStateA;
  //       // @ts-ignore
  //       childStateA.activeSubstate = grandChildState;
  //   });

  //   test('should start event processing at deepest active child', () => {
  //     stateMachine.onEvent(EventEnum.UNIT_TEST_DO_NOT_CONSUME_EVENT);
  //     expect(grandChildState.onEvent).toHaveBeenCalledWith(EventEnum.UNIT_TEST_DO_NOT_CONSUME_EVENT);
  //   });

  //   test('should bubble up to parent if child returns false', () => {
  //     grandChildState.onEvent.mockReturnValue(false);
  //     childStateA.onEvent.mockReturnValue(false);
  //     parentState.onEvent.mockReturnValue(false);

  //     stateMachine.onEvent(EventEnum.UNIT_TEST_DO_NOT_CONSUME_EVENT);

  //     expect(grandChildState.onEvent).toHaveBeenCalled();
  //     expect(childStateA.onEvent).toHaveBeenCalled();
  //     expect(parentState.onEvent).toHaveBeenCalled();
  //   });

  //   test('should stop bubbling if any state returns true', () => {
  //       grandChildState.onEvent.mockReturnValue(false);
  //       childStateA.onEvent.mockReturnValue(true);
  //       parentState.onEvent.mockReturnValue(false);

  //       stateMachine.onEvent(EventEnum.UNIT_TEST_DO_NOT_CONSUME_EVENT);

  //       expect(grandChildState.onEvent).toHaveBeenCalled();
  //       expect(childStateA.onEvent).toHaveBeenCalled();
  //       expect(parentState.onEvent).not.toHaveBeenCalled();
  //   });
  //}); 
});
