import { TestBed } from '@angular/core/testing';

import { CardMeshFactory } from './card-mesh-factory';

describe('CardMeshFactory', () => {
  let service: CardMeshFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardMeshFactory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
