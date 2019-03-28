/**
 * Represents a scale score
 */
export interface ScaleScore {
  /**
   * The numeric score value
   */
  value: number;

  /**
   * The performance level identifier
   */
  level: number;

  /**
   * The standard error value
   */
  standardError: number;
}
