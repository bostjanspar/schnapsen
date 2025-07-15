import { TestBed } from '@angular/core/testing';

import { AnimationOptimizer } from './animation-optimizer';

describe('AnimationOptimizer', () => {
  let service: AnimationOptimizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationOptimizer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
