import { Injectable } from "@angular/core";
import { DataService } from "../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { AggregateServiceRoute } from "../shared/service-route";
import { ReportService } from "../report/report.service";
import { Report } from "../report/report.model";
import { AggregateReportRequest } from "../report/aggregate-report-request";

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
    return this.dataService.post(`${AggregateServiceRoute}/aggregate/rowCount`, request);
  }

  /**
   * Creates an aggregate report
   *
   * @param {AggregateReportRequest} request the report parameters
   * @returns {Observable<Report>} the report resource handle
   */
  createReport(request: AggregateReportRequest): Observable<Report> {
    return this.reportService.createAggregateReport(request);
  }

  /**
   * Gets a single aggregate report by ID
   *
   * @param {number} id the report ID
   * @returns {Observable<Report>} the report resource handle
   */
  getReportById(id: number): Observable<Report> {
    return this.reportService.getReportById(id);
  }

}
