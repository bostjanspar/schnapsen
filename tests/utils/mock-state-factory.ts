import { BaseState } from '@/sm/base-state';
import { StateEnum } from '@/sm/state.enum';

export class MockStateFactory {
  static createSpyState(stateId: StateEnum): jest.Mocked<BaseState> {
    const state = {
      id: stateId,
      parent: null,
      onEntry: jest.fn(),
      onLeave: jest.fn(),
      onEvent: jest.fn().mockReturnValue(false),
      addSubstate: jest.fn(),
      transition: jest.fn(),
      children: new Map(),
    } as unknown as jest.Mocked<BaseState>;

    // Needed because 'children' is a protected property on BaseState
    Object.defineProperty(state, 'children', {
        value: new Map(),
        writable: true
    });

    return state;
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
