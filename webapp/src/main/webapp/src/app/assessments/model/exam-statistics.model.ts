/**
 * @deprecated use ScoreStatistics
 */
export class ExamStatistics {
  total: number;
  average: number;
  standardError?: number;
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

/**
 * @deprecated use ScoreStatistics
 */
export class ClaimStatistics {
  id: number;
  levels: ExamStatisticsLevel[];
  percents: ExamStatisticsLevel[];
}
