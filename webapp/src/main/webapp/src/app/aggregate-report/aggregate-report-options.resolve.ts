import { Observable } from "rxjs/Observable";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportOptionsService } from "./aggregate-report-options.service";

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class AggregateReportOptionsResolve implements Resolve<AggregateReportOptions> {

  constructor(private service: AggregateReportOptionsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AggregateReportOptions> {
    return this.service.getReportOptions();
  }

}
