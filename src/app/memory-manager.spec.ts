import { TestBed } from '@angular/core/testing';

import { MemoryManager } from './memory-manager';

describe('MemoryManager', () => {
  let service: MemoryManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
