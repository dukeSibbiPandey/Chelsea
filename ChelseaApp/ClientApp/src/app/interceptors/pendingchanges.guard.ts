import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
  okCallback: () => void;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  confirmAndRunCallback(component: ComponentCanDeactivate): boolean {
     var t = confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.') as boolean;
     if (t)
         component.okCallback();
    return t;
  }
    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
        // if there are no pending changes, just allow deactivation; else confirm first
        return component.canDeactivate() ?
            true : this.confirmAndRunCallback(component);
    }
}
