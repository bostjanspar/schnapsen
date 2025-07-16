import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrickArea } from './trick-area';

describe('TrickArea', () => {
  let component: TrickArea;
  let fixture: ComponentFixture<TrickArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrickArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrickArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
