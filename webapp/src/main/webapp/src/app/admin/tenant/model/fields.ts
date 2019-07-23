import { Field, InputType } from './field';
import { fieldConfigurationsByKey } from './field-configurations';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { password, uri, url } from './field-validators';

// uncomment when support is added
const inputTypeByPropertyDataType: { [key: string]: InputType } = <
  { [key: string]: InputType }
>{
  string: 'input',
  // 'boolean': 'checkbox',
  integer: 'input', // TODO support input constraints like number etc.
  float: 'input', // TODO support input constraints
  // 'enumeration': 'select',
  'enumeration-list': 'multi-select',
  // 'enumeration-map': 'multi-select-modal',
  uri: 'input',
  url: 'input',
  'url-fragment': 'input',
  password: 'input',
  username: 'input',
  databaseName: 'input'
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
  const configuration = fieldConfigurationsByKey[key] || {};
  return [
    ...(configuration.required ? [Validators.required] : []),
    ...(validatorsByPropertyDataType[configuration.dataType] || [])
  ];
}

export function field(key: string, translateService: TranslateService): Field {
  const configuration = fieldConfigurationsByKey[key] || {};
  const inputType =
    inputTypeByPropertyDataType[configuration.dataType] || 'input';
  const validators = fieldValidators(key);
  const field: Field = {
    configuration,
    inputType,
    validators
  };
  if (configuration.keys != null) {
    field.keys = configuration.keys(translateService);
  }
  if (configuration.values != null) {
    field.values = configuration.values(translateService);
  }
  return field;
}
