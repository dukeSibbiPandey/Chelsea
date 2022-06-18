import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittalsRouterOutletComponent } from './submittals-router-outlet.component';

describe('SubmittalsRouterOutletComponent', () => {
  let component: SubmittalsRouterOutletComponent;
  let fixture: ComponentFixture<SubmittalsRouterOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittalsRouterOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittalsRouterOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
