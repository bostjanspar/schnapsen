import { TestBed } from '@angular/core/testing';

import { CardFlipAnimation } from './card-flip-animation';

describe('CardFlipAnimation', () => {
  let service: CardFlipAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardFlipAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
