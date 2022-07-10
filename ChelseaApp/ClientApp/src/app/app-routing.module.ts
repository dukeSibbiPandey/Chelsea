import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TncComponent } from './components/tnc/tnc.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { PdfEditorComponent } from './pdf-editor/pdf-editor.component';
const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'pdfEditor', component: PdfEditorComponent
  },
  {
    path: 'submittals',
    loadChildren: () => import('./modules/submittals/submittals.module').then(mod => mod.SubmittalsModule)
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
