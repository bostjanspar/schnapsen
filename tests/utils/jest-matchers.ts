import { StateMachine } from '@/sm/state-machine';
import { StateEnum } from '@/sm/state.enum';
import { EventEnum } from '@/sm/event.enum';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeActiveState(stateId: StateEnum): R;
      toHaveConsumedEvent(event: EventEnum): R;
      toHaveBeenEnteredBefore(other: jest.MockedFunction): R;
    }
  }
}

expect.extend({
  toBeActiveState(received: StateMachine, stateId: StateEnum) {
    // @ts-ignore
    const currentStateId = received.currentState?.id;
    const pass = currentStateId === stateId;

    if (pass) {
      return {
        message: () => `expected state machine not to be in state ${StateEnum[stateId]}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected state machine to be in state ${StateEnum[stateId]}, but it was in ${StateEnum[currentStateId]}`,
        pass: false,
      };
    }
  },

  toHaveConsumedEvent(received: jest.MockedFunction, event: EventEnum) {
    const pass = received.mock.calls.some(call => call[0] === event && call[1] === true);
    if (pass) {
        return {
            message: () => `expected event ${EventEnum[event]} not to be consumed`,
            pass: true
        }
    }
    return {
        message: () => `expected event ${EventEnum[event]} to be consumed`,
        pass: false
    }
  },

  toHaveBeenEnteredBefore(received: jest.MockedFunction, other: jest.MockedFunction) {
    const receivedOrder = received.mock.invocationCallOrder[0];
    const otherOrder = other.mock.invocationCallOrder[0];
    const pass = receivedOrder < otherOrder;

    if(pass) {
        return {
            message: () => `expected mock to have been called after another mock`,
            pass: true
        }
    }

    return {
        message: () => `expected mock to have been called before another mock`,
        pass: false
    }
  }
});
