import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare global {
    interface Window { dataLayer: any[]; }
}
@Injectable({
    providedIn: 'root'
})
export class CommonService {
    constructor() { }
    activeLoader = new Subject<boolean>();
    show() {
        this.activeLoader.next(true);
    }
    hide() {
        this.activeLoader.next(false);
        localStorage.removeItem('isSarch');
    }
}
