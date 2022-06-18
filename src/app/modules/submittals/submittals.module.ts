import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubmittalsRoutingModule } from './submittals-routing.module';
import { SubmittalsRouterOutletComponent } from './submittals-router-outlet/submittals-router-outlet.component';
import { SubmittalsListComponent } from './components/submittals-list/submittals-list.component';
import { SubmittalsFormComponent } from './components/submittals-form/submittals-form.component';
import { SubmittalsFormStep1Component } from './components/submittals-form-step1/submittals-form-step1.component';
import { SubmittalsFormStep2Component } from './components/submittals-form-step2/submittals-form-step2.component';
import { SubmittalsStepperComponent } from './components/submittals-stepper/submittals-stepper.component';


@NgModule({
  declarations: [
    SubmittalsRouterOutletComponent,
    SubmittalsListComponent,
    SubmittalsFormComponent,
    SubmittalsFormStep1Component,
    SubmittalsFormStep2Component,
    SubmittalsStepperComponent
  ],
  imports: [
    CommonModule,
    SubmittalsRoutingModule
  ]
})
export class SubmittalsModule { }
