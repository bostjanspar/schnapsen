import { TestBed } from '@angular/core/testing';

import { InputCoordinator } from './input-coordinator';

describe('InputCoordinator', () => {
  let service: InputCoordinator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputCoordinator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
