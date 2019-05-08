import { FormControl, ValidationErrors } from '@angular/forms';
import { isString } from 'lodash';

export class CustomValidators {
  /**
   * A static validator that trims input before checking if it is null or an empty string
   * @param control
   * @returns an error if the control value is null, or is composed of only whitespace
   */
  static required(control: FormControl): ValidationErrors | null {
    return CustomValidators.isBlank(control.value) ||
      (isString(control.value) && control.value.trim() == '')
      ? { required: true }
      : null;
  }

  private static isBlank(value: string): boolean {
    return value == null || value.trim().length === 0;
  }
}
