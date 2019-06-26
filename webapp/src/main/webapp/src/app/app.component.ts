import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { Location, PopStateEvent, registerLocaleData } from '@angular/common';
import { LanguageStore } from './shared/i18n/language.store';
import { SpinnerModal } from './shared/loading/spinner.modal';
import { ApplicationSettings } from './app-settings';
import { ApplicationSettingsService } from './app-settings.service';
import { Observable, throwError as _throw } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import localeEs from '@angular/common/locales/es';
import { User } from './shared/security/state/user';
import { UserService } from './shared/security/service/user.service';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  private _lastPoppedUrl: string;
  private _doNotDeleteThisAnalytics: Angulartics2GoogleAnalytics;

  user$: Observable<User>;
  applicationSettings$: Observable<ApplicationSettings>;
  navbarOpen: boolean = false;

  constructor(
    public languageStore: LanguageStore,
    private router: Router,
    private location: Location,
    private userService: UserService,
    private applicationSettingsService: ApplicationSettingsService,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {
    /*
      Even though the angulartics2GoogleAnalytics variable is not explicitly used,
      without it analytics data is not sent to the service.  This private variable prevents
      unintended removal by autoformatting
    */
    this._doNotDeleteThisAnalytics = angulartics2GoogleAnalytics;
    angulartics2GoogleAnalytics.startTracking();

    this.registerLocales();
  }

  ngOnInit() {
    this.user$ = this.userService.getUser();

    this.applicationSettings$ = this.user$.pipe(
      flatMap(user =>
        user.permissions.length > 0
          ? this.applicationSettingsService.getSettings().pipe(
              catchError(error => {
                this.router.navigateByUrl('/error');
                return _throw(error);
              }),
              tap(settings => {
                this.languageStore.configuredLanguages = settings.uiLanguages;
                this.initializeAnalytics(settings.analyticsTrackingId);
              })
            )
          : of(<ApplicationSettings>{})
      )
    );

    this.initializeNavigationScrollReset();
    this.initializeNavigationLoadingSpinner();
  }

  scrollToMainContent() {
    setTimeout(() => {
      document.getElementById('maincontent').scrollIntoView();
    }, 0);
  }

  toggleNavCollapse(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  private initializeAnalytics(trackingId: string): void {
    const googleAnalyticsProvider: Function = window['ga'];
    if (googleAnalyticsProvider && trackingId) {
      googleAnalyticsProvider('create', trackingId, 'auto');
    }
  }

  private initializeNavigationScrollReset(): void {
    // by listening to the PopStateEvent we can track the back button
    this.location.subscribe((event: PopStateEvent) => {
      this._lastPoppedUrl = event.url;
    });

    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      // if the user is going back, don't do the window scroll
      // let the browser take the user back to the position where they last were
      if (event.url == this._lastPoppedUrl) {
        this._lastPoppedUrl = undefined;
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  private initializeNavigationLoadingSpinner(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.spinnerModal.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.spinnerModal.loading = false;
      }
    });
  }

  /**
   * Register locales available to the angular system for
   * date, number, currency, etc translations.
   * NOTE: We currently only embed "en" and "es"
   */
  private registerLocales(): void {
    registerLocaleData(localeEs);
  }
}
