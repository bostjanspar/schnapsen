import { TestBed } from '@angular/core/testing';

import { HandRenderer } from './hand-renderer';

describe('HandRenderer', () => {
  let service: HandRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
