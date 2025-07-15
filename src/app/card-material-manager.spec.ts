import { TestBed } from '@angular/core/testing';

import { CardMaterialManager } from './card-material-manager';

describe('CardMaterialManager', () => {
  let service: CardMaterialManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardMaterialManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
