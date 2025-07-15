import { TestBed } from '@angular/core/testing';

import { RenderOptimizer } from './render-optimizer';

describe('RenderOptimizer', () => {
  let service: RenderOptimizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenderOptimizer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
