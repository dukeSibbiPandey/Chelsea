import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { SubmittalsComponent } from './components/submittals/submittals.component';
import { FooterComponent } from './components/footer/footer.component';
import { TncComponent } from './components/tnc/tnc.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SubmittalsFormComponent } from './components/submittals-form/submittals-form.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './components/http.service';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SubmittalsComponent,
    FooterComponent,
    TncComponent,
    PrivacyComponent,
    LayoutComponent,
    SubmittalsFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
