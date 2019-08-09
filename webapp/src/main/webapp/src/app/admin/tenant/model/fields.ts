import {
  Field,
  FieldConfiguration,
  FieldConfigurationContext,
  InputType
} from './field';
import { fieldConfigurationsByKey } from './field-configurations';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorFn, Validators } from '@angular/forms';
import {
  archiveUri,
  notPostgresReservedWord,
  password,
  requiredList,
  uri,
  url
} from './field-validators';
import { TenantType } from './tenant-type';
import { isBlank } from '../../../shared/support/support';
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

const validatorsByPropertyDataType: { [key: string]: ValidatorFn[] } = <
  { [key: string]: ValidatorFn[] }
>{
  password: [password],
  uri: [uri],
  url: [url],
  'url-fragment': [url],
  'archive-uri': [archiveUri],
  username: [notPostgresReservedWord],
  database: [notPostgresReservedWord]
};

export function fieldConfiguration(key: string): FieldConfiguration {
  return fieldConfigurationsByKey[key] || <FieldConfiguration>{};
}

export function fieldValidators(key: string): ValidatorFn[] {
  const configuration = fieldConfiguration(key);
  const requiredValidator: ValidatorFn =
    configuration.dataType === 'enumeration-list'
      ? requiredList
      : Validators.required;

  return [
    ...(configuration.required ? [requiredValidator] : []),
    ...(validatorsByPropertyDataType[configuration.dataType] || [])
  ];
}

export function fieldRequired(key: string): boolean {
  return fieldConfiguration(key).required;
}

export function fieldInputType(key: string): InputType {
  return (
    inputTypeByPropertyDataType[fieldConfiguration(key).dataType] || 'input'
  );
}

export function field(key: string, context: FieldConfigurationContext): Field {
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
    field.options = configuration.options(context);
  }
  return field;
}

// used to ensure we display the full set of fields in the form
export function configurationFormFields(
  type: TenantType
): { [key: string]: FieldConfiguration } {
  return Object.keys(fieldConfigurationsByKey).reduce((keys, key) => {
    // correctly construct form fields based on tenant type
    const configuration = fieldConfiguration(key);
    if (configuration.hidden == null || !configuration.hidden(type)) {
      keys[key] = configuration;
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

export function isModified(
  key: string,
  value: any,
  originalValue: any
): boolean {
  // For "default required" fields if the override is null then there is no change to the default
  // For "override required" fields the UI will prevent you from entering null/blank
  if (value == null || (typeof value === 'string' && isBlank(value))) {
    return false;
  }
  return !fieldsEqual(key, value, originalValue);
}
