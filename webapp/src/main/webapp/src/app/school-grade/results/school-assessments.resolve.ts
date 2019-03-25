import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { SchoolAssessmentService } from './school-assessment.service';
import { AssessmentExam } from '../../assessments/model/assessment-exam.model';
import { Utils } from '../../shared/support/support';

@Injectable()
export class SchoolAssessmentResolve implements Resolve<AssessmentExam> {

  constructor(private service: SchoolAssessmentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssessmentExam> {
    const { schoolId, gradeId, schoolYear } = route.params;
    if (Utils.isNullOrUndefined(schoolYear)
      || Utils.isNullOrUndefined(schoolId)
      || Utils.isNullOrUndefined(gradeId)) {
      return empty();
    }
    return this.service.getMostRecentAssessment(schoolId, gradeId, schoolYear);
  }

}
