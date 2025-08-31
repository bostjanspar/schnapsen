export enum EventEnum {
  GUI_STARTED_EVENT= 'GUI_STARTED_EVENT',
  START_GAME = 'START_GAME',
  DEALER_SELECTED = 'DEALER_SELECTED',
  CARDS_DEALT = 'CARDS_DEALT',



 // Unit tests
  UNIT_TEST_CONSUME_EVENT = 'UNIT_TEST_CONSUME_EVENT',
  UNIT_TEST_DO_NOT_CONSUME_EVENT = 'UNIT_TEST_DO_NOT_CONSUME_EVENT',
}

export class SimpleEvent{
  constructor(public readonly type: EventEnum) {}
}
