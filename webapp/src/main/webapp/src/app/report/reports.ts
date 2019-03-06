import {
  ClaimReportQuery,
  CustomAggregateReportQuery,
  ExamReportQuery,
  LongitudinalReportQuery,
  PrintableReportQuery,
  ReportQuery,
  TargetReportQuery,
  UserReport
} from './report';

export function toUserReport(serverReport: any): UserReport {
  return {
    ...serverReport,
    metadata: serverReport.metadata || {}
  };
}

const AggregateReportQueryTypes = [
  'CustomAggregate',
  'Longitudinal',
  'Claim',
  'Target'
];

export function isAggregateReportQueryType(type: string) {
  return AggregateReportQueryTypes.includes(type);
}

/**
 * Normalizes subject codes from each query type into an array for display
 *
 * @param query The query to search for subject codes
 */
export function getSubjectCodes(query: ReportQuery): string[] {
  let subjectCodes = [];
  switch (query.type) {
    case 'Student':
    case 'Group':
    case 'SchoolGrade':
    case 'Target':
      subjectCodes = [
        (<PrintableReportQuery | TargetReportQuery>query).subjectCode
      ];
      break;
    case 'CustomAggregate':
    case 'Longitudinal':
    case 'Claim':
      subjectCodes = (<
        CustomAggregateReportQuery | LongitudinalReportQuery | ClaimReportQuery
      >query).subjectCodes;
      break;
  }
  return subjectCodes.filter(value => value != null);
}

/**
 * Normalizes school years from each query type into an array for display
 *
 * @param query The query to search for school years
 */
export function getSchoolYears(query: ReportQuery): number[] {
  switch (query.type) {
    case 'Student':
    case 'Group':
    case 'SchoolGrade':
    case 'DistrictSchoolExport':
    case 'Target':
      return [
        (<PrintableReportQuery | ExamReportQuery | TargetReportQuery>query)
          .schoolYear
      ];
    case 'CustomAggregate':
    case 'Claim':
      return (<CustomAggregateReportQuery | ClaimReportQuery>query).schoolYears;
    case 'Longitudinal':
      return [(<LongitudinalReportQuery>query).toSchoolYear];
    default:
      return [];
  }
}
