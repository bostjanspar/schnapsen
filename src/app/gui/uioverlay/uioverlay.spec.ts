import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIOverlay } from './uioverlay';

describe('UIOverlay', () => {
  let component: UIOverlay;
  let fixture: ComponentFixture<UIOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UIOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
