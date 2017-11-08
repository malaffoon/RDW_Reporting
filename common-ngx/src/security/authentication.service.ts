import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { StorageService, StorageType, WindowRefService } from "../core";

export const AuthenticationServiceDefaultAuthenticationRoute = new InjectionToken<string>('AuthenticationServiceDefaultAuthenticationRoute');
export const AuthenticationServiceAuthenticationExpiredRoute = new InjectionToken<string>('AuthenticationServiceAuthenticationExpiredRoute');

/**
 * This service is responsible for handling authentication errors.
 */
@Injectable()
export class AuthenticationService {

  private urlWhenSessionExpiredKey: string = 'urlWhenSessionExpired';
  private window: any;


  constructor(private router: Router,
              private location: Location,
              private storageService: StorageService,
              windowRefService: WindowRefService,
              @Optional() @Inject(AuthenticationServiceAuthenticationExpiredRoute) private authenticationExpiredRoute: string,
              @Optional() @Inject(AuthenticationServiceDefaultAuthenticationRoute) private defaultAuthenticationRoute: string) {
    this.window = windowRefService.nativeWindow;
  }

  /**
   * On authentication failure, navigate the user to the session-timeout route.
   */
  navigateToAuthenticationExpiredRoute(): void {
    let url = this.window.location.href;

    // If the url was the root, navigate to home instead so the user doesn't get the
    // landing page.
    if (this.defaultAuthenticationRoute && this.window.location.pathname === '/') {
      url += this.defaultAuthenticationRoute;
    }

    // Prevent looping of session-expired page.
    if (url.indexOf(this.authenticationExpiredRoute) === -1) {
      this.urlWhenSessionExpired = url;
    }

    this.router.navigate([ this.authenticationExpiredRoute ]);
  }

  /**
   * Re-authenticates the user by navigating them to a URL where reauthentication is triggered
   */
  authenticate(): void {
    this.window.location.href = this.authenticationUrl;
  }

  /**
   * Retrieve the user's url at the time of authentication failure.
   *
   * @returns {string|null} A url
   */
  private get authenticationUrl(): string {
    let url = this.urlWhenSessionExpired;
    if (!url) {
      return this.location.prepareExternalUrl(this.defaultAuthenticationRoute || '/');
    }
    return url;
  }

  get urlWhenSessionExpired(): string {
    return this.storageService.getStorage(StorageType.Session).getItem(this.urlWhenSessionExpiredKey);
  }

  set urlWhenSessionExpired(value: string) {
    this.storageService.getStorage(StorageType.Session).setItem(this.urlWhenSessionExpiredKey, value);
  }

}
