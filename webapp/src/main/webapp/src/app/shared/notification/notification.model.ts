/**
 * This model represents a notification message.
 */
export class Notification {

  /**
   * The type of the notification (success, info, warning, danger)
   */
  public type: string = 'info';

  /**
   * Key for the translated message to display
   */
  public id: string;

  /**
   * Arguments used to format the message
   */
  public args: any = {};

  /**
   * Set this flag when the message contains HTML to render
   */
  public html: boolean = false;

  /**
   * Duration the notification will display before automatically dismissing itself
   */
  public dismissOnTimeout: number = 10000;

  /**
   * Set this flag if the notification can be dismissed
   */
  public dismissible: boolean = true;

  constructor(options: any) {
    Object.assign(this, options || {});
  }

}
