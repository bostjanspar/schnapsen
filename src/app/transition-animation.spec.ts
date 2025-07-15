import { TestBed } from '@angular/core/testing';

import { TransitionAnimation } from './transition-animation';

describe('TransitionAnimation', () => {
  let service: TransitionAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransitionAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
