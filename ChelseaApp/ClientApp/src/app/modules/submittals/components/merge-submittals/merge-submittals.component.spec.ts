import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeSubmittalsComponent } from './merge-submittals.component';

describe('MergeSubmittalsComponent', () => {
  let component: MergeSubmittalsComponent;
  let fixture: ComponentFixture<MergeSubmittalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeSubmittalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeSubmittalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
