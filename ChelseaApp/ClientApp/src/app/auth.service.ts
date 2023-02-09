import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
declare global {
  interface Window { dataLayer: any[]; }
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private authService: MsalService) { }
  activeLoader = new Subject<boolean>();
  getName() {
    var d = this.authService.instance.getAllAccounts();

    let name = d && d.length > 0 && (d[0]?.name || d[0]?.username);
    return name || 'name';
  }
  getUserName() {
    var d = this.authService.instance.getAllAccounts();

    let username = d && d.length > 0 && (d[0]?.username);
    return username || 'guest';
  }
  getFormatedName() {
    let name = this.getName();
    var matches = name.match(/\b(\w)/g); // ['J','S','O','N']
    var acronym = matches.join('');
    return acronym;
  }

 
}
