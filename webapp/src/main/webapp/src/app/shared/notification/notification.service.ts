import { Injectable } from '@angular/core';
import { Notification, NotificationType } from './notification';
import { NotificationsStore } from './notifications.store';

const NotificationDefaults: Partial<Notification> = {
  type: 'info',
  args: {},
  dismissOnTimeout: 10000,
  dismissible: true
};

/**
 * Creates a notification with defaults applied
 *
 * @param type The type of notification
 * @param value The rest of the notifications properties
 */
function toNotification(
  type: NotificationType,
  value: Notification
): Notification {
  return {
    ...NotificationDefaults,
    ...value,
    type
  };
}

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
    const lastNotification: Notification =
      notifications[notifications.length - 1];

    // TODO this should hash the args too before comparing
    const nextState =
      lastNotification == null || lastNotification.id !== notification.id
        ? [...notifications, notification]
        : [...notifications.slice(0, -1), notification];

    this.store.setState(nextState);
  }

  success(notification: Notification): void {
    this.showNotification(toNotification('success', notification));
  }

  info(notification: Notification): void {
    this.showNotification(toNotification('info', notification));
  }

  warn(notification: Notification): void {
    this.showNotification(toNotification('warning', notification));
  }

  error(notification: Notification): void {
    this.showNotification(toNotification('danger', notification));
  }
}
