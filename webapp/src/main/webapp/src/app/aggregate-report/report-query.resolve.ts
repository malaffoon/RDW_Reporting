import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { ReportQuery } from '../report/report';
import { UserQueryService } from '../report/user-query.service';
import { getQueryFromRouteQueryParameters } from '../report/report-services';
import { UserReportService } from '../report/user-report.service';

/**
 * This resolver is responsible for fetching an aggregate report based upon
 * an optional report id query parameter.
 */
@Injectable()
export class ReportQueryResolve implements Resolve<ReportQuery> {
  constructor(
    private userReportService: UserReportService,
    private userQueryService: UserQueryService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ReportQuery> {
    return getQueryFromRouteQueryParameters<ReportQuery>(
      route.queryParams,
      this.userReportService,
      this.userQueryService
    );
  }
}
