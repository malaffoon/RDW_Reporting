import { Observable } from "rxjs/Observable";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { AggregateReportOptionsService } from "./aggregate-report-options.service";
import { AggregateReportOptions } from "./aggregate-report-options";


// Used to hotfix natural order of completeness and strict booleans not being in "affirmative-first" order
const IdDescending = (a, b) => b.id - a.id;

/**
 * This resolver is responsible for fetching assessment items for a student and exam.
 */
@Injectable()
export class AggregateReportOptionsResolve implements Resolve<AggregateReportOptions> {

  constructor(private service: AggregateReportOptionsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AggregateReportOptions> {
    return this.service.getReportOptions().map(options => <AggregateReportOptions>{
      assessmentGrades: options.assessmentGrades,
      assessmentTypes: options.assessmentTypes,
      completenesses: options.completenesses.sort(IdDescending),
      dimensionTypes: options.dimensionTypes,
      economicDisadvantages: options.economicDisadvantages.sort(IdDescending),
      ethnicities: options.ethnicities,
      genders: options.genders,
      individualEducationPlans: options.individualEducationPlans.sort(IdDescending),
      interimAdministrationConditions: options.interimAdministrationConditions,
      limitedEnglishProficiencies: options.limitedEnglishProficiencies.sort(IdDescending),
      migrantStatuses: options.migrantStatuses.sort(IdDescending),
      section504s: options.section504s.sort(IdDescending),
      schoolYears: options.schoolYears,
      statewideReporter: options.statewideReporter,
      subjects: options.subjects,
      summativeAdministrationConditions: options.summativeAdministrationConditions
    });
  }

}
