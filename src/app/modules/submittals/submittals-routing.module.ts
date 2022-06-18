import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmittalsListComponent } from './components/submittals-list/submittals-list.component';
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmittalsRoutingModule { }
