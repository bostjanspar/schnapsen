# Jest Unit Testing Strategy for State Machine

## Test Structure Organization

### 1. Test File Structure (Separate Test Folder)
```
src/
└── sm/
    ├── base-state.ts
    ├── state-machine.ts
    ├── state-machine-manager.ts
    └── ...

test/
├── sm/
│   ├── base-state.spec.ts
│   ├── state-machine.spec.ts
│   ├── state-machine-manager.spec.ts
│   ├── event-propagation.spec.ts
│   └── hierarchical-transitions.spec.ts
├── fixtures/
│   ├── test-states.ts
│   ├── test-state-machines.ts
│   └── test-events.ts
└── utils/
    ├── state-machine-factory.ts
    ├── mock-state-factory.ts
    └── jest-matchers.ts
```

## Test State Machine Creation Strategy

### 2. Test-Only State Implementations
Create simple states specifically for testing that implement the minimum required behavior:

```typescript
// Test State Examples for Jest Tests
class TestStateA extends BaseState {
  public entryCallCount = 0;
  public leaveCallCount = 0;
  public eventCallCount = 0;
  public lastEvent: EventEnum | null = null;

  onEntry(): void {
    this.entryCallCount++;
  }

  onLeave(): void {
    this.leaveCallCount++;
  }

  onEvent(event: EventEnum): boolean {
    this.eventCallCount++;
    this.lastEvent = event;
    return event === EventEnum.CONSUME_EVENT;
  }
}
```

### 3. Test State Machine Factory
Create utility to build test state machines with various configurations:

```typescript
class TestStateMachineFactory {
  static createSimpleMachine(): StateMachine {
    // Returns machine with 3 states: A -> B -> C
  }

  static createHierarchicalMachine(): StateMachine {
    // Returns machine with parent-child relationships
  }

  static createMultiLevelMachine(): StateMachine {
    // Returns machine with 3+ levels of nesting
  }

  static createParallelMachines(): StateMachineManager {
    // Returns manager with multiple independent machines
  }
}
```

## Unit Testing Categories

### 4. Base State Testing
```typescript
// Import examples for separate test folder structure
import { BaseState } from '@/state-machine/base-state';
import { StateMachine } from '@/state-machine/state-machine';
import { StateMachineManager } from '@/state-machine/state-machine-manager';
import { TestStateMachineFactory } from '@test/utils/state-machine-factory';
import { MockStateFactory } from '@test/utils/mock-state-factory';

describe('BaseState', () => {
  let testState: TestStateA;

  beforeEach(() => {
    testState = new TestStateA(StateEnum.TEST_STATE_A);
  });

  describe('State Lifecycle', () => {
    test('should call onEntry when entering state');
    test('should call onLeave when leaving state');
    test('should track entry/leave call counts correctly');
  });

  describe('Event Handling', () => {
    test('should receive events through onEvent method');
    test('should return boolean from onEvent');
    test('should track last received event');
  });

  describe('Parent-Child Relationships', () => {
    test('should accept child states');
    test('should maintain reference to parent');
    test('should prevent duplicate child state IDs');
  });
});
```

### 5. State Machine Core Testing
```typescript
// Import examples for separate test folder structure  
import { StateMachine } from '@/state-machine/state-machine';
import { TestStateA, TestStateB } from '@test/fixtures/test-states';

describe('StateMachine', () => {
  let stateMachine: StateMachine;
  let mockStateA: TestStateA;
  let mockStateB: TestStateB;

  beforeEach(() => {
    stateMachine = new StateMachine();
    mockStateA = new TestStateA(StateEnum.TEST_STATE_A);
    mockStateB = new TestStateB(StateEnum.TEST_STATE_B);
  });

  describe('State Registration', () => {
    test('should add states successfully');
    test('should prevent duplicate state IDs');
    test('should throw error for duplicate registration');
    test('should maintain state registry');
  });

  describe('State Transitions', () => {
    test('should transition between valid states');
    test('should call onLeave on current state');
    test('should call onEntry on target state');
    test('should reject invalid transitions');
    test('should update current active state');
  });

  describe('Event Processing', () => {
    test('should pass events to current active state');
    test('should return event processing result');
    test('should not process events if no active state');
  });
});
```

