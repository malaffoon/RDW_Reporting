/**
 * Represents a selectable option in a form control like a select box or typeahead
 */
export interface Option<T = any> {
  /**
   * The option value
   */
  value: T;

  /**
   * The option display name
   */
  label?: string;
}
