import { ApplicationSettings } from './app-settings';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CachingDataService } from './shared/data/caching-data.service';
import { catchError, map } from 'rxjs/operators';
import { isNullOrEmpty } from './shared/support/support';

const EmptySettings = of(<any>{});
const DefaultReportLanguages = ['en'];

@Injectable()
export class ApplicationSettingsService {
  constructor(private dataService: CachingDataService) {}

  getSettings(): Observable<ApplicationSettings> {
    return this.dataService.get('/settings').pipe(
      map(
        serverSettings =>
          <ApplicationSettings>{
            analyticsTrackingId: serverSettings.analyticsTrackingId,
            elasEnabled: serverSettings.englishLanguageAcquisitionStatusEnabled,
            interpretiveGuideUrl: serverSettings.interpretiveGuideUrl,
            accessDeniedUrl: serverSettings.accessDeniedUrl.startsWith(
              'redirect:'
            )
              ? serverSettings.accessDeniedUrl.substring(9)
              : undefined,
            irisVendorId: serverSettings.irisVendorId,
            lepEnabled: serverSettings.limitedEnglishProficienciesEnabled,
            minItemDataYear: serverSettings.minItemDataYear,
            percentileDisplayEnabled: serverSettings.percentileDisplayEnabled,
            reportLanguages: isNullOrEmpty(serverSettings.reportLanguages)
              ? DefaultReportLanguages
              : serverSettings.reportLanguages,
            state: {
              code: serverSettings.state.code,
              name: serverSettings.state.name
            },
            targetReport: {
              insufficientDataCutoff:
                serverSettings.targetReport.insufficientDataCutoff,
              minimumStudentCount:
                serverSettings.targetReport.minNumberOfStudents
            },
            transferAccess: serverSettings.transferAccessEnabled,
            uiLanguages: serverSettings.uiLanguages,
            userGuideUrl: serverSettings.userGuideUrl
          }
      ),
      catchError(() => EmptySettings)
    );
  }
}
