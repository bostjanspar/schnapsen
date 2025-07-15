import { TestBed } from '@angular/core/testing';

import { CardClickHandler } from './card-click-handler';

describe('CardClickHandler', () => {
  let service: CardClickHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardClickHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
