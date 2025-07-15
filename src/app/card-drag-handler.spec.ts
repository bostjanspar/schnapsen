import { TestBed } from '@angular/core/testing';

import { CardDragHandler } from './card-drag-handler';

describe('CardDragHandler', () => {
  let service: CardDragHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardDragHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
