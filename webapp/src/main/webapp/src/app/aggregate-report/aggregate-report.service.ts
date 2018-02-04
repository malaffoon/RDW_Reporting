import { Injectable } from "@angular/core";
import { DataService } from "../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { AggregateServiceRoute } from "../shared/service-route";
import { ReportService } from "../report/report.service";
import { Report } from "../report/report.model";
import { AggregateReportRequest } from "../report/aggregate-report-request";
import { MockAggregateReportsPreviewService } from "./results/mock-aggregate-reports-preview.service";
import { AggregateReportRow } from "../report/aggregate-report";

/**
 * Responsible for interfacing with aggregate report server
 */
@Injectable()
export class AggregateReportService {

  constructor(private dataService: DataService,
              private reportService: ReportService) {
  }

  /**
   * Gets the estimated report row count for the provided report request
   *
   * @param {AggregateReportRequest} request the report parameters
   * @returns {Observable<number>} the row count
   */
  getReportRowCount(request: AggregateReportRequest): Observable<number> {
    // return this.dataService.post(`${AggregateServiceRoute}/aggregate/rowCount`, request);
    return Observable.of(1);
  }

  /**
   * Creates an aggregate report
   *
   * @param {AggregateReportRequest} request the report parameters
   * @returns {Observable<Report>} the report resource handle
   */
  createReport(request: AggregateReportRequest): Observable<Report> {
    // return this.reportService.createAggregateReport(request);
    return Observable.of(this.report('PENDING'));
  }

  getReportById(id: number): Observable<Report> {
    // return this.reportService.getReportById(id);
    return Observable.of(this.report('COMPLETED'));
  }

  private report(status: string): Report {
    const report = new Report();
    report.id = 1;
    report.label = 'My Aggregate Report';
    report.status = status;
    report.request = {
      assessmentTypeCode: 'ica'
    };
    report.metadata = {
      row_count: '1'
    };
    return report;
  }

}
