import { TestBed } from '@angular/core/testing';

import { CardDealAnimation } from './card-deal-animation';

describe('CardDealAnimation', () => {
  let service: CardDealAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardDealAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
