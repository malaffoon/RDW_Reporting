import { Field, FieldConfiguration, InputType } from './field';
import { fieldConfigurationsByKey } from './field-configurations';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { password, uri, url } from './field-validators';
import { TenantType } from './tenant-type';

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

export function normalizeFieldValue(key: string, value: any): any {
  const configuration: FieldConfiguration = fieldConfiguration(key);
  const normalize = normalizerByDataType[configuration.dataType] || identity;
  return normalize(value);
}

// used to ensure we display the full set of fields in the form
export function configurationFormFields(
  type: TenantType
): { [key: string]: any } {
  return Object.entries(fieldConfigurationsByKey).reduce((keys, [key]) => {
    // correctly construct form fields based on tenant type
    if (type !== 'SANDBOX' || !/^(archive|datasources)\..+$/.test(key)) {
      keys[key] = normalizeFieldValue(key, null);
    }
    return keys;
  }, {});
}
