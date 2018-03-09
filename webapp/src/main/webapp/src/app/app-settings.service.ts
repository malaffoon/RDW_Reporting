import { ApplicationSettings } from './app-settings';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CachingDataService } from './shared/data/caching-data.service';
import { map } from 'rxjs/operators';
import { ReportingServiceRoute } from './shared/service-route';

@Injectable()
export class ApplicationSettingsService {

  constructor(private dataService: CachingDataService) {
  }

  getSettings(): Observable<ApplicationSettings> {
    return this.dataService.get(`${ReportingServiceRoute}/settings`).pipe(
      map(serverSettings => <ApplicationSettings>{
        irisVendorId: serverSettings.irisVendorId,
        analyticsTrackingId: serverSettings.analyticsTrackingId,
        interpretiveGuideUrl: serverSettings.interpretiveGuideUrl,
        userGuideUrl: serverSettings.userGuideUrl,
        minItemDataYear: serverSettings.minItemDataYear,
        reportLanguages: serverSettings.reportLanguages,
        uiLanguages: serverSettings.uiLanguages,
        transferAccess: serverSettings.transferAccessEnabled,
        percentileDisplayEnabled: serverSettings.percentileDisplayEnabled
      })
    );
  }

}
