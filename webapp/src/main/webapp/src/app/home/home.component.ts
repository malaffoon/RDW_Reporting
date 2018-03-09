import { Component } from "@angular/core";
import { User } from "../user/user";
import { ApplicationSettings } from '../app-settings';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserService } from '../user/user.service';
import { ApplicationSettingsService } from '../app-settings.service';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  host: {
    'class': 'home-view'
  }
})
export class HomeComponent {

  user: User;
  applicationSettings: ApplicationSettings;

  constructor(userService: UserService,
              applicationSettingsService: ApplicationSettingsService) {

    forkJoin(
      userService.getUser(),
      applicationSettingsService.getSettings()
    ).subscribe(([user, settings]) => {
      this.user = user;
      this.applicationSettings = settings;
    });
  }

}
