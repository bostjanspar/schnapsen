import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardValuesBox } from './card-values-box';

describe('CardValuesBox', () => {
  let component: CardValuesBox;
  let fixture: ComponentFixture<CardValuesBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardValuesBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardValuesBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
