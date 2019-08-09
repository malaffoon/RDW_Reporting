import { TranslateService } from '@ngx-translate/core';
import { ValidatorFn } from '@angular/forms';
import { TenantType } from './tenant-type';
import { Observable } from 'rxjs';
import { Injector } from '@angular/core';

/**
 * The different field data types
 */
export type PropertyDataType =
  | 'string'
  | 'boolean'
  | 'positive-integer'
  | 'positive-decimal'
  | 'enumeration'
  | 'enumeration-list'
  | 'uri'
  | 'url'
  | 'url-fragment'
  | 'archive-uri'
  | 'password'
  | 'username'
  | 'database';

export type InputType = 'input' | 'checkbox' | 'select' | 'multiselect';

export interface Option<T = any> {
  /**
   * The option value
   */
  value: T;

  /**
   * The option display name
   */
  label?: string;
}

export interface FieldConfigurationContext {
  readonly translateService: TranslateService;
  readonly injector: Injector;
}

/**
 * Provides options for lists and map data types
 */
export interface OptionsProvider<T = any> {
  (context: FieldConfigurationContext): Observable<Option<T>[]>;
}

export interface Equals<T = any> {
  (a: T, b: T): boolean;
}

/**
 * The configuration for a form field
 */
export interface FieldConfiguration<DataTypes = any, T = any> {
  /**
   * The data type of the field
   */
  dataType: DataTypes;

  /**
   * This method should provide the possible values of enumerated data types
   *
   * @param translateService The service used to translate the value into a display label
   */
  options?: OptionsProvider<T>;

  /**
   * Set this if the field is required
   */
  required?: boolean;

  /**
   * lowercase constraint
   */
  lowercase?: boolean;

  /**
   * Used to provide leniency when comparing values for enumerations
   */
  equals?: Equals<T>;

  /**
   * If true the field will be omitted from the form
   */
  hidden?: (type: TenantType) => boolean;
}

/**
 * The computed field metadata based on the configuration
 */
export interface Field<DataTypes = any, T = any> {
  configuration: FieldConfiguration<DataTypes, T>;

  /**
   * The actual form input to use
   */
  inputType: InputType;

  /**
   * The form-specific validators
   */
  validators: ValidatorFn[];

  /**
   * The possible values of the field if it is a list or map
   */
  options?: Observable<Option<T>[]>;
}
