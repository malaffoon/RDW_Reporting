import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { isNullOrBlank } from '../support/support';

/**
 * Rename where the validator results go in the error payload
 *
 * @param validator The validator to wrap
 * @param errorName The error name to use
 */
export function renameError(
  validator: ValidatorFn,
  errorName: string
): ValidatorFn {
  return function(control: AbstractControl): ValidationErrors {
    const result = validator(control);
    if (result != null) {
      return {
        [errorName]: Object.values(result)[0]
      };
    }
    return null;
  };
}

/**
 * Form control validator that makes sure the control value is not an empty array
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {ValidatorFn}
 */
export function notEmpty(properties: any): ValidatorFn {
  return control => {
    return control.value.length ? null : { notEmpty: properties };
  };
}

/**
 * Form control validator that makes sure the control value is not included in the collection of values provided by the value provider
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {ValidatorFn}
 */
export function notIncluded(
  valueProvider: () => any[],
  properties: any
): ValidatorFn {
  return control => {
    return valueProvider().includes(control.value)
      ? { notIncluded: properties }
      : null;
  };
}

/**
 * Form control validator that makes sure the control value has a length greater than a number
 *
 * @param greaterThanNumber the number the control must have a length greater than
 * @param properties the properties to propagate when the control value is invalid
 * @return {ValidatorFn}
 */
export function isGreaterThan(
  greaterThanNumber: number,
  properties: any
): ValidatorFn {
  return control => {
    return control.value.length > greaterThanNumber
      ? null
      : { isGreaterThan: properties };
  };
}

/**
 * A static validator that trims input before checking if it is null or an empty string. The `Validators.required`
 * angular validator does not trim values, allowing values such as "      ".
 * @param control
 * @returns an error if the control value is null, or is composed of only whitespace
 */
export function notBlank(control: FormControl): { required: boolean } | null {
  return isNullOrBlank(control.value) ? { required: true } : null;
}
