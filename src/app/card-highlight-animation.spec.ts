import { TestBed } from '@angular/core/testing';

import { CardHighlightAnimation } from './card-highlight-animation';

describe('CardHighlightAnimation', () => {
  let service: CardHighlightAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardHighlightAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
