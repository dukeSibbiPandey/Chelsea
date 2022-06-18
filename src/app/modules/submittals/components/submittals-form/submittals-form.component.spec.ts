import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsFormComponent } from './submittals-form.component';

describe('SubmittalsFormComponent', () => {
  let component: SubmittalsFormComponent;
  let fixture: ComponentFixture<SubmittalsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
