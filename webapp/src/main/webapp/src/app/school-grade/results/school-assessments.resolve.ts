import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SchoolAssessmentService } from "./school-assessment.service";

@Injectable()
export class SchoolAssessmentResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    // TODO: Check params to return most recent or custom.
    return this.service.getMostRecentAssessment(route.params[ "schoolId" ], route.params[ "gradeId" ])
      .toPromise()
      .then(value => {
        return value;
      })
  }

  constructor(private service: SchoolAssessmentService) {
  }
}
