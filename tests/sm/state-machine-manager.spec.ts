import { StateMachineManager } from '@/sm/state-machine-manager';
import { StateMachine } from '@/sm/state-machine';
import { EventEnum } from '@/sm/event.enum';
import { TestStateMachineFactory } from '@test/utils/state-machine-factory';

describe('StateMachineManager', () => {
  let stateMachineManager: StateMachineManager;
  let machine1: StateMachine;
  let machine2: StateMachine;

  beforeEach(() => {
    stateMachineManager = new StateMachineManager();
    machine1 = TestStateMachineFactory.createSimpleMachine();
    machine2 = TestStateMachineFactory.createSimpleMachine();
  });

  describe('Machine Registration', () => {
    test('should register state machines successfully', () => {
      stateMachineManager.registerStateMachine(machine1);
      //@ts-ignore
      expect(stateMachineManager.stateMachines).toContain(machine1);
    });

    test('should not register the same state machine twice', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      stateMachineManager.registerStateMachine(machine1);
      stateMachineManager.registerStateMachine(machine1);
      //@ts-ignore
      expect(stateMachineManager.stateMachines.length).toBe(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith('State machine has already been registered.');
      consoleWarnSpy.mockRestore();
    });

    test('should deregister state machines successfully', () => {
      stateMachineManager.registerStateMachine(machine1);
      stateMachineManager.deregisterStateMachine(machine1);
      //@ts-ignore
      expect(stateMachineManager.stateMachines).not.toContain(machine1);
    });

    test('should sort state machines by priority', () => {
        machine1.priority = 10;
        machine2.priority = 20;
        stateMachineManager.registerStateMachine(machine1);
        stateMachineManager.registerStateMachine(machine2);
        //@ts-ignore
        expect(stateMachineManager.stateMachines[0]).toBe(machine2);
        //@ts-ignore
        expect(stateMachineManager.stateMachines[1]).toBe(machine1);
    });
  });

  describe('Event Propagation', () => {
    beforeEach(() => {
        machine1.priority = 1;
        machine2.priority = 2; // higher priority
        stateMachineManager.registerStateMachine(machine1);
        stateMachineManager.registerStateMachine(machine2);
    });

    test('should process events in priority order', () => {
        const machine1Spy = jest.spyOn(machine1, 'onEvent').mockReturnValue(false);
        const machine2Spy = jest.spyOn(machine2, 'onEvent').mockReturnValue(false);
        
        stateMachineManager.onEvent(EventEnum.DO_NOT_CONSUME_EVENT);

        expect(machine2Spy).toHaveBeenCalled();
        expect(machine1Spy).toHaveBeenCalled();
    });
    
    test('should stop at first machine that consumes event', () => {
      const machine1Spy = jest.spyOn(machine1, 'onEvent').mockReturnValue(false);
      const machine2Spy = jest.spyOn(machine2, 'onEvent').mockReturnValue(true);

      stateMachineManager.onEvent(EventEnum.CONSUME_EVENT);

      expect(machine2Spy).toHaveBeenCalledWith(EventEnum.CONSUME_EVENT);
      expect(machine1Spy).not.toHaveBeenCalled();
    });

    test('should pass to all machines if none consume', () => {
        const machine1Spy = jest.spyOn(machine1, 'onEvent').mockReturnValue(false);
        const machine2Spy = jest.spyOn(machine2, 'onEvent').mockReturnValue(false);

        stateMachineManager.onEvent(EventEnum.DO_NOT_CONSUME_EVENT);
        
        expect(machine1Spy).toHaveBeenCalled();
        expect(machine2Spy).toHaveBeenCalled();
    });

    test('should log unhandled events', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        jest.spyOn(machine1, 'onEvent').mockReturnValue(false);
        jest.spyOn(machine2, 'onEvent').mockReturnValue(false);

        stateMachineManager.onEvent(EventEnum.DO_NOT_CONSUME_EVENT);
        
        expect(consoleWarnSpy).toHaveBeenCalledWith('Event DO_NOT_CONSUME_EVENT was not handled by any state machine.');
        consoleWarnSpy.mockRestore();
    });
  });
});
