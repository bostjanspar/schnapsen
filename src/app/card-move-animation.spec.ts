import { TestBed } from '@angular/core/testing';

import { CardMoveAnimation } from './card-move-animation';

describe('CardMoveAnimation', () => {
  let service: CardMoveAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardMoveAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
