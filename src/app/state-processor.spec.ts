import { TestBed } from '@angular/core/testing';

import { StateProcessor } from './state-processor';

describe('StateProcessor', () => {
  let service: StateProcessor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateProcessor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
