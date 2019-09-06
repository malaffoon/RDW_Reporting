import { Injectable } from '@angular/core';
import { SecuritySettingService } from './security-settings.service';
import { Observable } from 'rxjs';
import { SecuritySettings } from '../state/security-settings';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class DefaultSecuritySettingsService extends SecuritySettingService {
  getSettings(): Observable<SecuritySettings> {
    return of({
      logoutUrl: '/logout',
      permissions: [],
      accessDenied: {
        internal: true,
        url: '/access-denied'
      },
      sessionExpired: {
        internal: true,
        url: '/session-expired'
      }
    });
  }
}
