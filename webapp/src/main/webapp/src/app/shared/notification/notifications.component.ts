import { Component, ElementRef, Inject } from '@angular/core';
import { Notification } from './notification';
import { NotificationsStore } from './notifications.store';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

/**
 * This component is responsible for displaying user notifications.
 */
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent {
  notifications: Observable<Notification[]>;

  constructor(
    private store: NotificationsStore,
    private elementReference: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.notifications = store.getState().pipe(
      tap(() => {
        // Make sure this element is always on top of everything
        this.document.body.appendChild(this.elementReference.nativeElement);
      })
    );
  }

  onNotificationCloseButtonClick(notification: Notification): void {
    this.store.setState(
      this.store.state.filter(value => value !== notification)
    );
  }
}
