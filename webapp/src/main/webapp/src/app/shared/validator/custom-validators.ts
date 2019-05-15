import { FormControl, ValidationErrors } from '@angular/forms';
import { isString } from 'lodash';

export class CustomValidators {
  /**
   * A static validator that trims input before checking if it is null or an empty string. The `Validators.required`
   * angular validator does not trim values, allowing values such as "      ".
   * @param control
   * @returns an error if the control value is null, or is composed of only whitespace
   */
  static notBlank(control: FormControl): { required: boolean } | null {
    return CustomValidators.isBlank(control.value) ||
      (isString(control.value) && control.value.trim() == '')
      ? { required: true }
      : null;
  }

  private static isBlank(value: string): boolean {
    return value == null || value.trim().length === 0;
  }
}
