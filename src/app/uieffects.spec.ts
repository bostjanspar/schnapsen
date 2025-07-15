import { TestBed } from '@angular/core/testing';

import { UIEffects } from './uieffects';

describe('UIEffects', () => {
  let service: UIEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UIEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
