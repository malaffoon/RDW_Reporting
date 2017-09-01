import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { GroupAssessmentService } from "./group-assessment.service";

@Injectable()
export class GroupAssessmentsResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getMostRecentAssessment(route.params[ "groupId" ], route.params[ "schoolYear" ])
      .delay(new Date(Date.now() + 4000));
  }

  constructor(private service: GroupAssessmentService) {
  }
}
