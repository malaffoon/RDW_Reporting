import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SchoolAssessmentService } from "./school-assessment.service";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";

@Injectable()
export class SchoolAssessmentResolve implements Resolve<AssessmentExam> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssessmentExam>|Promise<AssessmentExam>|AssessmentExam {
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
