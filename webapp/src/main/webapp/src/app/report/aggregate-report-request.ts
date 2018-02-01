/**
 * Represents an aggregate report request
 */
export interface AggregateReportRequest {
  readonly achievementLevelDisplayType: string;
  readonly administrationConditionIds: number[];
  readonly assessmentGradeIds: number[];
  readonly assessmentTypeId: number;
  readonly completenessIds: number[];
  readonly economicDisadvantageIds: number[];
  readonly ethnicityIds: number[];
  readonly dimensionTypes: string[];
  readonly districtIds: number[];
  readonly genderIds: number[];
  readonly iepIds: number[];
  readonly includeAllDistricts: boolean;
  readonly includeAllDistrictsOfSchools: boolean;
  readonly includeAllSchoolsOfDistricts: boolean;
  readonly includeState: boolean;
  readonly lepIds: number[];
  readonly migrantStatusIds: number[];
  readonly section504Ids: number[];
  readonly schoolIds: number[];
  readonly schoolYears: number[];
  readonly subjectIds: number[];
  readonly valueDisplayType: string;
}
