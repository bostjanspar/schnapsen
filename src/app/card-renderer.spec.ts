import { TestBed } from '@angular/core/testing';

import { CardRenderer } from './card-renderer';

describe('CardRenderer', () => {
  let service: CardRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
