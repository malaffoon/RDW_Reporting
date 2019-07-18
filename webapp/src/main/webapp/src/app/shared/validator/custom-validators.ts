import { FormControl } from '@angular/forms';
import { isBlank } from '../support/support';

/**
 * A static validator that trims input before checking if it is null or an empty string. The `Validators.required`
 * angular validator does not trim values, allowing values such as "      ".
 * @param control
 * @returns an error if the control value is null, or is composed of only whitespace
 */
export function notBlank(control: FormControl): { required: boolean } | null {
  return isBlank(control.value) ? { required: true } : null;
}

/**
 * A static validator that checks for a valid tenant key. A tenant key has the following requirements:
 *
 * 1. Cannot start with an underscore or dash
 * 2. Can only contain alpha and numeric characters, along with underscores and dashes. No spaces.
 *
 * @param control
 * @returns an error if the control value is null or contains invalid characters
 */
export function tenantKey(
  control: FormControl
): { tenantKeyInvalid: boolean } | null {
  const regex = /^[a-zA-Z0-9_\-]*$/;

  if (control.value == null) {
    return { tenantKeyInvalid: true };
  } else if (
    regex.test(control.value) &&
    !control.value.startsWith('-') &&
    !control.value.startsWith('_')
  ) {
    return null;
  }

  return { tenantKeyInvalid: true };
}
