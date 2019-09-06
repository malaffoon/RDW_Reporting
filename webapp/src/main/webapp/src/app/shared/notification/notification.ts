/**
 * Declares all notification types
 */
export type NotificationType = 'success' | 'info' | 'warning' | 'danger';

/**
 * This model represents a notification message.
 */
export interface Notification {
  /**
   * The type of the notification (success, info, warning, danger)
   */
  type?: NotificationType;

  /**
   * Key for the translated message to display
   */
  id: string;

  /**
   * Arguments used to format the message
   */
  args?: any;

  /**
   * Set this flag when the message contains HTML to render
   * Defaults to false
   */
  html?: boolean;

  /**
   * Duration the notification will display before automatically dismissing itself
   * Defaults to 10,000
   */
  dismissOnTimeout?: number;

  /**
   * Set this flag if the notification can be dismissed
   * Defaults to true
   */
  dismissible?: boolean;
}
