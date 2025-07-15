import { TestBed } from '@angular/core/testing';

import { LightingSetup } from './lighting-setup';

describe('LightingSetup', () => {
  let service: LightingSetup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightingSetup);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
