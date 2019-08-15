import { FormField } from './form/form-field';

/**
 * Represents an override
 */
export interface Property<T = any> extends FormField {
  /**
   * The instance level default value
   */
  originalValue: T;
}
