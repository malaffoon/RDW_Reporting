import {
  AbstractControl,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';
import { forwardRef, Provider } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { Destroyable, FormField, FormFieldView, FormOptions } from './form';
import { isArray } from 'lodash';

/**
 * Holds the form group error information
 */
export interface ValidationErrorHolder {
  controlId: string;
  id: string;
  properties?: { [key: string]: any };
}

/**
 * Provides the value accessor provider necessary for hooking {ControlValueAccessor}s into Angular forms
 * @param reference
 */
export function controlValueAccessorProvider(reference: any): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: reference,
    multi: true
  };
}

export function validate(formGroup: FormGroup): void {
  // TODO this step should be recursive but there is currently no use case
  Object.values(formGroup.controls).forEach(control => {
    control.markAsDirty();
  });
  formGroup.updateValueAndValidity();
}

/**
 * Holds common methods for dealing with angular form components
 */
export class Forms {
  /**
   * @deprecated use {@link controlValueAccessorProvider}
   */
  public static valueAccessor(reference: any) {
    return controlValueAccessorProvider(forwardRef(() => reference));
  }

  /**
   * Gets all controls of the given form group
   *
   * @param formGroup the form group to get the controls of
   */
  public static controls(formGroup: FormGroup): AbstractControl[] {
    return Object.values(formGroup.controls);
  }

  /**
   * Gets all of the validation errors from all form controls and wraps them in a {ValidationErrorHolder}
   *
   * @param formGroup the form group to get the errors of
   */
  public static errors(formGroup: FormGroup): ValidationErrorHolder[] {
    const holders = [];
    Object.keys(formGroup.controls).forEach(key => {
      const errors: ValidationErrors = formGroup.get(key).errors || {};
      Object.keys(errors).forEach(errorId => {
        holders.push({
          controlId: key,
          id: errorId,
          properties: errors[errorId]
        });
      });
    });
    const errors: ValidationErrors = formGroup.errors || {};
    Object.keys(errors).forEach(errorId => {
      holders.push({ controlId: '', id: errorId, properties: errors[errorId] });
    });
    return holders;
  }

  /**
   * True if the control has errors and has been touched or dirtied
   *
   * @param control the form control to test
   */
  public static showErrors(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  public static submit(
    form: FormGroup,
    onValid: () => void,
    onInvalid?: () => void
  ): void {
    if (form.valid) {
      onValid();
    } else {
      validate(form);

      if (typeof onInvalid === 'function') {
        onInvalid();
      }
    }
  }
}

/**
 * Creates a form control for the specified field and state
 *
 * @param field The form field configuration which provides default values, validators and disabled information
 * @param value The initial form field value
 */
export function createFormControl(field: FormField, value?: any): FormControl {
  const controlValue =
    typeof value !== 'undefined' ? value : field.defaultValue;

  return new FormControl(
    {
      value: controlValue,
      disabled: false
    },
    field.validators
  );
}

/**
 * Creates a collection of form controls for the specified fields and state
 *
 * @param formFields The form fields of the form which provide default values, validators and disabled information
 * @param formState The initial form state
 */
export function createFormControls(
  formFields: FormField[],
  formState: any = {}
): { [fieldName: string]: FormControl } {
  return formFields.reduce((controls, field) => {
    const value = formState[field.name];
    const controlValue =
      typeof value !== 'undefined' ? value : field.defaultValue;

    controls[field.name] = new FormControl(
      { value: controlValue, disabled: false },
      field.validators
    );
    return controls;
  }, {});
}

/**
 * Creates a reactive form group given a set of fields, controls and
 *
 * @param formFields The form fields of the form which provide default values, validators and disabled information
 * @param formControls The form controls of the form which provide initial state and validators
 */
export function createReactiveFormGroup(
  formFields: FormField[],
  formControls: { [fieldName: string]: FormControl }
): Destroyable<FormGroup> {
  const destroyer = new Subject();
  const formGroup = new FormGroup(formControls);
  formGroup.valueChanges
    .pipe(
      takeUntil(destroyer),
      distinctUntilChanged(),
      startWith(formGroup.value)
    )
    .subscribe(() => {
      updateFormGroup(formGroup, formFields);
    });

  return {
    value: formGroup,
    destroy: () => {
      destroyer.next();
      destroyer.complete();
    }
  };
}

/**
 * Updates a form group's form control's disabled attribute based on the form field configurations
 *
 * @param formGroup The form group to update
 * @param formFields The form field configurations
 */
function updateFormGroup(formGroup: FormGroup, formFields: FormField[]): void {
  Object.entries(formGroup.controls).forEach(([controlName, control]) => {
    const field = formFields.find(({ name }) => name === controlName);
    const disabled = field.disabled != null && field.disabled(formGroup);
    if (disabled && !control.disabled) {
      control.disable();
    } else if (!disabled && control.disabled) {
      control.enable();
    }
  });
}

/**
 * Converts a collection of form field configurations into form field views
 * This will filter out excluded form fields
 *
 * @param fields The form fields to convert
 * @param state The initial form state
 * @param formOptions The form display options
 */
export function toFormFieldViews(
  fields: FormField[],
  state: { [fieldName: string]: any } = {},
  formOptions: FormOptions = {}
): FormFieldView[] {
  return (fields || [])
    .filter(field => !field.excluded)
    .map(field => toFormFieldView(field, state[field.name], formOptions));
}

/**
 * Converts a form field configuration, value and form options into a ready-to-render form field view
 *
 * @param field The form field configuration
 * @param value The initial form field value
 * @param formOptions The form display options
 */
export function toFormFieldView(
  field: FormField,
  value?: any,
  formOptions: FormOptions = {}
): FormFieldView {
  const {
    readonly: readonlySettings,
    fields: { [field.name]: overrides = {} } = {}
  } = formOptions;

  const view = {
    ...field,
    ...overrides
  };

  const control = createFormControl(field, value);

  const readonly =
    readonlySettings === true ||
    (readonlySettings != null &&
      isArray(readonlySettings) &&
      readonlySettings.includes(field.name));

  const readonlyValue =
    view.options != null
      ? view.options.find(({ value }) => value === control.value).text
      : control.value;

  return {
    ...view,
    control,
    readonly,
    readonlyValue
  };
}
