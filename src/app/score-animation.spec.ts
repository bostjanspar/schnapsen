import { TestBed } from '@angular/core/testing';

import { ScoreAnimation } from './score-animation';

describe('ScoreAnimation', () => {
  let service: ScoreAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
