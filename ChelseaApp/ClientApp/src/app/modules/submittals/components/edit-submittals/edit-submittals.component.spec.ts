import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubmittalsComponent } from './edit-submittals.component';

describe('EditSubmittalsComponent', () => {
  let component: EditSubmittalsComponent;
  let fixture: ComponentFixture<EditSubmittalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubmittalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubmittalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
