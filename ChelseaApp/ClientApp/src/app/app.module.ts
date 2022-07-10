import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { TncComponent } from './components/tnc/tnc.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HttpService } from './components/http.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './components/loader/loader.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { PdfEditorComponent } from './pdf-editor/pdf-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    TncComponent,
    PrivacyComponent,
    LayoutComponent,
    LoaderComponent,
    PdfEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [HttpService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HeaderInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
