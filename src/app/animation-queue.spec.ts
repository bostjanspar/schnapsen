import { TestBed } from '@angular/core/testing';

import { AnimationQueue } from './animation-queue';

describe('AnimationQueue', () => {
  let service: AnimationQueue;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationQueue);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
