export interface SubjectDefinition {
  readonly subject: string;
  readonly assessmentType: string;
  readonly performanceLevelCount: number;
  readonly performanceLevelStandardCutoff: number;
  readonly scorableClaims: string[];
  readonly scorableClaimPerformanceLevelCount: number;
}
