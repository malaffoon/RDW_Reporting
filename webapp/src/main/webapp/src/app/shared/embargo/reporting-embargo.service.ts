import { Injectable } from '@angular/core';
import { CachingDataService } from '../data/caching-data.service';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { ReportingServiceRoute } from '../service-route';
import { Embargo } from './embargo';
import { ApplicationSettingsService } from '../../app-settings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { UserService } from '../security/service/user.service';

@Injectable()
export class ReportingEmbargoService {
  constructor(
    private dataService: CachingDataService,
    private userService: UserService,
    private settingsService: ApplicationSettingsService
  ) {}

  /**
   * Gets user organization exam embargo status
   */
  isEmbargoed(): Observable<boolean> {
    return this.userHasEmbargoReadAccess().pipe(
      flatMap(hasEmbargoRead =>
        hasEmbargoRead ? this.getEmbargoEnabled() : of(false)
      )
    );
  }

  /**
   * Gets the current embargo settings
   */
  getEmbargo(): Observable<Embargo> {
    return this.userHasEmbargoReadAccess().pipe(
      flatMap(hasEmbargoRead =>
        hasEmbargoRead ? this.getEmbargoInternal() : of({})
      )
    );
  }

  private userHasEmbargoReadAccess(): Observable<boolean> {
    return this.userService
      .getUser()
      .pipe(map(({ permissions }) => permissions.includes('EMBARGO_READ')));
  }

  private getEmbargoEnabled(): Observable<boolean> {
    return this.dataService
      .get(`${ReportingServiceRoute}/organizations/embargoed`)
      .pipe(catchError(() => of(false)));
  }

  private getEmbargoInternal(): Observable<Embargo> {
    return forkJoin(
      this.getEmbargoEnabled(),
      this.settingsService
        .getSettings()
        .pipe(map(({ schoolYear }) => schoolYear))
    ).pipe(
      map(([enabled, schoolYear]) => ({
        enabled,
        schoolYear
      }))
    );
  }
}
