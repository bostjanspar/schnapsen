import { TestBed } from '@angular/core/testing';

import { ActionValidationHandler } from './action-validation-handler';

describe('ActionValidationHandler', () => {
  let service: ActionValidationHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionValidationHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
