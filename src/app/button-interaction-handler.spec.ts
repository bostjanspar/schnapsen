import { TestBed } from '@angular/core/testing';

import { ButtonInteractionHandler } from './button-interaction-handler';

describe('ButtonInteractionHandler', () => {
  let service: ButtonInteractionHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonInteractionHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
