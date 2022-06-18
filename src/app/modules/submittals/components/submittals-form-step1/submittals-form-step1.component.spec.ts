import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsFormStep1Component } from './submittals-form-step1.component';

describe('SubmittalsFormStep1Component', () => {
  let component: SubmittalsFormStep1Component;
  let fixture: ComponentFixture<SubmittalsFormStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsFormStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsFormStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
