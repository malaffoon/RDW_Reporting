import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Option } from '../../shared/form/option';
import { ReportQuery } from '../../report/report';

/**
 * Defines the different possible form control types
 */
export type ControlType = 'input' | 'toggle' | 'select';

/**
 * Info popover data
 */
export interface InfoPopover {
  /**
   * The popover title
   */
  title: string;

  /**
   * The popover text content
   */
  content: string;
}

/**
 * A complete form field configuration needed to render a form field control
 */
export interface FormField {
  /**
   * The control name
   */
  name: string;

  /**
   * The control type
   */
  type: ControlType;

  /**
   * The validation methods
   */
  validators?: ValidatorFn | ValidatorFn[];

  /**
   * The form control label
   */
  label?: string;

  /**
   * The form control popover info
   */
  info?: InfoPopover;

  /**
   * The form control placeholder
   */
  placeholder?: string;

  /**
   * The form control options
   */
  options?: Option[];

  /**
   * Determines whether or not a field should be disabled or not
   *
   * @param formGroup
   */
  disabled?: (formGroup: FormGroup) => boolean;

  /**
   * This is for backward compatibility.
   * Without this, the layout would not reserve the form field slot as blank
   */
  excluded?: boolean;

  /**
   * Set this when you want the control to be part of the form but hidden from the user experience for simplicity
   */
  hidden?: boolean;

  /**
   * The default value
   */
  defaultValue?: any;
}

/**
 * Mapper used to convert a model to and from a form representation
 */
export interface FormMapper<T = any> {
  /**
   * Maps a model into form state
   *
   * @param value The value to map
   */
  toState(value: T): any;

  /**
   * Maps a model from a form value into its domain representation
   *
   * @param state The form state to map from
   */
  fromState(state: any): T;
}

/**
 * Represents all form display options and form field overrides
 */
export interface FormOptions {
  /**
   * If set to true all fields will be readonly
   * If set to an array of strings only the specified field names will be readonly
   */
  readonly?: boolean | string[];

  /**
   * Option overrides useful for making the form context-aware
   */
  fields?: { [fieldName: string]: Partial<FormField> };
}

/**
 * Form field view model
 */
export interface FormFieldView extends FormField {
  /**
   * The field's form control
   */
  control: FormControl;

  /**
   * If true, the field will be rendered as readonly
   */
  readonly: boolean;

  /**
   * The value to render when readonly
   */
  readonlyValue?: any;
}

/**
 * An entity that requires explicit resource cleanup
 * This is mainly used to clean up resources with event subscriptions
 */
export interface Destroyable<T> {
  /**
   * The resource
   */
  value: T;

  /**
   * Releases the resource from bindings
   */
  destroy(): void;
}
