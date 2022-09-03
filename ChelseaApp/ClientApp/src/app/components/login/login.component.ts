import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { EventType } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: MsalService, private router: Router) { }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
  }
  static RemoveDataSessionStorage = () => {
    var arr = []; // Array to hold the keys
    // Iterate over localStorage and insert the keys that meet the condition into arr
    for (var i = 0; i < sessionStorage.length; i++) {
      if (sessionStorage.key(i).startsWith('toolData-')) {
        arr.push(sessionStorage.key(i));
      }
    }

    // Iterate over arr and remove the items by key
    for (var i = 0; i < arr.length; i++) {
      sessionStorage.removeItem(arr[i]);
    }
  }
  async login() {
    const msalInstance = this.authService.instance;
    //const accounts = msalInstance.getAllAccounts();
    //if (accounts.length > 0) {
    //  msalInstance.setActiveAccount(accounts[0]);
    //}

    //msalInstance.addEventCallback((event) => {
    //  // set active account after redirect
    //  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    //    const account = event.payload.account;
    //    msalInstance.setActiveAccount(account);
    //  }
    //});

    //console.log('get active account', msalInstance.getActiveAccount());

    // handle auth redired/do all initial setup for msal
    await msalInstance.handleRedirectPromise();
    const account = await msalInstance.getActiveAccount();
    let url = "/submittals/list";
    if (!account) {
      // redirect anonymous user to login page 
      window.location.assign(url);
    }
    else {
      this.router.navigate([url]);
    }
    //msalInstance.handleRedirectPromise().then(authResult => {
    //  // Check if user signed in 
    //  const account = msalInstance.getActiveAccount();
    //  if (!account) {
    //    // redirect anonymous user to login page 
    //    msalInstance.loginRedirect();
    //  }
    //  else {
    //    let url = "/submittals";
    //    this.router.navigate([url]);
    //  }
    //}).catch(err => {
    //  // TODO: Handle errors
    //  console.log(err);
    //});
    //LoginComponent.RemoveDataSessionStorage();
    //if (this.authService.instance.getAllAccounts().length > 0) {
    // // this.authService.logout();
    //  let url = "/submittals";
    //  this.router.navigate([url]);
    //}
    //else
    //this.authService.loginRedirect();
  }

}
