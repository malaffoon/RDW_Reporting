// TODO consider renaming this to SubjectAssessmentDefinition as it is the combination of a subject+assessment def
/**
 * This is a subject and assessment specific configuration
 */
export interface SubjectDefinition {
  readonly subject: string;
  readonly assessmentType: string;

  /** @deprecated use overallScores */
  readonly performanceLevels: number[];
  /** @deprecated use overallScores */
  readonly performanceLevelCount: number;
  /** @deprecated use overallScores */
  readonly performanceLevelStandardCutoff: number;

  /** @deprecated use claimScores */
  readonly scorableClaims: string[];
  /** @deprecated use claimScores */
  readonly scorableClaimPerformanceLevels: number[];
  /** @deprecated use claimScores */
  readonly scorableClaimPerformanceLevelCount: number;

  /** @deprecated use claimScores */
  readonly alternateScoreCodes?: string[];
  /** @deprecated use claimScores */
  readonly alternateScorePerformanceLevels?: number[];
  /** @deprecated use claimScores */
  readonly alternateScorePerformanceLevelCount?: number;

  readonly overallScore: OverallScore;
  readonly alternateScores?: SubScores;
  readonly claimScores?: SubScores;
}

export interface OverallScore {
  readonly levels: number[];
  readonly levelCount: number;
  readonly standardCutoff: number;
}

export interface SubScores {
  readonly codes: string[];
  readonly levels: number[];
  readonly levelCount: number;
}
