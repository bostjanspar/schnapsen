import { TestBed } from '@angular/core/testing';

import { TrumpExchangeAnimation } from './trump-exchange-animation';

describe('TrumpExchangeAnimation', () => {
  let service: TrumpExchangeAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrumpExchangeAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
