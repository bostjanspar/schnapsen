import { TestBed } from '@angular/core/testing';

import { TalonRenderer } from './talon-renderer';

describe('TalonRenderer', () => {
  let service: TalonRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalonRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