### 6. Hierarchical State Testing
```typescript  
// Import examples for separate test folder structure
import { BaseState } from '@/state-machine/base-state';
import { StateMachineManager } from '@/state-machine/state-machine-manager';
import { TestStateMachineFactory } from '@test/utils/state-machine-factory';
import { TestParentState, TestStateA, TestStateB, TestStateC } from '@test/fixtures/test-states';

describe('Hierarchical States', () => {
  let parentState: TestParentState;
  let childStateA: TestStateA;
  let childStateB: TestStateB;
  let grandChildState: TestStateC;

  beforeEach(() => {
    // Setup parent with children and grandchild
    parentState = new TestParentState(StateEnum.PARENT);
    childStateA = new TestStateA(StateEnum.CHILD_A);
    childStateB = new TestStateB(StateEnum.CHILD_B);
    grandChildState = new TestStateC(StateEnum.GRANDCHILD);
    
    parentState.addSubstate(childStateA);
    parentState.addSubstate(childStateB);
    childStateA.addSubstate(grandChildState);
  });

  describe('Entry Order', () => {
    test('should call child onEntry before parent onEntry');
    test('should call grandchild onEntry first in 3-level hierarchy');
    test('should handle entry order with multiple children');
  });

  describe('Exit Order', () => {
    test('should call parent onLeave before child onLeave');
    test('should call grandparent onLeave first in 3-level hierarchy');
  });

  describe('Event Bubbling', () => {
    test('should start event processing at deepest active child');
    test('should bubble up to parent if child returns false');
    test('should stop bubbling if any state returns true');
    test('should handle event at correct level in hierarchy');
  });

  describe('Substate Management', () => {
    test('should track active child state');
    test('should switch between child states');
    test('should maintain only one active child');
  });
});
```

### 7. Event Propagation Testing
```typescript
// Import examples for separate test folder structure
import { StateMachineManager } from '@/state-machine/state-machine-manager';
import { StateMachine } from '@/state-machine/state-machine';
import { TestStateMachineFactory } from '@test/utils/state-machine-factory';

describe('Event Propagation', () => {
  let stateMachineManager: StateMachineManager;
  let machine1: StateMachine;
  let machine2: StateMachine;
  let machine3: StateMachine;

  beforeEach(() => {
    stateMachineManager = new StateMachineManager();
    machine1 = TestStateMachineFactory.createSimpleMachine();
    machine2 = TestStateMachineFactory.createSimpleMachine();
    machine3 = TestStateMachineFactory.createSimpleMachine();
    
    stateMachineManager.addStateMachine(machine1);
    stateMachineManager.addStateMachine(machine2);
    stateMachineManager.addStateMachine(machine3);
  });

  describe('Cross-Machine Event Processing', () => {
    test('should process events in registration order');
    test('should stop at first machine that consumes event');
    test('should pass to all machines if none consume');
    test('should track which machine handled event');
  });

  describe('Event Consumption', () => {
    test('should respect event consumption (return true)');
    test('should continue propagation on false return');
    test('should log unhandled events');
  });
});
```

## Mock and Spy Strategy

### 8. Jest Mock Implementation
```typescript
// Mock State Factory
class MockStateFactory {
  static createSpyState(stateId: StateEnum): jest.Mocked<BaseState> {
    return {
      stateId,
      onEntry: jest.fn(),
      onLeave: jest.fn(),
      onEvent: jest.fn().mockReturnValue(false),
      addSubstate: jest.fn(),
      parent: null,
      children: new Map()
    } as jest.Mocked<BaseState>;
  }

  static createConsumingState(stateId: StateEnum): jest.Mocked<BaseState> {
    const state = this.createSpyState(stateId);
    state.onEvent.mockReturnValue(true); // Always consume events
    return state;
  }

  static createBubblingState(stateId: StateEnum): jest.Mocked<BaseState> {
    const state = this.createSpyState(stateId);
    state.onEvent.mockReturnValue(false); // Never consume, always bubble
    return state;
  }
}
```

### 9. Custom Jest Matchers
```typescript
// Custom matchers for state machine testing
expect.extend({
  toHaveBeenEnteredBefore(received: jest.MockedFunction, other: jest.MockedFunction) {
    // Verify entry order between states
  },

  toHaveConsumedEvent(received: jest.MockedFunction, event: EventEnum) {
    // Verify specific event was handled
  },

  toBeActiveState(received: StateMachine, stateId: StateEnum) {
    // Verify current active state
  }
});
```

## Test Scenarios and Edge Cases

