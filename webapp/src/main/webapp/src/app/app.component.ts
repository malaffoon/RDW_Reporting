///<reference path="../../node_modules/@angular/router/src/events.d.ts"/>
import { Component, ViewChild } from "@angular/core";
import { UserService } from "./user/user.service";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { Location, PopStateEvent } from "@angular/common";
import { User } from "./user/user";
import { LanguageStore } from "./shared/i18n/language.store";
import { Utils } from "./shared/support/support";
import { SpinnerModal } from "./shared/loading/spinner.modal";
import { ApplicationSettings } from './app-settings';
import { ApplicationSettingsService } from './app-settings.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  private _lastPoppedUrl: string;

  user: User;
  applicationSettings: ApplicationSettings;

  /*
   Even though the angulartics2GoogleAnalytics variable is not explicitly used, without it analytics data is not sent to the service
   */
  constructor(public languageStore: LanguageStore,
              private router: Router,
              private location: Location,
              private userService: UserService,
              private applicationSettingsService: ApplicationSettingsService) {

    forkJoin(
      this.userService.getUser(),
      this.applicationSettingsService.getSettings()
    ).subscribe(([ user, settings ]) => {

      if (Utils.isNullOrUndefined(user)
        || Utils.isNullOrUndefined(settings)) {

        this.router.navigate([ 'error' ]);

      } else {

        this.user = user;
        this.applicationSettings = settings;

        this.languageStore.configuredLanguages = settings.uiLanguages;
        this.initializeAnalytics(settings.analyticsTrackingId);
      }
    })
  }

  ngOnInit() {
    this.initializeNavigationScrollReset();
    this.initializeNavigationLoadingSpinner();
  }

  private initializeAnalytics(trackingId: string): void {
    const googleAnalyticsProvider: Function = window[ 'ga' ];
    if (googleAnalyticsProvider && trackingId) {
      googleAnalyticsProvider('create', trackingId, 'auto');
    }
  }

  private initializeNavigationScrollReset(): void {

    // by listening to the PopStateEvent we can track the back button
    this.location.subscribe((event: PopStateEvent) => {
      this._lastPoppedUrl = event.url;
    });

    this.router.events.subscribe((event) => {
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
      } else if (event instanceof NavigationEnd
        || event instanceof NavigationCancel
        || event instanceof NavigationError) {
        this.spinnerModal.loading = false;
      }
    })
  }

}
