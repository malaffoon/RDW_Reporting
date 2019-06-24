import { Injectable } from '@angular/core';
import { SecuritySettingService } from './security-settings.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { WindowRefService } from '../../core/window-ref.service';
import { map } from 'rxjs/operators';
import { Resource } from '../state/security-settings';
import { tap } from 'rxjs/internal/operators/tap';

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

  expireSession(): void {
    this.settingService.getSettings().subscribe(({ sessionExpired }) => {
      this.resolveResource(sessionExpired);
    });
  }

  denyAccess(): void {
    this.settingService.getSettings().subscribe(({ accessDenied }) => {
      this.resolveResource(accessDenied);
    });
  }

  refreshSession(): void {
    this.settingService
      .getSettings()
      .pipe(
        tap(refreshSessionSecuritySettings => {
          console.log({ refreshSessionSecuritySettings });
        })
      )

      .subscribe(({ sessionRefresh }) => {
        this.resolveResource(sessionRefresh);
      });
  }

  checkHasOneOrMorePermission(): Observable<boolean> {
    return this.hasOneOrMorePermission().pipe(
      map(has => {
        if (!has) {
          this.denyAccess();
        }
        return has;
      })
    );
  }

  checkHasAnyPermission(permissions: string[]): Observable<boolean> {
    return this.hasAnyPermission(permissions).pipe(
      map(has => {
        if (!has) {
          this.denyAccess();
        }
        return has;
      })
    );
  }

  hasOneOrMorePermission(): Observable<boolean> {
    return this.settingService
      .getSettings()
      .pipe(map(({ permissions = [] }) => permissions.length > 0));
  }

  hasAnyPermission(permissions: string[] = []): Observable<boolean> {
    return this.settingService
      .getSettings()
      .pipe(
        map(({ permissions: userPermissions = [] }) =>
          permissions.some(permission => userPermissions.includes(permission))
        )
      );
  }

  private resolveResource(value: Resource): void {
    if (value == null || value.url == null) {
      this.window.location.reload();
    } else if (value.internal) {
      this.router.navigateByUrl(value.url, {
        skipLocationChange: true
      });
    } else {
      this.window.location.href = value.url;
    }
  }
}
