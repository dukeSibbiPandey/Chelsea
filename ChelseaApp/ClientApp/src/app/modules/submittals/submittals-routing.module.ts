import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingChangesGuard } from 'src/app/interceptors/pendingchanges.guard';
import { MergeSubmittalsComponent } from './components/merge-submittals/merge-submittals.component';
import { PdfEditorActionComponent } from './components/pdf-editor-action/pdf-editor-action.component';
import { SubmittalsFormComponent } from './components/submittals-form/submittals-form.component';
import { SubmittalsComponent } from './components/submittals-list/submittals-list.component';
import { SubmittalsPreviewComponent } from './components/submittals-preview/submittals-preview.component';
import { SubmittalsRouterOutletComponent } from './submittals-router-outlet/submittals-router-outlet.component';

const routes: Routes = [
  {
    path: '', component: SubmittalsRouterOutletComponent,
    children: [
      {
        path: '', redirectTo: 'list', pathMatch: "full"
      },
      {
        path: 'list', pathMatch:'full', component: SubmittalsComponent
      },
      {
        path: 'form/:id/step/:step', pathMatch:'full', component: SubmittalsFormComponent
      },
      {
        path: 'preview/:id',pathMatch:'full',  component: MergeSubmittalsComponent
      },
      {
        path: 'pdf-edit/:id', pathMatch:'full', component: PdfEditorActionComponent, canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'merge/:id', pathMatch:'full', component: MergeSubmittalsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmittalsRoutingModule { }
