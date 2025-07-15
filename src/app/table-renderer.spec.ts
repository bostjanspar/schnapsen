import { TestBed } from '@angular/core/testing';

import { TableRenderer } from './table-renderer';

describe('TableRenderer', () => {
  let service: TableRenderer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableRenderer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
