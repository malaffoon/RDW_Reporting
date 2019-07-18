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
