import { Observable } from "rxjs";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { UserReportService } from "./user-report.service";
import { UserReport } from "./report";
import { Resolution } from "../shared/resolution.model";
import { catchError, map } from 'rxjs/operators';

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class ReportsResolve implements Resolve<Resolution<UserReport[]>> {

  constructor(private service: UserReportService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Resolution<UserReport[]>> {
    return this.service.getReports()
      .pipe(
        map(Resolution.ok),
        catchError(Resolution.errorObservable)
      );
  }

}
