import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPageTwoComponent } from './preview-page-two.component';

describe('PreviewPageTwoComponent', () => {
  let component: PreviewPageTwoComponent;
  let fixture: ComponentFixture<PreviewPageTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewPageTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPageTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
