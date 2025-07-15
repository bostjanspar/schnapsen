import { TestBed } from '@angular/core/testing';

import { EffectManager } from './effect-manager';

describe('EffectManager', () => {
  let service: EffectManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EffectManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
