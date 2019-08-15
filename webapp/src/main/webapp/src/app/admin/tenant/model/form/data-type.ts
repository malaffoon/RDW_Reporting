import { TranslateService } from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Option } from './option';
import { InputType } from './input-type';
import { ValidatorFn } from '@angular/forms';
import { ConstraintType } from './constraint-type';

/**
 * Represents a data type and how it should be treated
 */
export interface DataType<T = any> {
  /**
   * The type of input control assigned to this data type
   */
  inputType?: InputType;
  /**
   * Provides the available options for this data type
   */
  options?: OptionsProvider<T>;
  /**
   * Data-type specific form validators
   */
  validators?: ValidatorFn[];
  /**
   * List of constraints for this data type
   * This is used by the form control renderer to make sure proper input is taken
   */
  constraints?: ConstraintType[];
  /**
   * True if the field value should be masked
   */
  masked?: boolean;
}

/**
 * Provides options for lists and map data types
 */
export interface OptionsProvider<T = any> {
  /**
   * Provides options for lists and map data types
   *
   * @param context The context used to produce the options
   */
  (context: OptionProviderContext): Observable<Option<T>[]>;
}

/**
 * Services needed to create options for display
 */
export interface OptionProviderContext {
  /**
   * The service used to label the options
   */
  readonly translateService: TranslateService;
  /**
   * The service used to resolve the service needed to resolve the option values
   */
  readonly injector: Injector;
}
