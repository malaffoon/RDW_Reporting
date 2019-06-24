import { SecuritySettingService } from './shared/security/security-settings.service';
import { Injectable } from '@angular/core';
import {
  Resource,
  SecuritySettings
} from './shared/security/security-settings';
import { Observable } from 'rxjs';
import { UserService } from './shared/security/user.service';
import { ApplicationSettingsService } from './app-settings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';

const defaultAccessDenied: Resource = {
  internal: true,
  url: '/access-denied'
};

const defaultSessionExpired: Resource = {
  internal: true,
  url: '/session-expired'
};

@Injectable()
export class ApplicationSecuritySettingService extends SecuritySettingService {
  constructor(
    private settingsService: ApplicationSettingsService,
    private userService: UserService
  ) {
    super();
  }

  getSettings(): Observable<SecuritySettings> {
    return forkJoin(
      this.settingsService.getSettings(),
      this.userService.getUser()
    ).pipe(
      map(([settings, user]) => {
        const accessDenied: Resource =
          settings.accessDeniedUrl != null
            ? { url: settings.accessDeniedUrl }
            : defaultAccessDenied;

        const sessionRefresh =
          user.sessionRefreshUrl != null
            ? { url: user.sessionRefreshUrl }
            : null;

        return {
          logoutUrl: user.logoutUrl,
          sessionRefresh,
          accessDenied,
          sessionExpired: defaultSessionExpired
        };
      })
    );
  }
}
