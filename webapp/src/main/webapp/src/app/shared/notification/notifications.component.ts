import { Component, ElementRef } from '@angular/core';
import { Notification } from './notification';
import { NotificationsStore } from './notifications.store';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    private elementReference: ElementRef<HTMLElement>
  ) {
    this.notifications = store.getState().pipe(
      tap(() => {
        // Make sure this element is always on top of everything
        document.body.appendChild(this.elementReference.nativeElement);
      })
    );
  }

  onNotificationCloseButtonClick(notification: Notification): void {
    this.store.setState(
      this.store.state.filter(value => value !== notification)
    );
  }
}
