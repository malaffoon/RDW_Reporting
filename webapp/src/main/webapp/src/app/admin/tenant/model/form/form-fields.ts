import { FormFieldConfiguration } from './form-field-configuration';
import { FormField } from './form-field';
import { ValidatorFn, Validators } from '@angular/forms';
import { requiredList } from './validators';
import { isBlank } from '../../../../shared/support/support';
import { isEqual } from 'lodash';
import { InputType } from './input-type';

const identity = value => value;

// TODO this should really be based on key as sometimes arrays are sets and sometimes lists
const normalizeByInputType: { [key: string]: (value: any) => any } = {
  // null, blank to null, number to string
  input: value =>
    value == null
      ? null
      : typeof value === 'string'
      ? value.trim().length === 0
        ? null
        : value
      : String(value),
  // cast null to false and strings to boolean
  checkbox: value => Boolean(value),
  // because in practice we are always comparing sets of primitives
  multiselect: value => (value != null ? value.slice().sort() : [])
};

export function formFieldEquals(inputType: InputType, a: any, b: any): boolean {
  const normalize = normalizeByInputType[inputType] || identity;
  return isEqual(normalize(a), normalize(b));
}

export function formFieldModified(
  inputType: InputType,
  value: any,
  originalValue: any
): boolean {
  // For "default required" fields if the override is null then there is no change to the default
  // For "override required" fields the UI will prevent you from entering null/blank
  if (value == null || (typeof value === 'string' && isBlank(value))) {
    return false;
  }
  return !formFieldEquals(inputType, value, originalValue);
}

export function formFields(
  configurations: FormFieldConfiguration[]
): FormField[] {
  return configurations.map(configuration => ({
    configuration,
    validators: formFieldValidators(configuration)
  }));
}

export function formFieldValidators(
  configuration: FormFieldConfiguration
): ValidatorFn[] {
  return [
    ...(configuration.dataType.validators || []),
    ...(configuration.validators || []),
    ...(configuration.required
      ? configuration.dataType.inputType === 'multiselect'
        ? [requiredList]
        : [Validators.required]
      : [])
  ];
}
