import { SubjectDefinition } from '../../subject/subject';

export interface ScoreStatistics {
  subjectDefinition: SubjectDefinition;
  resultCount: number;
  groups: ScoreGroup[];
}

export interface ScoreGroup {
  code: string;
  averageScaleScore: number;
  standardError: number;
  performanceLevelScores: PerformanceLevelScore[];
}

export interface PerformanceLevelScore {
  count: number;
  percent: number;
}
