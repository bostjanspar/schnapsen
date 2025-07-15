import { TestBed } from '@angular/core/testing';

import { MarriageAnimation } from './marriage-animation';

describe('MarriageAnimation', () => {
  let service: MarriageAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarriageAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
