import { ranking } from '@kourge/ordering/comparator';
import { Subgroup } from '../../shared/model/subgroup';

export class AggregateTargetScoreRow {
  targetId: number;
  targetNaturalId: string;
  claim: string;
  subgroup: Subgroup;
  studentsTested: number;
  standardMetRelativeLevel: TargetReportingLevel;
  studentRelativeLevel: TargetReportingLevel;
}

export enum TargetReportingLevel {
  Above = 'Above',
  Near = 'Near',
  Below = 'Below',
  InsufficientData = 'InsufficientData',
  Excluded = 'Excluded',
  NoResults = 'NoResults'
}

export const byTargetReportingLevel = ranking<TargetReportingLevel>([
  TargetReportingLevel.Above,
  TargetReportingLevel.Near,
  TargetReportingLevel.Below,
  TargetReportingLevel.InsufficientData,
  TargetReportingLevel.Excluded,
  TargetReportingLevel.NoResults
]);
