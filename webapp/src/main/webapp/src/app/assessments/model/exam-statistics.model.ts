import { ClaimStatistics } from './claim-score.model';

/**
 * @deprecated use ScoreStatistics
 */
export class ExamStatistics {
  total: number;
  average: number;
  standardError: number;
  levels: ExamStatisticsLevel[];
  percents: ExamStatisticsLevel[];
  claims: ClaimStatistics[];
}

/**
 * @deprecated use ScoreStatistics
 */
export class ExamStatisticsLevel {
  id: number;
  value: number;
  suffix: string;
}
