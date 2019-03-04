export interface UserReport<T extends ReportQuery = ReportQuery> {
  id: number;
  query: T;
  status: ReportStatus;
  created: Date;
  metadata?: { [ key: string ]: string };
}

export interface UserQuery<T extends ReportQuery = ReportQuery> {
  id: number;
  query: T;
  updated: Date;
  created: Date;
}

export type ReportStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'NO_RESULTS'
  | 'FAILED';

export type ReportQueryType =
  | 'Student'
  | 'Group'
  | 'SchoolGrade'
  | 'DistrictSchoolExport'
  | 'CustomAggregate'
  | 'Longitudinal'
  | 'Claim'
  | 'Target';

interface BaseStudentFilters {
  ethnicityCodes?: string[];
  genderCodes?: string[];
  individualEducationPlanCodes?: string[];
  limitedEnglishProficiencyCodes?: string[];
  englishLanguageAcquisitionStatusCodes?: string[];
  migrantStatusCodes?: string[];
  section504Codes?: string[];
  languageCodes?: string[];
  militaryConnectedCodes?: string[];
}

export interface SingleStudentPrintableReportFilters {
  offGradeAssessments: boolean;
  completenessCodes: string[];
  administrativeConditionCodes: string[];
}

export interface MultiStudentPrintableReportFilters
  extends SingleStudentPrintableReportFilters, BaseStudentFilters {

}

export interface AggregateReportStudentFilters extends BaseStudentFilters {
  economicDisadvantageCodes?: string[];
}

export interface ReportQuery {
  name: string;
  type: ReportQueryType;
}

export interface ExamReportQuery extends ReportQuery {
  schoolYear: number;
  disableTransferAccess: boolean;
}

export interface PrintableReportQuery extends ExamReportQuery {
  // TODO make arrays
  subjectCode: string;
  assessmentTypeCode: string;
  language: string;
  accommodationsVisible: boolean;
}

export interface BatchPrintableReportQuery extends PrintableReportQuery {
  order: PrintableReportOrder;
}

export type PrintableReportOrder =
  | 'StudentName'
  | 'StudentSSID';

export interface StudentPrintableReportQuery extends PrintableReportQuery {
  studentId: number;
  // filters: SingleStudentPrintableReportFilters;
}

export type UserGroupType = 'Admin' | 'Teacher';

export interface UserGroupId {
  id: number;
  type: UserGroupType;
}

export interface GroupPrintableReportQuery extends BatchPrintableReportQuery {
  groupId: UserGroupId;
  // filters: MultiStudentPrintableReportFilters;
}

export interface SchoolGradePrintableReportQuery extends BatchPrintableReportQuery {
  schoolId: number;
  gradeId: number;
  // filters: MultiStudentPrintableReportFilters;
}

export interface DistrictSchoolExportReportQuery extends ExamReportQuery {
  schoolIds?: number[];
  schoolGroupIds?: number[];
  districtIds?: number[];
  districtGroupIds?: number[];
}

export interface AggregateReportQuery extends ReportQuery {
  administrativeConditionCodes?: string[];
  assessmentGradeCodes: string[];
  assessmentTypeCode: string;
  completenessCodes?: string[];
  dimensionTypes?: string[];
  includeAllDistricts: boolean;
  includeAllDistrictsOfSchools: boolean;
  includeAllSchoolsOfDistricts: boolean;
  includeState: boolean;
  showEmpty: boolean;
  columnOrder?: string[];
  studentFilters?: AggregateReportStudentFilters;
  schoolIds?: number[];
  districtIds?: number[];

  // not used by target reports
  subjectCodes?: string[];
  achievementLevelDisplayType: string;
  valueDisplayType: string;
  subgroups?: { [ key: string ]: AggregateReportStudentFilters };
}

export interface CustomAggregateReportQuery extends AggregateReportQuery {
  schoolYears?: number[];
}

export interface LongitudinalReportQuery extends AggregateReportQuery {
  toSchoolYear?: number;
}

export interface ClaimReportQuery extends AggregateReportQuery {
  schoolYears?: number[];
  claimCodesBySubject?: any;
}

export interface TargetReportQuery extends AggregateReportQuery {
  schoolYear?: number;
  subjectCode?: string;
}

export type AggregateReportQueryType = CustomAggregateReportQuery | LongitudinalReportQuery | ClaimReportQuery | TargetReportQuery;

