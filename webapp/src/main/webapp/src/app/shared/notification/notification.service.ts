import { Injectable, EventEmitter } from '@angular/core';
import { Notification } from './notification.model';

/**
 * This service is responsible for displaying notification alerts to the user.
 */
@Injectable()
export class NotificationService {
  private _onNotification: EventEmitter<Notification> = new EventEmitter();

  constructor() {}

  get onNotification(): EventEmitter<Notification> {
    return this._onNotification;
  }

  /**
   * Dispatch a notification message for immediate display.
   *
   * @param notification A notification message
   */
  public showNotification(notification: Notification): void {
    this.onNotification.emit(notification);
  }

  public success(options: any): void {
    this.showNotification(this.createNotification('success', options));
  }

  public info(options: any): void {
    this.showNotification(this.createNotification('info', options));
  }

  public warn(options: any): void {
    this.showNotification(this.createNotification('warning', options));
  }

  public error(options: any): void {
    this.showNotification(this.createNotification('danger', options));
  }

  private createNotification(type: string, options: any): Notification {
    return new Notification({ ...options, type });
  }
}
