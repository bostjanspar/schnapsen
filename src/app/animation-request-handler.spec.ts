import { TestBed } from '@angular/core/testing';

import { AnimationRequestHandler } from './animation-request-handler';

describe('AnimationRequestHandler', () => {
  let service: AnimationRequestHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationRequestHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
