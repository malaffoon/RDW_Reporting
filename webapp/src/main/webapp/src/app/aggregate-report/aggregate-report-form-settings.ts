import { CodedEntity } from "./aggregate-report-options";
import { District, School } from "../shared/organization/organization";

/**
 * Client side representation of a report request.
 * This object must be mapped into a format that the server supports
 */
export interface AggregateReportFormSettings {

  /**
   * The achievement level graph display type
   */
  readonly achievementLevelDisplayType: string;

  /**
   * Assessment grades to be covered on the report
   */
  readonly assessmentGrades: CodedEntity[];

  /**
   * Assessment type of the report
   */
  readonly assessmentType: CodedEntity;

  /**
   * Completeness result filter
   */
  readonly completenesses: CodedEntity[];

  /**
   * Economic disadvantage result filter
   */
  readonly economicDisadvantages: any[];

  /**
   * Race / Ethnicity result filter
   */
  readonly ethnicities: CodedEntity[];

  /**
   * The comparative subgroups to compare on the report
   */
  readonly dimensionTypes: string[];

  /**
   * Gender result filter
   */
  readonly genders: CodedEntity[];

  /**
   * IEP result filter
   */
  readonly ieps: any[];

  /**
   * Interim administration condition result filter
   */
  readonly interimAdministrationConditions: CodedEntity[];

  /**
   * English learners result filter
   */
  readonly limitedEnglishProficiencies: any[];

  /**
   * Migrant status result filter
   */
  readonly migrantStatuses: any[];

  /**
   * Plan 504 result filter
   */
  readonly plan504s: any[];

  /**
   * The school years to be covered on the report
   */
  readonly schoolYears: number[];

  /**
   * Subject result filter
   */
  readonly subjects: CodedEntity[];

  /**
   * Summative administration conditions result filter
   */
  readonly summativeAdministrationConditions: CodedEntity[];

  /**
   * Determines if values are displayed as percent or number in the report
   */
  readonly valueDisplayType: string;

  /**
   * Determines if state results will be included in the report
   */
  readonly includeStateResults: boolean;

  /**
   * Determines if all districts of the state should appear in the report
   */
  readonly includeAllDistricts: boolean;

  /**
   * Determines if the schools of each selected district should appear in the report
   */
  readonly includeAllSchoolsOfSelectedDistricts: boolean;

  /**
   * Determines if the district of each selected schools should appear in the report
   */
  readonly includeAllDistrictsOfSelectedSchools: boolean;

  /**
   * The districts selected for the report
   */
  readonly districts: District[];

  /**
   * The schools selected for the report
   */
  readonly schools: School[];

}