### 10. Critical Test Scenarios
```typescript
describe('Critical Scenarios', () => {
  describe('State Registration Edge Cases', () => {
    test('should handle adding states with same parent');
    test('should prevent circular parent-child references');
    test('should handle orphaned states cleanup');
  });

  describe('Transition Edge Cases', () => {
    test('should handle transition to non-existent state');
    test('should handle transition during another transition');
    test('should handle self-transition');
    test('should handle transition from substate to uncle state');
  });

  describe('Event Processing Edge Cases', () => {
    test('should handle events when no active state');
    test('should handle null/undefined events');
    test('should handle events during state transitions');
    test('should handle rapid event sequences');
  });
});
```

### 11. Performance and Memory Tests
```typescript
describe('Performance Tests', () => {
  test('should handle large numbers of states efficiently', () => {
    const machine = new StateMachine();
    const states = Array.from({length: 1000}, (_, i) => 
      new TestStateA(i as StateEnum)
    );
    
    const startTime = performance.now();
    states.forEach(state => machine.addState(state));
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
  });

  test('should not leak memory during state transitions', () => {
    // Memory usage verification
  });
});
```

## Test Execution Strategy

### 12. Test Organization Patterns
```typescript
describe('StateMachine Integration', () => {
  // Group related functionality
  describe('when initialized', () => {
    // Initial state tests
  });

  describe('when processing events', () => {
    // Event handling tests
  });

  describe('when transitioning states', () => {
    // Transition tests
  });
});
```

### 13. Setup and Teardown
```typescript
describe('StateMachine', () => {
  let stateMachine: StateMachine;
  let testStates: TestStateA[];

  beforeEach(() => {
    // Clean setup for each test
    stateMachine = new StateMachine();
    testStates = [
      new TestStateA(StateEnum.STATE_A),
      new TestStateA(StateEnum.STATE_B),
      new TestStateA(StateEnum.STATE_C)
    ];
  });

  afterEach(() => {
    // Cleanup after each test
    stateMachine.cleanup();
    testStates.forEach(state => state.cleanup());
  });
});
```

## Assertion Strategy

### 14. State Machine Assertions
```typescript
// Verification helpers
function expectStateTransition(
  machine: StateMachine,
  fromState: StateEnum,
  toState: StateEnum,
  event?: EventEnum
) {
  expect(machine.getCurrentState()).toBe(fromState);
  if (event) machine.onEvent(event);
  else machine.transition(toState);
  expect(machine.getCurrentState()).toBe(toState);
}

function expectCallSequence(calls: jest.MockedFunction[]) {
  calls.forEach((call, index) => {
    expect(call).toHaveBeenCalledTimes(index + 1);
  });
}
```

### 15. Jest Configuration for Separate Test Folder
```typescript
// jest.config.js configuration for separate test folder structure
{
  testMatch: [
    '<rootDir>/test/**/*.spec.ts',
    '<rootDir>/test/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'src/state-machine/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts'
  ],
  coverageThreshold: {
    'src/state-machine/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  moduleNameMapping: {
    '^@/(.*)
```

## Benefits of This Unit Testing Approach

- **Comprehensive**: Tests all state machine functionality in isolation
- **Fast Execution**: Pure unit tests with no external dependencies
- **Maintainable**: Clear test structure with reusable utilities
- **Reliable**: Deterministic tests with proper mocking
- **Debuggable**: Easy to identify and fix failing components
- **Coverage-Focused**: High code coverage with meaningful assertions: '<rootDir>/src/$1',
    '^@test/(.*)
```

## Benefits of This Unit Testing Approach

- **Comprehensive**: Tests all state machine functionality in isolation
- **Fast Execution**: Pure unit tests with no external dependencies
- **Maintainable**: Clear test structure with reusable utilities
- **Reliable**: Deterministic tests with proper mocking
- **Debuggable**: Easy to identify and fix failing components
- **Coverage-Focused**: High code coverage with meaningful assertions: '<rootDir>/test/$1'
  }
}
```

## Benefits of This Unit Testing Approach

- **Comprehensive**: Tests all state machine functionality in isolation
- **Fast Execution**: Pure unit tests with no external dependencies
- **Maintainable**: Clear test structure with reusable utilities
- **Reliable**: Deterministic tests with proper mocking
- **Debuggable**: Easy to identify and fix failing components
- **Coverage-Focused**: High code coverage with meaningful assertions