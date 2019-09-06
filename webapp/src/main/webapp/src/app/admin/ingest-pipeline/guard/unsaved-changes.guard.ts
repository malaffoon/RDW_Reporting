import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Components can implement this and use the {@link UnsavedChangesGuard}
 * to warn the user when they navigate away with unsaved changes
 */
export interface ComponentCanDeactivate {
  canDeactivate(): boolean;
}

/**
 * CanDeactivate that launches a browser native confirmation modal when attempting
 * to navigate away with unsaved changes
 */
@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard
  implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(
    component: ComponentCanDeactivate
  ): Observable<boolean> | boolean {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate()
      ? true
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        confirm(
          `WARNING: You have unsaved changes. Click Cancel to go back and save these changes, or OK to continue.`
        );
  }
}
