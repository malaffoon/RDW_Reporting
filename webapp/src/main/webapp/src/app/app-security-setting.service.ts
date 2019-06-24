import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationSettingsService } from './app-settings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';
import {
  Resource,
  SecuritySettings
} from './shared/security/state/security-settings';
import { SecuritySettingService } from './shared/security/service/security-settings.service';
import { UserService } from './shared/security/service/user.service';
import { tap } from 'rxjs/internal/operators/tap';

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
          permissions: user.permissions,
          sessionRefresh,
          accessDenied,
          sessionExpired: defaultSessionExpired
        };
      }),
      tap(securitySettings => {
        console.log({ securitySettings });
      })
    );
  }
}
