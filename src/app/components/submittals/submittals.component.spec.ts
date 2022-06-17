import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsComponent } from './submittals.component';

describe('SubmittalsComponent', () => {
  let component: SubmittalsComponent;
  let fixture: ComponentFixture<SubmittalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
