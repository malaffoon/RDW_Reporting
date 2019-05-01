import { Organization } from '../shared/organization/organization';
import { Claim, Subject } from './aggregate-report-options.service';
import { ReportQueryType } from '../report/report';
import { SubgroupFilterOptions } from './subgroup/subgroup-filter-options';

/**
 * Represents the aggregate report options as provided by the API
 */
export interface AggregateReportOptions {
  readonly assessmentGrades: string[];
  readonly assessmentTypes: string[];
  readonly claims: Claim[];
  readonly completenesses: string[];
  readonly defaultOrganization?: Organization;
  readonly dimensionTypes?: string[];
  readonly interimAdministrationConditions: string[];
  readonly queryTypes: string[];
  readonly reportTypes: ReportQueryType[];
  readonly schoolYears: number[];
  readonly statewideReporter: boolean;
  readonly subjects: Subject[];
  readonly summativeAdministrationConditions: string[];
  readonly studentFilters: SubgroupFilterOptions;
}
