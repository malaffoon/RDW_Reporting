import { DataType } from './data-type';
import { ValidatorFn } from '@angular/forms';

/**
 * A field instance configuration for a specific form instance
 */
export interface FormFieldConfiguration {
  /**
   * The form field name or "key"
   */
  name: string;

  /**
   * The data type of the field
   */
  dataType: DataType;

  /**
   * True if the field is required in this form
   */
  required?: boolean;

  /**
   * The form-specific validators
   */
  validators?: ValidatorFn[];

  /**
   * True if the field is readonly in this form
   */
  readonly?: boolean;
}
