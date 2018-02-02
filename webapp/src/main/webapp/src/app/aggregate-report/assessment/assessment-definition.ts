export interface AssessmentDefinition {

  /**
   * The total performance levels available for this assessment type.
   */
  readonly performanceLevelCount: number;

  /**
   * The performance level grouping point.
   * Performance levels can be grouped into "below" and "at-or-above" the returned performance level.
   * A value of -1 denotes no rollup.
   */
  readonly performanceLevelGroupingCutPoint: number;

}
