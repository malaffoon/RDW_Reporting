import { Component } from '@angular/core';
import { ApplicationSettingsService } from '../../../app-settings.service';
import { ApplicationSettings } from '../../../app-settings';
import { Observable } from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  applicationSettings$: Observable<ApplicationSettings>;

  constructor(private applicationSettingsService: ApplicationSettingsService) {
    this.applicationSettings$ = this.applicationSettingsService.getSettings();
  }
}
