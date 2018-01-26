import { CodedEntity } from "./aggregate-report-options";

/**
 * Client side representation of a report request.
 * This object must be mapped into a format that the server supports
 */
export interface AggregateReportFormSettings {

  achievementLevelDisplayType: string;
  assessmentGrades: CodedEntity[];
  assessmentType: CodedEntity;
  completenesses: CodedEntity[];
  economicDisadvantages: any[];
  ethnicities: CodedEntity[];
  dimensionTypes: string[];
  genders: CodedEntity[];
  ieps: any[];
  interimAdministrationConditions: CodedEntity[];
  limitedEnglishProficiencies: any[];
  migrantStatuses: any[];
  plan504s: any[];
  schoolYears: number[];
  subjects: CodedEntity[];
  summativeAdministrationConditions: CodedEntity[];
  valueDisplayType: string;

}
