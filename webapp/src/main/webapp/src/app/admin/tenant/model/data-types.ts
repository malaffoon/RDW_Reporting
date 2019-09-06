import { DataType } from './form/data-type';
import {
  assessmentTypeOptions,
  languageOptions,
  reportLanguageOptions,
  requiredDataElementOptions,
  stateOptions,
  studentFieldOptions
} from './option-providers';
import {
  urlFragment,
  uri,
  archiveUri,
  databasePassword,
  notPostgresReservedWord
} from './form/validators';

export const stringDataType: DataType = {
  inputType: 'input'
};

export const booleanDataType: DataType = {
  inputType: 'checkbox'
};

export const positiveIntegerDataType: DataType = {
  inputType: 'input',
  constraints: ['positive', 'integer']
};

export const positiveDecimalDataType: DataType = {
  inputType: 'input',
  constraints: ['positive']
};

export const uriDataType: DataType = {
  inputType: 'input',
  validators: [uri]
};

export const urlFragmentDataType: DataType = {
  inputType: 'input',
  validators: [urlFragment]
};

export const archiveUriDataType: DataType = {
  inputType: 'input',
  validators: [archiveUri]
};

export const databaseNameDataType: DataType = {
  inputType: 'input',
  constraints: ['lowercase'],
  validators: [notPostgresReservedWord]
};

export const databaseUsernameDataType: DataType = {
  inputType: 'input',
  constraints: ['lowercase'],
  validators: [notPostgresReservedWord]
};

export const databasePasswordDataType: DataType = {
  inputType: 'input',
  validators: [databasePassword],
  masked: true
};

export const secretDataType: DataType = {
  inputType: 'input',
  masked: true
};

export const stateDataType: DataType = {
  inputType: 'select',
  options: stateOptions
};

export const studentFieldDataType: DataType = {
  inputType: 'select',
  options: studentFieldOptions
};

export const requiredDataElementsDataType: DataType = {
  inputType: 'multiselect',
  options: requiredDataElementOptions
};

export const assessmentTypeDataType: DataType = {
  inputType: 'multiselect',
  options: assessmentTypeOptions
};

export const reportLanguagesDataType: DataType = {
  inputType: 'multiselect',
  options: reportLanguageOptions
};

export const languagesDataType: DataType = {
  inputType: 'multiselect',
  options: languageOptions
};
