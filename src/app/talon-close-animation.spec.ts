import { TestBed } from '@angular/core/testing';

import { TalonCloseAnimation } from './talon-close-animation';

describe('TalonCloseAnimation', () => {
  let service: TalonCloseAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalonCloseAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
