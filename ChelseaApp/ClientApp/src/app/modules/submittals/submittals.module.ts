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
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { MergeSubmittalsComponent } from './components/merge-submittals/merge-submittals.component';
import { EditHeaderComponent } from './components/edit-header/edit-header.component';
import { SubmittalsDetailFormComponent } from './components/submittals-detail-form/submittals-detail-form.component';
import { SharedModule } from 'primeng/api';
import { DigitOnlyDirective } from 'src/app/directives/digit-only.directive';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { ProgressBarModule } from 'primeng/progressbar';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { PdfEditorActionComponent } from './components/pdf-editor-action/pdf-editor-action.component';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    DigitOnlyDirective,
    SubmittalsRouterOutletComponent,
    SubmittalsComponent,
    SubmittalsFormComponent,
    SubmittalsFormStep1Component,
    SubmittalsFormStep2Component,
    SubmittalsStepperComponent,
    SubmittalsSectionsComponent,
    SubmittalsPreviewComponent,
    SubmittalsPreviewContentComponent,
    MergeSubmittalsComponent,
    EditHeaderComponent,
    SubmittalsDetailFormComponent,
    PdfEditorActionComponent
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
    ToastModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule,
    CalendarModule,
    FileUploadModule,
    PaginatorModule,
    ImgFallbackModule,
    ProgressBarModule,
    PdfViewerModule,
    TableModule,
    InputMaskModule,
    AutoCompleteModule,
    AutocompleteLibModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'in' }
  ]

})
export class SubmittalsModule { }
