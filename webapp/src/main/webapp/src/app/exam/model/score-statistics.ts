import { SubjectDefinition } from '../../subject/subject';

/**
 * Declares all the different score types
 */
export type ScoreType = 'Overall' | 'Alternate' | 'Claim';

/**
 * High level set of statistics computed from a set of exams for a specific assessment
 */
export interface ScoreStatistics {
  /**
   * The type of scores
   */
  scoreType: ScoreType;
  /**
   * The assessment and subject metadata
   */
  subjectDefinition: SubjectDefinition;
  /**
   * The total number of exams represented in the statistics
   */
  resultCount: number;
  /**
   * The score statistics grouped by code
   */
  groups: ScoreGroup[];
}

/**
 * A group of scores associated with a specific code
 */
export interface ScoreGroup {
  /**
   * The code or grouping ID
   */
  code: string;
  /**
   * The average scale score of the result group
   */
  averageScaleScore: number;
  /**
   * The standard error of the result group
   */
  standardError: number;
  /**
   * The exam count and percentages of exam scores that fall in a specific performance level
   */
  performanceLevelScores: PerformanceLevelScore[];
}

/**
 * Performance level data
 */
export interface PerformanceLevelScore {
  /**
   * The level the score is at
   */
  level: number;

  /**
   * The count of exams with scores of this performance level
   */
  count: number;
  /**
   * The percent of exams with scores of this performance level
   */
  percent: number;
}
