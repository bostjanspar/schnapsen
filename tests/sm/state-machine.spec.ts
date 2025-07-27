
import { StateMachine } from '../../src/app/sm/state-machine';
import { StateEnum } from '../../src/app/sm/state.enum';
import { TestStateA, TestStateB } from '../fixtures/test-states';

describe('StateMachine', () => {
  let stateMachine: StateMachine;
  let mockStateA: TestStateA;
  let mockStateB: TestStateB;

  beforeEach(() => {
    stateMachine = new StateMachine();
    mockStateA = new TestStateA(StateEnum.UNIT_TEST_STATE_A);
    mockStateB = new TestStateB(StateEnum.UNIT_TEST_STATE_B);
  });

  afterEach(() => {
    mockStateA.cleanup();
    mockStateB.cleanup();
  });

  describe('State Registration', () => {
    test('should add states successfully', () => {
      stateMachine.addState(mockStateA);
      //@ts-ignore
      expect(stateMachine.states.has(StateEnum.UNIT_TEST_STATE_A)).toBe(true);
    });

    test('should prevent duplicate state IDs', () => {
      stateMachine.addState(mockStateA);
      const anotherStateA = new TestStateA(StateEnum.UNIT_TEST_STATE_A);
      expect(() => stateMachine.addState(anotherStateA)).toThrow('State with ID UNIT_TEST_STATE_A already exists in this state machine.');
    });

    test('should maintain state registry', () => {
      stateMachine.addState(mockStateA);
      stateMachine.addState(mockStateB);
      //@ts-ignore
      expect(stateMachine.states.size).toBe(2);
    });
  });

  describe('State Transitions', () => {
    beforeEach(() => {
        stateMachine.addState(mockStateA);
        stateMachine.addState(mockStateB);
        stateMachine.start();
    });
    
    // test('should transition between valid states', () => {
    //   //@ts-ignore
    //   expect(stateMachine.currentState.id).toBe(StateEnum.UNIT_TEST_STATE_A);
    //   stateMachine.transition(StateEnum.UNIT_TEST_STATE_B);
    //   //@ts-ignore
    //   expect(stateMachine.currentState.id).toBe(StateEnum.UNIT_TEST_STATE_B);
    // });

  //   test('should call onLeave on current state and onEntry on target state', () => {
  //     expect(mockStateA.leaveCallCount).toBe(0);
  //     expect(mockStateB.entryCallCount).toBe(0);

  //     stateMachine.transition(StateEnum.UNIT_TEST_STATE_B);

  //     expect(mockStateA.leaveCallCount).toBe(1);
  //     expect(mockStateB.entryCallCount).toBe(1);
  //   });

  //   test('should reject invalid transitions', () => {
  //     const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  //     const result = stateMachine.transition(StateEnum.UNIT_TEST_STATE_C);
  //     expect(result).toBe(false);
  //     expect(consoleWarnSpy).toHaveBeenCalledWith('Target state UNIT_TEST_STATE_C not found in this state machine.');
  //     consoleWarnSpy.mockRestore();
  //   });

  //   test('should update current active state', () => {
  //       stateMachine.transition(StateEnum.UNIT_TEST_STATE_B);
  //       //@ts-ignore
  //       expect(stateMachine.currentState.id).toBe(StateEnum.UNIT_TEST_STATE_B);
  //   });
  // });

  // describe('Event Processing', () => {
  //   beforeEach(() => {
  //       stateMachine.addState(mockStateA);
  //       stateMachine.addState(mockStateB);
  //       stateMachine.start();
  //   });
    
  //   test('should pass events to current active state', () => {
  //     expect(mockStateA.eventCallCount).toBe(0);
  //     stateMachine.onEvent(EventEnum.UNIT_TEST_CONSUME_EVENT);
  //     expect(mockStateA.eventCallCount).toBe(1);
  //     expect(mockStateA.lastEvent).toBe(EventEnum.UNIT_TEST_CONSUME_EVENT);
  //   });

  //   test('should return event processing result', () => {
  //     const consumed = stateMachine.onEvent(EventEnum.UNIT_TEST_CONSUME_EVENT);
  //     expect(consumed).toBe(true);
  //     const notConsumed = stateMachine.onEvent(EventEnum.UNIT_TEST_DO_NOT_CONSUME_EVENT);
  //     expect(notConsumed).toBe(false);
  //   });

  //   test('should not process events if no active state', () => {
  //       const sm = new StateMachine();
  //       sm.addState(mockStateA);
  //       const result = sm.onEvent(EventEnum.UNIT_TEST_CONSUME_EVENT);
  //       expect(result).toBe(false);
  //       expect(mockStateA.eventCallCount).toBe(0);
  //   });
  // });
});
