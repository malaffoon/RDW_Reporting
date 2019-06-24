import { Injectable } from '@angular/core';
import { SecuritySettingService } from './security-settings.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Resource } from './security-settings';
import { WindowRefService } from '../core/window-ref.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private window: Window;

  constructor(
    private settingService: SecuritySettingService,
    private router: Router,
    windowRefService: WindowRefService
  ) {
    this.window = windowRefService.nativeWindow;
  }

  handleSessionExpired(): void {
    this.settingService.getSettings().subscribe(({ sessionExpired }) => {
      this.resolveResource(sessionExpired);
    });
  }

  handleAccessDenied(): void {
    this.settingService.getSettings().subscribe(({ accessDenied }) => {
      this.resolveResource(accessDenied);
    });
  }

  private resolveResource(value: Resource): void {
    if (value == null || value.url == null) {
      this.window.location.reload();
      return;
    }
    if (value.internal) {
      this.router.navigateByUrl(value.url, {
        skipLocationChange: true
      });
    }
    this.window.location.href = value.url;
  }
}
