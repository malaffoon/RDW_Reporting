export interface SubjectAssessmentType {
  readonly subject: string;
  readonly assessmentType: string;
  readonly performanceLevelStandardCutoff: number;
  readonly performanceLevelCount: number;
  readonly scoreableClaims: string[];
  readonly scoreableClaimPerformanceLevelCount: number;
}
