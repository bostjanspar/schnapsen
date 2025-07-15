import { TestBed } from '@angular/core/testing';

import { CardHoverHandler } from './card-hover-handler';

describe('CardHoverHandler', () => {
  let service: CardHoverHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardHoverHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
