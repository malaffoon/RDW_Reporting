import { Field, FieldConfiguration, InputType } from './field';
import { fieldConfigurationsByKey } from './field-configurations';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { password, uri, url } from './field-validators';

const inputTypeByPropertyDataType: { [key: string]: InputType } = <
  { [key: string]: InputType }
>{
  string: 'input',
  boolean: 'checkbox',
  integer: 'input', // TODO support input constraints like number etc.
  float: 'input', // TODO support input constraints
  enumeration: 'select',
  'enumeration-list': 'multi-select',
  uri: 'input',
  url: 'input',
  'url-fragment': 'input',
  password: 'input',
  username: 'input',
  databaseName: 'input'
};

const identity = value => value;
const normalizerByDataType: { [key: string]: (value: any) => any } = {
  boolean: value => Boolean(value)
};

const validatorsByPropertyDataType: { [key: string]: ValidatorFn[] } = <
  { [key: string]: ValidatorFn[] }
>{
  password: [password],
  uri: [uri],
  url: [url],
  'url-fragment': [url]
};

export function fieldValidators(key: string): ValidatorFn[] {
  const configuration = fieldConfigurationsByKey[key] || <FieldConfiguration>{};
  return [
    ...(configuration.required ? [Validators.required] : []),
    ...(validatorsByPropertyDataType[configuration.dataType] || [])
  ];
}

export function fieldRequired(key: string): boolean {
  return (fieldConfigurationsByKey[key] || <FieldConfiguration>{}).required;
}

export function field(key: string, translateService: TranslateService): Field {
  const configuration: FieldConfiguration =
    fieldConfigurationsByKey[key] || <FieldConfiguration>{};
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

export function normalizeFieldValue(key: string, value: any): any {
  const configuration: FieldConfiguration =
    fieldConfigurationsByKey[key] || <FieldConfiguration>{};
  const normalize = normalizerByDataType[configuration.dataType] || identity;
  return normalize(value);
}
