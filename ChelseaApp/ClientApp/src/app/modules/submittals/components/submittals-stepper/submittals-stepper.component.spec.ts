import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsStepperComponent } from './submittals-stepper.component';

describe('SubmittalsStepperComponent', () => {
  let component: SubmittalsStepperComponent;
  let fixture: ComponentFixture<SubmittalsStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
