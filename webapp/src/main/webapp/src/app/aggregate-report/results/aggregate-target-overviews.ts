import { AggregateReportItem } from './aggregate-report-item';
import { AggregateTargetOverview } from './aggregate-target-overview';

export function createTargetOverview(item: AggregateReportItem): AggregateTargetOverview {
  return {
    averageScaleScore: item.avgScaleScore,
    averageStandardError: item.avgStdErr,
    studentsTested: item.studentsTested
  };
}
