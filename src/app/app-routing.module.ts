import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SubmittalsComponent } from './components/submittals/submittals.component';
import { TncComponent } from './components/tnc/tnc.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'submittals', component: SubmittalsComponent
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
