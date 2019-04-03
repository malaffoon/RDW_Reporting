import { ExamStatisticsLevel } from './exam-statistics.model';

/**
 * @deprecated use ScoreStatistics
 */
export class ClaimStatistics {
  id: number;
  levels: ExamStatisticsLevel[];
  percents: ExamStatisticsLevel[];
}
