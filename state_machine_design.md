# Hierarchical State Machine Design Rules

## Core Architecture

### 1. Base State Structure
- **BaseState** abstract class that all states must extend
- Contains three abstract methods:
  - `onEntry(): void` - Called when entering the state
  - `onLeave(): void` - Called when leaving the state  
  - `onEvent(event: EventEnum): boolean` - Handles events, returns true if event was consumed
- Each state has a unique enum ID from a centralized `StateEnum`
- States can contain child substates in a collection/map structure

### 2. State Identification System
- Create a master `StateEnum` containing all possible state IDs
- Each state instance must have a unique enum ID
- State machine validates uniqueness when adding states
- Substates also follow the same enum ID system

### 3. Parent-Child State Relationships
- Parent states maintain a collection of child substates
- Child states maintain a reference to their parent state
- `addSubstate(childState: BaseState)` method on parent states
- Parent states track which child is currently active
- Only one child substate can be active at a time per parent

## State Lifecycle Management

### 4. Entry/Exit Order Rules
- **Entry Order**: Child `onEntry()` → Parent `onEntry()`
- **Exit Order**: Parent `onLeave()` → Child `onLeave()`
- When transitioning between substates of the same parent:
  1. Call current substate's `onLeave()`
  2. Call new substate's `onEntry()`
  3. Parent remains active (no onLeave/onEntry called)

### 5. State Transitions
- `transition(targetStateId: StateEnum): boolean` method
- Substates can call `parent.transition(stateId)` to delegate upward
- Transition logic:
  1. Find target state in current state machine
  2. If not found, delegate to parent state machine
  3. Execute leave/entry sequences
  4. Update active state references

## State Machine Hierarchy

### 6. Independent State Machine System
- Multiple state machines can run independently
- Each state machine processes the same events
- State machines are ordered by priority/registration order
- Example structure:
  ```
  TopLevelStateMachine
  ├── MainGameStateMachine (priority 1)
  │   ├── StartNewState
  │   ├── PlayingState
  │   ├── WinState
  │   └── LoseState
  └── CurrentGameStateMachine (priority 2)
      ├── DealCardState
      ├── PlayTrickState
      └── ScoreState
  ```

### 7. Event Processing Chain
- Events flow through state machines in registration order
- Each state machine's `onEvent()` returns boolean:
  - `true` = event consumed, stop propagation
  - `false` = event not handled, continue to next state machine
- Processing stops at first state machine that returns `true`

### 8. Hierarchical Event Handling
- Within each state machine, events process from leaf to root:
  1. Start at deepest active substate
  2. Call `onEvent()` on current substate
  3. If substate returns `false`, bubble up to parent
  4. Continue until event is consumed or reach root
- This allows substates to override parent behavior

## Implementation Guidelines

### 9. State Registration Rules
- State machines maintain registry of all added states
- Check for duplicate enum IDs before adding
- Throw error if attempting to add duplicate state ID
- States can only be added once per state machine

### 10. Active State Tracking
- Each state machine tracks current active state
- Parent states track current active child
- Maintain full path from root to leaf for current state
- Update active state references during transitions

### 11. State Machine Management
- `StateMachineManager` class to orchestrate multiple machines
- Maintains ordered list of registered state machines
- Handles event distribution across machines
- Provides registration/deregistration of state machines

### 12. Validation Rules
- Validate state enum IDs are unique within each state machine
- Ensure parent-child relationships are properly established
- Verify transition target states exist before executing
- Check for circular references in parent-child relationships

### 13. Error Handling
- Invalid transitions should be handled gracefully
- Log warnings for unhandled events
- Provide fallback mechanisms for failed state transitions
- Validate state machine integrity on startup

## Event Flow Example

```
Event Received
    ↓
TopLevelStateMachine.onEvent()
    ↓
MainGameStateMachine.onEvent()
    ↓ (if returns false)
CurrentGameStateMachine.onEvent()
    ↓ (within each machine)
LeafSubstate.onEvent() → ParentState.onEvent() → RootState.onEvent()
```

## Key Benefits of This Design

- **Modularity**: Independent state machines for different concerns
- **Hierarchy**: Natural parent-child relationships with proper lifecycle
- **Event Bubbling**: Flexible event handling from specific to general
- **Extensibility**: Easy to add new states and state machines
- **Validation**: Built-in checks for consistency and uniqueness
- **Debugging**: Clear event flow and state tracking for troubleshooting