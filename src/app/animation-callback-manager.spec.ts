import { TestBed } from '@angular/core/testing';

import { AnimationCallbackManager } from './animation-callback-manager';

describe('AnimationCallbackManager', () => {
  let service: AnimationCallbackManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationCallbackManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
