import { UserReport } from './report';

export function toUserReport(serverReport: any): UserReport {
  return {
    ...serverReport,
    metadata: serverReport.metadata || {}
  }
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
