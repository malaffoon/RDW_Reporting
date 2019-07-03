import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  applicationSettings$: Observable<ApplicationSettings> = of({});

  constructor(private applicationSettingsService: ApplicationSettingsService) {
    // this.applicationSettings$ = this.applicationSettingsService.getSettings();
  }
}
