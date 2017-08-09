import { Observable } from "rxjs";
import { RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { ReportService } from "./report.service";
import { Report } from "./report.model";
import { ResponseUtils } from "../shared/response-utils";

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class ReportsResolve implements Resolve<Report[]> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Report[]> {
    return this.service.getReports()
      .catch(ResponseUtils.toNull);
  }

  constructor(private service: ReportService) {
  }

}
