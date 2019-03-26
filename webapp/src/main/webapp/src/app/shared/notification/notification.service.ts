import { Injectable } from '@angular/core';
import { Notification } from './notification';
import { NotificationsStore } from './notifications.store';

const NotificationDefaults: Partial<Notification> = {
  type: 'info',
  args: {},
  dismissOnTimeout: 10000,
  dismissible: true
};

/**
 * This service is responsible for displaying notification alerts to the user.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private store: NotificationsStore) {}

  /**
   * Dispatch a notification message for immediate display.
   *
   * @param notification A notification message
   */
  showNotification(notification: Notification): void {
    const { state: notifications } = this.store;

    const notificationWithDefaults = {
      ...NotificationDefaults,
      ...notification
    };

    const lastNotification: Notification =
      notifications[notifications.length - 1];

    const nextState =
      lastNotification == null || lastNotification.id !== notification.id
        ? [...notifications, notificationWithDefaults]
        : [...notifications.slice(0, -1), notificationWithDefaults];

    this.store.setState(nextState);
  }

  success(notification: Notification): void {
    this.showNotification({
      ...notification,
      type: 'success'
    });
  }

  info(notification: Notification): void {
    this.showNotification({
      ...notification,
      type: 'info'
    });
  }

  warn(notification: Notification): void {
    this.showNotification({
      ...notification,
      type: 'warning'
    });
  }

  error(notification: Notification): void {
    this.showNotification({
      ...notification,
      type: 'danger'
    });
  }
}
