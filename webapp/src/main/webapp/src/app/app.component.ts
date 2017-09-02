import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "./user/user.service";
import { User } from "./user/model/user.model";

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public userHasAccess:boolean = undefined;

  private _user: User;

  get user(): User {
    return this._user;
  }

  /*
  Even though the angulartics2GoogleAnalytics variable is not explicitly used, without it analytics data is not sent to the service
   */
  constructor(public translate: TranslateService, private _userService: UserService,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {

    let languages = [ 'en', 'ja' ];
    let defaultLanguage = languages[ 0 ];
    translate.addLangs(languages);
    translate.setDefaultLang(defaultLanguage);
    translate.use(languages.indexOf(translate.getBrowserLang()) != -1 ? translate.getBrowserLang() : defaultLanguage);

  }

  ngOnInit() {
    this._userService.getCurrentUser().subscribe(user => {

      this._user = user;

      this.userHasAccess = user.permissions.some(permission => permission == "GROUP_WRITE");

      if (window['ga'] && user.configuration && user.configuration.analyticsTrackingId) {
        window['ga']('create', user.configuration.analyticsTrackingId, 'auto');
      }
    });
  }
}
