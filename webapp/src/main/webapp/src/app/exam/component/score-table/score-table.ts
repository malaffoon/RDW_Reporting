import {
  PerformanceLevelScore,
  ScoreStatistics,
  ScoreType
} from '../../model/score-statistics';

/**
 * Score table view model
 */
export interface ScoreTable {
  scoreType: ScoreType;
  subjectCode: string;
  assessmentTypeCode: string;
  resultCount: number;
  scoreStatistics: ScoreTableStatistics[];
}

/**
 * Extends score statistics and overrides with view models
 */
export interface ScoreTableStatistics extends ScoreStatistics {
  performanceLevelScores: ScoreTablePerformanceLevelScores[];
}

/**
 * Adds some view specific fields to performance score levels
 *
 * These are determined from score type, assessment type, subject and level
 */
export interface ScoreTablePerformanceLevelScores
  extends PerformanceLevelScore {
  /**
   * The performance level name translation code
   */
  nameCode: string;
  /**
   * The performance level color translation code
   */
  colorCode: string;
}
