import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';


@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(private _CustomService: CommonService, private _Router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const noLoader = localStorage.getItem('noloader');
        if (!noLoader) {
            this._CustomService.show();
        }
        return next.handle(req).pipe(finalize(() => !noLoader ? this.hideLoader() : localStorage.removeItem('noloader')));
    }
    hideLoader = () => {
        setTimeout(() => {
            this._CustomService.hide()
        }, 1000);
    }
}
