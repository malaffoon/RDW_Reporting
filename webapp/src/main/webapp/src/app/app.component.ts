import { Component } from "@angular/core";
import { UserService } from "./user/user.service";
import { NavigationEnd, Router } from "@angular/router";
import { Location, PopStateEvent } from "@angular/common";
import { isNullOrUndefined } from "util";
import { User } from "./user/model/user.model";
import { LanguageStore } from "@sbac/rdw-reporting-common-ngx/i18n";

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {

  private _lastPoppedUrl: string;
  private _user: User;

  get user() {
    return this._user;
  }

  /*
   Even though the angulartics2GoogleAnalytics variable is not explicitly used, without it analytics data is not sent to the service
   */
  constructor(public languageStore: LanguageStore,
              private userService: UserService,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {

    this.userService.getCurrentUser().subscribe(user => {
      if (!isNullOrUndefined(user)) {

        this._user = user;

        this.languageStore.configuredLanguages = [ 'es', 'vi' ];

        if (window[ 'ga' ] && user.configuration && user.configuration.analyticsTrackingId) {
          window[ 'ga' ]('create', user.configuration.analyticsTrackingId, 'auto');
        }

      } else {
        this.router.navigate([ 'error' ]);
      }
    });


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

}
