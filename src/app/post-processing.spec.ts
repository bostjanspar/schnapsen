import { TestBed } from '@angular/core/testing';

import { PostProcessing } from './post-processing';

describe('PostProcessing', () => {
  let service: PostProcessing;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostProcessing);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
