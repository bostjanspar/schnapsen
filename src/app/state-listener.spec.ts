import { TestBed } from '@angular/core/testing';

import { StateListener } from './state-listener';

describe('StateListener', () => {
  let service: StateListener;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateListener);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
