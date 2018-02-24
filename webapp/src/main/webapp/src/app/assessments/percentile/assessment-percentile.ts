/**
 * Represents percentile data for an assessment and date range
 */
export interface Percentile {
  assessmentId: number;
  startDate: Date;
  endDate: Date;
  count: number;
  mean: number;
  standardDeviation: number;
  scores: PercentileScore[];
}

/**
 * A rank-score pair (e.g. 25, 2000)
 */
export interface PercentileScore {
  rank: number;
  score: number;
}
