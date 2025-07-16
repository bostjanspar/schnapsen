import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Talon } from './talon';

describe('Talon', () => {
  let component: Talon;
  let fixture: ComponentFixture<Talon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Talon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Talon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
