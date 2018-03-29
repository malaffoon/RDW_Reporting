import { Organization } from "../shared/organization/organization";
import { SubgroupFilterOptions } from "./subgroup-filter-options";

/**
 * Represents the aggregate report options as provided by the API
 */
export interface AggregateReportOptions extends SubgroupFilterOptions {

  readonly assessmentGrades: string[];
  readonly assessmentTypes: string[];
  readonly completenesses: string[];
  readonly defaultOrganization?: Organization;
  readonly dimensionTypes?: string[];
  readonly interimAdministrationConditions: string[];
  readonly schoolYears: number[];
  readonly statewideReporter: boolean;
  readonly subjects: string[];
  readonly summativeAdministrationConditions: string[];

}
