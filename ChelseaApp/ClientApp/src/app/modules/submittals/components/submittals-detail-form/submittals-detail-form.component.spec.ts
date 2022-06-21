import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsDetailFormComponent } from './submittals-detail-form.component';

describe('SubmittalsDetailFormComponent', () => {
  let component: SubmittalsDetailFormComponent;
  let fixture: ComponentFixture<SubmittalsDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
