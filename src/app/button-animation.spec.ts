import { TestBed } from '@angular/core/testing';

import { ButtonAnimation } from './button-animation';

describe('ButtonAnimation', () => {
  let service: ButtonAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
