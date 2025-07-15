import { TestBed } from '@angular/core/testing';

import { AnimationManager } from './animation-manager';

describe('AnimationManager', () => {
  let service: AnimationManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
