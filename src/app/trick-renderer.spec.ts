import { TestBed } from '@angular/core/testing';

import { TrickRenderer } from './trick-renderer';

describe('TrickRenderer', () => {
  let service: TrickRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrickRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
