import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { AggregateReportOptionsMapper } from './aggregate-report-options.mapper';
import { AggregateReportRequestMapper } from './aggregate-report-request.mapper';
import { Utils } from '../shared/support/support';
import { flatMap, map } from 'rxjs/operators';
import { AggregateReportQueryType } from '../report/report';
import { UserQueryService } from '../report/user-query.service';
import { getQueryFromRouteQueryParameters } from '../report/reports';
import { UserReportService } from '../report/user-report.service';

/**
 * This resolver is responsible for fetching an aggregate report based upon
 * an optional report id query parameter.
 */
@Injectable()
export class AggregateReportFormSettingsResolve
  implements Resolve<AggregateReportFormSettings> {
  constructor(
    private userReportService: UserReportService,
    private userQueryService: UserQueryService,
    private optionMapper: AggregateReportOptionsMapper,
    private requestMapper: AggregateReportRequestMapper
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<AggregateReportFormSettings> {
    const { options } = route.parent.data;
    return getQueryFromRouteQueryParameters<AggregateReportQueryType>(
      route.queryParams,
      this.userReportService,
      this.userQueryService
    ).pipe(
      flatMap(query =>
        query != null
          ? this.requestMapper.toSettings(query, options).pipe(
              map(settings => ({
                ...settings,
                name:
                  route.queryParams.userReportId != null
                    ? Utils.appendOrIncrementFileNameSuffix(
                        (<any>settings).name
                      )
                    : settings.name
              }))
            )
          : this.optionMapper.toDefaultSettings(options)
      )
    );
  }
}
