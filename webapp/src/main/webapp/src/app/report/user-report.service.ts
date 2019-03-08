import { Inject, Injectable } from '@angular/core';
import {
  ClaimReportQuery,
  CustomAggregateReportQuery,
  DistrictSchoolExportReportQuery,
  GroupPrintableReportQuery,
  LongitudinalReportQuery,
  SchoolGradePrintableReportQuery,
  StudentPrintableReportQuery,
  TargetReportQuery,
  UserReport
} from './report';
import { DATA_CONTEXT_URL, DataService } from '../shared/data/data.service';
import { Observable } from 'rxjs';
import { ReportProcessorServiceRoute } from '../shared/service-route';
import { Headers } from '@angular/http';
import { catchError, map } from 'rxjs/operators';
import { ResponseUtils } from '../shared/response-utils';
import { toUserReport } from './reports';

function isNullOrEmpty(value: { length: number }): boolean {
  return value == null || value.length === 0;
}

const ServiceRoute = `${ReportProcessorServiceRoute}/reports`;

export type ServerReportQuery =
  | StudentPrintableReportQuery
  | GroupPrintableReportQuery
  | SchoolGradePrintableReportQuery
  | DistrictSchoolExportReportQuery
  | CustomAggregateReportQuery
  | LongitudinalReportQuery
  | ClaimReportQuery
  | TargetReportQuery;

@Injectable()
export class UserReportService {
  constructor(
    private dataService: DataService,
    @Inject(DATA_CONTEXT_URL) private contextUrl: string = '/api'
  ) {}

  getReports(ids?: number[]): Observable<UserReport[]> {
    const params = isNullOrEmpty(ids) ? {} : { id: ids };
    return this.dataService.get(ServiceRoute, { params }).pipe(
      map(serverReports => serverReports.map(toUserReport)),
      catchError(ResponseUtils.throwError)
    );
  }

  getReport(id: number): Observable<UserReport> {
    return this.getReports([id]).pipe(map(reports => reports[0]));
  }

  getReportContent(id: number): Observable<any> {
    return this.dataService
      .get(`${ServiceRoute}/${id}`, {
        headers: new Headers({
          Accept: 'application/json'
        })
      })
      .pipe(catchError(ResponseUtils.throwError));
  }

  createReport(query: ServerReportQuery): Observable<UserReport> {
    return this.dataService
      .post(ServiceRoute, query, {
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      .pipe(
        map(toUserReport),
        catchError(ResponseUtils.throwError)
      );
  }

  openReport(id: number): void {
    window.open(`${this.contextUrl}${ServiceRoute}/${id}`, '_blank');
  }

  deleteReport(id: number): Observable<void> {
    return this.dataService
      .delete(`${ServiceRoute}/${id}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
