import { Organization } from '../../shared/organization/organization';

export interface LongitudinalCohortChart {

  /**
   * Assessment performance levels over a span of year/grades
   */
  readonly performanceLevels: PerformanceLevel[];

  /**
   * Organization performance over a span of year/Grades
   */
  readonly organizationPerformances: OrganizationPerformance[];

}

export interface PerformanceLevel {
  readonly id: number;
  readonly name: string;
  readonly color: string;
  readonly yearGradeScaleScoreRanges: YearGradeScaleScoreRange[];
}

export interface OrganizationPerformance {
  readonly organization: Organization;
  readonly yearGradeScaleScores: YearGradeScaleScore[];
}

export interface YearGrade {
  readonly year: number;
  // TODO make this string code when data comes from backend
  readonly grade: number;
}

export interface Range<T> {
  readonly minimum: T;
  readonly maximum: T;
}

export interface YearGradeScaleScore {
  readonly yearGrade: YearGrade;
  readonly scaleScore: number;
}

export interface YearGradeScaleScoreRange {
  readonly yearGrade: YearGrade;
  readonly scaleScoreRange: Range<number>;
}
