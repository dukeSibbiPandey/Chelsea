import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfActionComponent } from './pdf-action.component';

describe('PdfActionComponent', () => {
  let component: PdfActionComponent;
  let fixture: ComponentFixture<PdfActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
