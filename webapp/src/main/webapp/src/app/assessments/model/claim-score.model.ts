import { ExamStatisticsLevel } from './exam-statistics.model';

export class ClaimStatistics {
  id: number;
  levels: ExamStatisticsLevel[];
  percents: ExamStatisticsLevel[];
}
