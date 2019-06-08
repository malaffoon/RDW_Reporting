/**
 * Represents the current state of an embargo
 */
export interface Embargo {
  /**
   * True if the embargo is enabled
   */
  enabled?: boolean;
  /**
   * The school year the embargo applies to
   */
  schoolYear?: number;
}
