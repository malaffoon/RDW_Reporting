import { ApplicationSettings, toApplicationSettings } from './app-settings';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CachingDataService } from './shared/data/caching-data.service';
import { catchError, map } from 'rxjs/operators';

const EmptySettings = of(<any>{});

@Injectable({
  providedIn: 'root'
})
export class ApplicationSettingsService {
  constructor(private dataService: CachingDataService) {}

  getSettings(): Observable<ApplicationSettings> {
    return this.dataService.get('/settings').pipe(
      map(serverSettings => toApplicationSettings(serverSettings)),
      catchError(() => EmptySettings)
    );
  }
}
