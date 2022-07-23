import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
declare global {
    interface Window { dataLayer: any[]; }
}
@Injectable({
    providedIn: 'root'
})
export class CommonService {
    constructor(public dialogService: DialogService) { }
    activeLoader = new Subject<boolean>();
    show() {
        this.activeLoader.next(true);
    }
    hide() {
        this.activeLoader.next(false);
        localStorage.removeItem('isSarch');
    }

    openDialogComponent = (dialogConfig, dialogHeader, width, component) => {
        return this.dialogService.open(component, {
            data: {
                ...dialogConfig
            },
            header: dialogHeader,
            width: width
        });
    }

    dialogComponentConfig = (data, component) => {
        let dialogConfig = {
            data: data,
        };
        let dialogHeader = data.header;
        let width = data.width;
        component = component
        let ref = this.openDialogComponent(dialogConfig, dialogHeader, width, component);
        return ref.onClose;
    }
}
