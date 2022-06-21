import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MergeSubmittalsComponent } from './components/merge-submittals/merge-submittals.component';
import { SubmittalsFormComponent } from './components/submittals-form/submittals-form.component';
import { SubmittalsListComponent } from './components/submittals-list/submittals-list.component';
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
        path: 'list', component: SubmittalsListComponent
      },
      {
        path: 'form/:action/:id/step/:step', component: SubmittalsFormComponent
      },
      {
        path: 'preview/:id', component: SubmittalsPreviewComponent
      },
      {
        path: 'merge/:id', component: MergeSubmittalsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmittalsRoutingModule { }
