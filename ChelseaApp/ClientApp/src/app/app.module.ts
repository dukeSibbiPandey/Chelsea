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
import { DialogService } from 'primeng/dynamicdialog';
import { PendingChangesGuard } from './interceptors/pendingchanges.guard';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MsalModule, MsalService, MsalGuard, MsalInterceptor, MsalBroadcastService, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';
const protectedResourceMap = new Map<string, Array<string>>();
protectedResourceMap.set("https://graph.microsoft.com/v1.0/me", ["user.read"]);
/*protectedResourceMap.set('/Home', ['api://099f3f1c-b126-4930-80ff-497c03969be5/access_as_user']);*/
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
/*const azure = (window as any).azure || {} ;*/
const azure = {
  authority: "https://login.microsoftonline.com/e6008c01-40e7-4192-897c-43891c1d8fac",
  cacheLocation: "sessionStorage",
  clientId: "4b85dede-5bb5-48b5-a879-7f8637706923",
  redirectUri: "/submittals"
};
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
    DragDropComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: azure.clientId,
        authority: azure.authority,
        redirectUri: window.location.origin+azure.redirectUri,
        postLogoutRedirectUri: window.location.origin+azure.redirectUri,
        navigateToLoginRequestUrl: true
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), {

      interactionType: InteractionType.Redirect, // MSAL Guard Configuration,
      authRequest: {
        scopes: ['user.read'],
        redirectUri: window.location.origin + azure.redirectUri
      },
      loginFailedRoute: "/"
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap
    }),
    DragDropModule
  ],
  providers: [HttpService, MsalGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: HeaderInterceptor,
    multi: true
  }, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }, DialogService, PendingChangesGuard],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
