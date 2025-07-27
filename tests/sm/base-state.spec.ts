
import { EventEnum } from '../../src/app/events/event.enum';
import { StateEnum } from '../../src/app/sm/state.enum';
import { TestStateA, TestStateB } from '../fixtures/test-states';

describe('BaseState', () => {
  let testState: TestStateA;

  beforeEach(() => {
    testState = new TestStateA(StateEnum.UNIT_TEST_STATE_A);
  });

  afterEach(() => {
    testState.cleanup();
  })

  describe('State Lifecycle', () => {
    test('should call onEntry when entering state', () => {
      expect(testState.entryCallCount).toBe(0);
      testState.onEntry();
      expect(testState.entryCallCount).toBe(1);
    });

    test('should call onLeave when leaving state', () => {
      expect(testState.leaveCallCount).toBe(0);
      testState.onLeave();
      expect(testState.leaveCallCount).toBe(1);
    });

    test('should track entry/leave call counts correctly', () => {
      testState.onEntry();
      testState.onEntry();
      testState.onLeave();
      expect(testState.entryCallCount).toBe(2);
      expect(testState.leaveCallCount).toBe(1);
    });
  });

  describe('Event Handling', () => {
    test('should receive events through onEvent method', () => {
      expect(testState.eventCallCount).toBe(0);
      testState.onEvent(EventEnum.UNIT_TEST_CONSUME_EVENT);
      expect(testState.eventCallCount).toBe(1);
    });

    test('should return boolean from onEvent', () => {
      const consumed = testState.onEvent(EventEnum.UNIT_TEST_CONSUME_EVENT);
      const notConsumed = testState.onEvent(EventEnum.UNIT_TEST_DO_NOT_CONSUME_EVENT);
      expect(consumed).toBe(true);
      expect(notConsumed).toBe(false);
    });

    test('should track last received event', () => {
      expect(testState.lastEvent).toBeNull();
      testState.onEvent(EventEnum.UNIT_TEST_CONSUME_EVENT);
      expect(testState.lastEvent).toBe(EventEnum.UNIT_TEST_CONSUME_EVENT);
      testState.onEvent(EventEnum.UNIT_TEST_DO_NOT_CONSUME_EVENT);
      expect(testState.lastEvent).toBe(EventEnum.UNIT_TEST_DO_NOT_CONSUME_EVENT);
    });
  });

  describe('Parent-Child Relationships', () => {
    let childState: TestStateB;

    beforeEach(() => {
        childState = new TestStateB(StateEnum.UNIT_TEST_STATE_B);
    });
    
    test('should accept child states', () => {
      testState.addSubstate(childState);
      //@ts-ignore
      expect(testState.children.has(StateEnum.UNIT_TEST_STATE_B)).toBe(true);
    });

    test('should maintain reference to parent', () => {
      expect(childState.parent).toBeNull();
      testState.addSubstate(childState);
      expect(childState.parent).toBe(testState);
    });

    test('should prevent duplicate child state IDs', () => {
      testState.addSubstate(childState);
      const anotherChild = new TestStateB(StateEnum.UNIT_TEST_STATE_B);
      expect(() => testState.addSubstate(anotherChild)).toThrow('State with ID UNIT_TEST_STATE_B already exists as a substate.');
    });
  });
});
