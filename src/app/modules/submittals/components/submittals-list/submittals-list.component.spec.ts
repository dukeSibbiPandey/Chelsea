import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsListComponent } from './submittals-list.component';

describe('SubmittalsListComponent', () => {
  let component: SubmittalsListComponent;
  let fixture: ComponentFixture<SubmittalsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
