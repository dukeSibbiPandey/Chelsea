import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSubmittalsComponent } from './preview-submittals.component';

describe('PreviewSubmittalsComponent', () => {
  let component: PreviewSubmittalsComponent;
  let fixture: ComponentFixture<PreviewSubmittalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewSubmittalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSubmittalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
