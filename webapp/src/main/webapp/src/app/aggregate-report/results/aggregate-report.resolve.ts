import { Observable } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AggregateReportService } from '../aggregate-report.service';
import { UserReport } from '../../report/report';

/**
 * This resolver is responsible for fetching an aggregate report based upon a report id path parameter
 */
@Injectable()
export class AggregateReportResolve implements Resolve<UserReport> {
  constructor(private service: AggregateReportService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserReport> {
    const reportId = Number.parseInt(route.params['id']);
    return this.service.getReportById(reportId);
  }
}
