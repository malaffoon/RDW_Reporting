import { ExportRequest } from './export-request.interface';
import { AggregateTargetScoreRow } from './aggregate-target-score-row.model';
import { SubjectDefinition } from '../../subject/subject';

/**
 * This model represents a Target Report aggregate table export request.
 */
export interface ExportTargetReportRequest extends ExportRequest {
  group: string;
  schoolYear: number;
  averageScaleScore: number;
  standardError?: number;
  subjectDefinition: SubjectDefinition;
  targetScoreRows: AggregateTargetScoreRow[];
}
