import { StateMachine } from '@/sm/state-machine';
import { StateEnum } from '@/sm/state.enum';
import { TestStateA } from '@test/fixtures/test-states';

describe('Performance Tests', () => {
  // This is a higher timeout because performance tests can be slow
  jest.setTimeout(10000);

  test('should handle large numbers of states efficiently', () => {
    const machine = new StateMachine();
    const stateCount = 1000;
    const states = Array.from({ length: stateCount }, (_, i) => 
      new TestStateA(i as StateEnum)
    );
    
    const startTime = performance.now();
    states.forEach(state => machine.addState(state));
    const endTime = performance.now();
    
    // Check that adding 1000 states takes less than 100ms
    expect(endTime - startTime).toBeLessThan(100); 
  });

  test('should not leak memory during state transitions', () => {
    // A proper memory leak test is complex to set up in Jest without external libraries.
    // This test will simulate rapid transitions to catch obvious performance degradation,
    // which can be a sign of memory issues.
    const machine = new StateMachine();
    const stateA = new TestStateA(StateEnum.TEST_STATE_A);
    const stateB = new TestStateA(StateEnum.TEST_STATE_B);

    machine.addState(stateA);
    machine.addState(stateB);
    machine.start();

    const transitionCount = 10000;
    const startTime = performance.now();

    for (let i = 0; i < transitionCount; i++) {
        machine.transition(i % 2 === 0 ? StateEnum.TEST_STATE_B : StateEnum.TEST_STATE_A);
    }
    
    const endTime = performance.now();

    // Expect 10,000 transitions to take less than 500ms
    expect(endTime - startTime).toBeLessThan(500);
  });
});
