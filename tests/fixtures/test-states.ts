import { BaseState } from '../../src/app/sm/base-state';
import { StateEnum } from '../../src/app/sm/state.enum';
import { SimpleEvent } from '../../src/app/events/event.enum';

export class TestStateA extends BaseState {
  public entryCallCount = 0;
  public leaveCallCount = 0;
  public eventCallCount = 0;
  public lastEvent: EventEnum | null = null;


  constructor(id: StateEnum) {
    super(id);
  }
  
  onEntry(): void {
    this.entryCallCount++;
  }

  onLeave(): void {
    this.leaveCallCount++;
  }

  override onEvent(event: SimpleEvent): boolean {
    this.eventCallCount++;
    this.lastEvent = event;
    return event === EventEnum.UNIT_TEST_CONSUME_EVENT;
  }

  cleanup() {
    this.entryCallCount = 0;
    this.leaveCallCount = 0;
    this.eventCallCount = 0;
    this.lastEvent = null;
  }
}

export class TestStateB extends TestStateA {}
export class TestStateC extends TestStateA {}

export class TestParentState extends BaseState {
    public entryCallCount = 0;
    public leaveCallCount = 0;
    public eventCallCount = 0;
    public lastEvent: EventEnum | null = null;

    constructor(id: StateEnum) {
        super(id);
    }
    
    onEntry(): void {
        this.entryCallCount++;
    }
    
    onLeave(): void {
        this.leaveCallCount++;
    }
    
    onEvent(event: EventEnum): boolean {
        this.eventCallCount++;
        this.lastEvent = event;
        // Don't consume, allow bubbling
        return false;
    }

    cleanup() {
        this.entryCallCount = 0;
        this.leaveCallCount = 0;
        this.eventCallCount = 0;
        this.lastEvent = null;
    }
}
