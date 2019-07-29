import { Field, FieldConfiguration, InputType } from './field';
import { fieldConfigurationsByKey } from './field-configurations';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { archiveUri, password, uri, url } from './field-validators';
import { TenantType } from './tenant-type';
import { emptyToNull } from '../../../shared/support/support';
import { isEqual } from 'lodash';

const inputTypeByPropertyDataType: { [key: string]: InputType } = <
  { [key: string]: InputType }
>{
  string: 'input',
  boolean: 'checkbox',
  'positive-integer': 'input',
  'positive-decimal': 'input',
  enumeration: 'select',
  'enumeration-list': 'multiselect',
  uri: 'input',
  url: 'input',
  'url-fragment': 'input',
  'archive-uri': 'input',
  password: 'input',
  username: 'input'
};

const identity = value => value;
// TODO this should really be based on key as sometimes arrays are sets and sometimes lists
const normalizeByInputType: { [key: string]: (value: any) => any } = {
  input: value => emptyToNull(value),
  checkbox: value => Boolean(value),
  // because in practice we are always comparing sets of primitives
  multiselect: value => (value != null ? value.slice().sort() : [])
};

const validatorsByPropertyDataType: { [key: string]: ValidatorFn[] } = <
  { [key: string]: ValidatorFn[] }
>{
  password: [password],
  uri: [uri],
  url: [url],
  'url-fragment': [url],
  'archive-uri': [archiveUri]
};

export function fieldConfiguration(key: string): FieldConfiguration {
  return fieldConfigurationsByKey[key] || <FieldConfiguration>{};
}

export function fieldValidators(key: string): ValidatorFn[] {
  const configuration = fieldConfiguration(key);
  return [
    ...(configuration.required ? [Validators.required] : []),
    ...(validatorsByPropertyDataType[configuration.dataType] || [])
  ];
}

export function fieldRequired(key: string): boolean {
  return fieldConfiguration(key).required;
}

export function field(key: string, translateService: TranslateService): Field {
  const configuration: FieldConfiguration = fieldConfiguration(key);
  const inputType =
    inputTypeByPropertyDataType[configuration.dataType] || 'input';
  const validators = fieldValidators(key);
  const field: Field = {
    configuration,
    inputType,
    validators
  };
  if (configuration.options != null) {
    field.options = configuration.options(translateService);
  }
  return field;
}

// used to ensure we display the full set of fields in the form
export function configurationFormFields(
  type: TenantType
): { [key: string]: any } {
  return Object.keys(fieldConfigurationsByKey).reduce((keys, key) => {
    // correctly construct form fields based on tenant type
    const { hidden } = fieldConfiguration(key);
    if (hidden == null || !hidden(type)) {
      keys[key] = null;
    }
    return keys;
  }, {});
}

export function fieldsEqual(key: string, a: any, b: any): boolean {
  const configuration: FieldConfiguration = fieldConfiguration(key);
  const normalize =
    normalizeByInputType[
      inputTypeByPropertyDataType[configuration.dataType] || 'input'
    ] || identity;
  return isEqual(normalize(a), normalize(b));
}
