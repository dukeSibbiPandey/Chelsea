import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmittalsRoutingModule } from './submittals-routing.module';
import { SubmittalsRouterOutletComponent } from './submittals-router-outlet/submittals-router-outlet.component';
import { SubmittalsComponent } from './components/submittals-list/submittals-list.component';
import { SubmittalsFormComponent } from './components/submittals-form/submittals-form.component';
import { SubmittalsFormStep1Component } from './components/submittals-form-step1/submittals-form-step1.component';
import { SubmittalsFormStep2Component } from './components/submittals-form-step2/submittals-form-step2.component';
import { SubmittalsStepperComponent } from './components/submittals-stepper/submittals-stepper.component';
import { SubmittalsSectionsComponent } from './components/submittals-form-step2/submittals-sections/submittals-sections.component';
import { SubmittalsPreviewContentComponent } from './components/submittals-preview-content/submittals-preview-content.component';
import { SubmittalsPreviewComponent } from './components/submittals-preview/submittals-preview.component';
import { PreviewPageTwoComponent } from './components/submittals-preview-content/preview-page-two/preview-page-two.component';
import {CheckboxModule} from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SplitButtonModule} from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { MergeSubmittalsComponent } from './components/merge-submittals/merge-submittals.component';
import { EditHeaderComponent } from './components/edit-header/edit-header.component';
import { SubmittalsDetailFormComponent } from './components/submittals-detail-form/submittals-detail-form.component';


@NgModule({
  declarations: [
    SubmittalsRouterOutletComponent,
    SubmittalsComponent,
    SubmittalsFormComponent,
    SubmittalsFormStep1Component,
    SubmittalsFormStep2Component,
    SubmittalsStepperComponent,
    SubmittalsSectionsComponent,
    SubmittalsPreviewComponent,
    SubmittalsPreviewContentComponent,
    PreviewPageTwoComponent,
    MergeSubmittalsComponent,
    EditHeaderComponent,
    SubmittalsDetailFormComponent,
  ],
  imports: [
    CommonModule,
    SubmittalsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DialogModule,
    RadioButtonModule,
    SplitButtonModule,
    ToastModule
  ]
})
export class SubmittalsModule { }