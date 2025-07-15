import { TestBed } from '@angular/core/testing';

import { BackgroundRenderer } from './background-renderer';

describe('BackgroundRenderer', () => {
  let service: BackgroundRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
