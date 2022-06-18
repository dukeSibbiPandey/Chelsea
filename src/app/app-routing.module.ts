import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TncComponent } from './components/tnc/tnc.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { SubmittalsFormComponent } from './components/submittals-form/submittals-form.component';
const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'submittals',
    loadChildren: () => import('./modules/submittals/submittals.module').then(mod => mod.SubmittalsModule)
  },
  {
    path: 'submittals/:action/:id', component: SubmittalsFormComponent
  },
  {
    path: 'tnc', component: TncComponent
  },
  {
    path: 'privacy-policy', component: PrivacyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
