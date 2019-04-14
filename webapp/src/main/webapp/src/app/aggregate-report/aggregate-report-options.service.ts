import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AggregateReportOptions } from './aggregate-report-options';
import { CachingDataService } from '../shared/data/caching-data.service';
import { OrganizationMapper } from '../shared/organization/organization.mapper';
import { map } from 'rxjs/operators';
import { AggregateServiceRoute } from '../shared/service-route';
import {
  AssessmentTypeOrdering,
  BooleanOrdering,
  CompletenessOrdering
} from '../shared/ordering/orderings';

const ServiceRoute = AggregateServiceRoute;
const assessmentTypeComparator = AssessmentTypeOrdering.compare;
const booleanComparator = BooleanOrdering.compare;
const completenessComparator = CompletenessOrdering.compare;

function toSubject(serverSubject: any): Subject {
  return serverSubject;
}

function toClaim(serverClaim: any): Claim {
  return {
    assessmentType: serverClaim.assessmentTypeCode,
    subject: serverClaim.subjectCode,
    code: serverClaim.code
  };
}

/**
 * Service responsible for gathering aggregate report options from the server
 */
@Injectable()
export class AggregateReportOptionsService {
  constructor(
    private dataService: CachingDataService,
    private organizationMapper: OrganizationMapper
  ) {}

  getReportOptions(): Observable<AggregateReportOptions> {
    return this.dataService.get(`${ServiceRoute}/reportOptions`).pipe(
      map(
        serverOptions =>
          <AggregateReportOptions>{
            assessmentGrades: serverOptions.assessmentGrades.concat(),
            assessmentTypes: serverOptions.assessmentTypes
              .concat()
              .sort(assessmentTypeComparator),
            claims: serverOptions.claims.map(toClaim),
            completenesses: serverOptions.completenesses
              .concat()
              .sort(completenessComparator),
            defaultOrganization: serverOptions.defaultOrganization
              ? this.organizationMapper.map(serverOptions.defaultOrganization)
              : undefined,
            dimensionTypes: serverOptions.dimensionTypes.concat(),
            interimAdministrationConditions: serverOptions.interimAdministrationConditions.concat(),
            queryTypes: ['Basic', 'FilteredSubgroup'],
            reportTypes: serverOptions.assessmentTypes.some(x => x == 'sum')
              ? ['CustomAggregate', 'Longitudinal', 'Claim', 'Target']
              : ['CustomAggregate', 'Claim'],
            schoolYears: serverOptions.schoolYears.concat(),
            statewideReporter: serverOptions.statewideReporter,
            subjects: serverOptions.subjects.map(toSubject),
            summativeAdministrationConditions: serverOptions.summativeAdministrationConditions.concat(),
            studentFilters: {
              economicDisadvantages: serverOptions.economicDisadvantages
                .concat()
                .sort(booleanComparator),
              ethnicities: serverOptions.ethnicities.concat(),
              genders: serverOptions.genders.concat(),
              individualEducationPlans: serverOptions.individualEducationPlans
                .concat()
                .sort(booleanComparator),
              limitedEnglishProficiencies: serverOptions.limitedEnglishProficiencies
                .concat()
                .sort(booleanComparator),
              englishLanguageAcquisitionStatuses: serverOptions.englishLanguageAcquisitionStatuses.concat(),
              migrantStatuses: serverOptions.migrantStatuses
                .concat()
                .sort(booleanComparator),
              section504s: serverOptions.section504s
                .concat()
                .sort(booleanComparator),
              languages: serverOptions.languages.concat(),
              militaryConnectedCodes: serverOptions.militaryConnectedCodes.concat()
            }
          }
      )
    );
  }
}

export interface Claim {
  readonly assessmentType: string;
  readonly subject: string;
  readonly code: string;
}

export interface Subject {
  readonly code: string;
  readonly assessmentType: string;
  readonly targetReport?: boolean;
}
