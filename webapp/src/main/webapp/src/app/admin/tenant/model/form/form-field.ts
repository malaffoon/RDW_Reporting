import { FormFieldConfiguration } from './form-field-configuration';
import { ValidatorFn } from '@angular/forms';

/**
 * An instance of a specific field on a specific form.
 * FormField instances are a product of {@link FormFieldConfiguration} and {@link DataType}
 */
export interface FormField {
  configuration: FormFieldConfiguration;
  validators: ValidatorFn[];
}
