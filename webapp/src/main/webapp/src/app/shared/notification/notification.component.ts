import { Component } from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import { remove, isEqual } from 'lodash';

/**
 * This component is responsible for displaying user notifications.
 */
@Component({
  selector: 'app-notifications',
  templateUrl: 'notification.component.html'
})
export class NotificationComponent {
  public notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {
    // TODO should be a "Store"
    notificationService.onNotification.subscribe(
      this.onNotification.bind(this)
    );
  }

  /**
   * When a notification is dismissed, remove it from the list.
   *
   * @param notification The dismissed notification
   */
  public onDismissed(notification: Notification): void {
    const index: number = this.notifications.indexOf(notification);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }

  /**
   * When a notification is received, display it to the user.
   *
   * @param notification A notification
   */
  private onNotification(notification: Notification): void {
    // if the same message is being generated again then remove it so a new one can be added and the dismiss time extended
    remove(this.notifications, x => isEqual(x, notification));

    this.notifications.push(notification);
  }
}
