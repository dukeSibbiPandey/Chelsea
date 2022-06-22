import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsSectionsComponent } from './submittals-sections.component';

describe('SubmittalsSectionsComponent', () => {
  let component: SubmittalsSectionsComponent;
  let fixture: ComponentFixture<SubmittalsSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsSectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
