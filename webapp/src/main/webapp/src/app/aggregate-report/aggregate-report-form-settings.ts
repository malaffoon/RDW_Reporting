import { CodedEntity } from "./aggregate-report-options";

/**
 * Client side representation of a report request.
 * This object must be mapped into a format that the server supports
 */
export interface AggregateReportFormSettings {

  assessmentType: CodedEntity;
  subjects: CodedEntity[];
  schoolYears: number[];
  assessmentGrades: CodedEntity[];
  completenesses: CodedEntity[];
  interimAdministrationConditions: CodedEntity[];
  summativeAdministrationConditions: CodedEntity[];
  genders: CodedEntity[];
  ethnicities: CodedEntity[];
  migrantStatuses: any[];
  ieps: any[];
  plan504s: any[];
  limitedEnglishProficiencies: any[];
  economicDisadvantages: any[];
  achievementLevelDisplayType: string;
  valueDisplayType: string;
  dimensionTypes: string[];

}
