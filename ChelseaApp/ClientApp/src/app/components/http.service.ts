import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Injectable()
export class HttpService {
  private baseUrl: string;

  constructor(private _http: HttpClient, private httpBackend: HttpBackend) {
    if(window.location.origin.indexOf('localhost:4200')>-1){
      this.baseUrl = 'https://chelsea.skdedu.in/api/';  
    }else{
      this.baseUrl = '/api/';
    }
  }

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  post(apiUrl: any, data: any) {
    const url = this.baseUrl + apiUrl;
    return this._http.post(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  get(apiUrl: any) {
    const url = this.baseUrl + apiUrl;
    return this._http.get(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getWithData(url: any, data: any) {
    return this._http.get(url + data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  fileupload(apiUrl: any, data: any, headers:{}, params:{}) {
    const url = this.baseUrl + apiUrl;
    const newHttpClient = new HttpClient(this.httpBackend);
    return newHttpClient.post<any>(url, data, { 'headers': { ...headers }, 'params': params });
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(error.error));
  }

  isNullSelected(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      if (control.value === '0' || control.value === 0) {
        resolve({ 'nullSelected': true });
      } else {
        resolve(null);
      }
    });
    return promise;
  }
}
