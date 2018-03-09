import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "../user/user";
import { ApplicationSettings } from '../app-settings';

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

  constructor(route: ActivatedRoute) {
    const { user, applicationSettings } = route.snapshot.data;
    this.user = user;
    this.applicationSettings = applicationSettings;
  }

}
