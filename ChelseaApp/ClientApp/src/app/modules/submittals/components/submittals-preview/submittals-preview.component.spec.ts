import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsPreviewComponent } from './submittals-preview.component';

describe('SubmittalsPreviewComponent', () => {
  let component: SubmittalsPreviewComponent;
  let fixture: ComponentFixture<SubmittalsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
