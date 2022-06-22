import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsFormStep2Component } from './submittals-form-step2.component';

describe('SubmittalsFormStep2Component', () => {
  let component: SubmittalsFormStep2Component;
  let fixture: ComponentFixture<SubmittalsFormStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsFormStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsFormStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
