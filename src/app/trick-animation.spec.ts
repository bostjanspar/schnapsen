import { TestBed } from '@angular/core/testing';

import { TrickAnimation } from './trick-animation';

describe('TrickAnimation', () => {
  let service: TrickAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrickAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
