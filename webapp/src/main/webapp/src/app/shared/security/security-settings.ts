/**
 * Application security settings
 */
export interface SecuritySettings {
  /**
   * The URL for logging the authenticated user out
   */
  logoutUrl: string;

  /**
   * The URL used to refresh the authenticated user's session.
   * If absent. the page will be reloaded with the current route
   */
  sessionRefresh: Resource;

  /**
   * Where to send the authenticated user when access is denied
   */
  accessDenied: Resource;

  /**
   * Where to send a user when their session has expired
   */
  sessionExpired: Resource;
}

/**
 * An internal or external URL
 */
export interface Resource {
  internal?: boolean;
  url: string;
}
