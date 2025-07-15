import { TestBed } from '@angular/core/testing';

import { CameraController } from './camera-controller';

describe('CameraController', () => {
  let service: CameraController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
