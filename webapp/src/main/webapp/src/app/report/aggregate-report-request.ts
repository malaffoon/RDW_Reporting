/**
 * Represents an aggregate report request
 */
export interface AggregateReportRequest {
  readonly achievementLevelDisplayType: string;
  readonly administrationConditionCodes: string[];
  readonly assessmentGradeCodes: string[];
  readonly assessmentTypeCode: string;
  readonly completenessCodes: string[];
  readonly economicDisadvantageCodes: string[];
  readonly ethnicityCodes: string[];
  readonly dimensionTypes: string[];
  readonly districtCodes: string[];
  readonly genderCodes: string[];
  readonly iepCodes: string[];
  readonly includeAllDistricts: boolean;
  readonly includeAllDistrictsOfSchools: boolean;
  readonly includeAllSchoolsOfDistricts: boolean;
  readonly includeState: boolean;
  readonly lepCodes: string[];
  readonly migrantStatusCodes: string[];
  readonly section504Codes: string[];
  readonly schoolCodes: string[];
  readonly schoolYears: number[];
  readonly subjectCodes: string[];
  readonly valueDisplayType: string;
}
