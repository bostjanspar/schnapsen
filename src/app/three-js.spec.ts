import { TestBed } from '@angular/core/testing';

import { ThreeJS } from './three-js';

describe('ThreeJS', () => {
  let service: ThreeJS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeJS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
