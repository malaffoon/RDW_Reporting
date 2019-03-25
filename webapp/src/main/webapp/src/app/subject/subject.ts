// TODO consider renaming this to SubjectAssessmentDefinition as it is the combination of a subject+assessment def
export interface SubjectDefinition {
  readonly subject: string;
  readonly assessmentType: string;
  readonly performanceLevels: number[];
  readonly performanceLevelCount: number;
  readonly performanceLevelStandardCutoff: number;
  readonly scorableClaims: string[];
  readonly scorableClaimPerformanceLevels: number[];
  readonly scorableClaimPerformanceLevelCount: number;
}
