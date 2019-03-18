import { FormField } from './form';
import { FormGroup, Validators } from '@angular/forms';
import {
  createFormControl,
  createFormControls,
  createReactiveFormGroup,
  toFormFieldView,
  toFormFieldViews
} from './forms';

const fieldA: FormField = {
  name: 'a',
  type: 'input'
};

const fieldB: FormField = {
  name: 'b',
  type: 'input'
};

describe('createFormControl', () => {
  it('should have default value of undefined and not-disabled', () => {
    const control = createFormControl(fieldA);
    expect(control.value).toBeUndefined();
  });

  it('should apply default value based on field config', () => {
    const field: FormField = {
      ...fieldA,
      defaultValue: 1
    };
    const control = createFormControl(field);
    expect(control.value).toEqual(field.defaultValue);
  });

  it('should apply value over default value', () => {
    const field: FormField = {
      ...fieldA,
      defaultValue: 1
    };
    const initialValue = 2;
    const control = createFormControl(field, initialValue);
    expect(control.value).toEqual(initialValue);
  });

  it('should apply validators at initialization', () => {
    const field: FormField = {
      ...fieldA,
      validators: [Validators.required]
    };
    const control = createFormControl(field);
    expect(control.errors).toEqual({ required: true });

    const control2 = createFormControl(fieldA);
    expect(control2.errors).toBeNull();
  });
});

describe('createFormControls', () => {
  it('should create an empty control set when provided no fields', () => {
    const controls = createFormControls([]);
    expect(controls).toEqual({});
  });

  it('should apply state over defaults', () => {
    const fields: FormField[] = [
      {
        ...fieldA,
        defaultValue: 1
      }
    ];
    const state = {
      a: 2
    };
    const controls = createFormControls(fields, state);
    expect(controls.a.value).toEqual(state.a);
  });

  it('should apply state over defaults', () => {
    const fields: FormField[] = [
      {
        ...fieldA,
        defaultValue: 1
      }
    ];
    const state = {
      a: 2
    };
    const controls = createFormControls(fields, state);
    expect(controls.a.value).toEqual(state.a);
  });
});

describe('createReactiveFormGroup', () => {
  it('should apply disabled based on field config and current state', () => {
    const fields: FormField[] = [
      fieldA,
      {
        ...fieldB,
        disabled: (formGroup: FormGroup) => formGroup.value.a === 1
      }
    ];
    const controls = createFormControls(fields, {});
    const destroyableFormGroup = createReactiveFormGroup(fields, controls);
    expect(controls.b.disabled).toBe(false);
    controls.a.setValue(1);
    expect(controls.b.disabled).toBe(true);
    controls.a.setValue(2);
    expect(controls.b.disabled).toBe(false);
  });

  it('should unsubscribe from subscriptions after destroyed', () => {
    const fields: FormField[] = [
      fieldA,
      {
        ...fieldB,
        disabled: (formGroup: FormGroup) => formGroup.value.a === 1
      }
    ];
    const controls = createFormControls(fields, {});
    const destroyableFormGroup = createReactiveFormGroup(fields, controls);
    expect(controls.b.disabled).toBe(false);
    controls.a.setValue(1);
    expect(controls.b.disabled).toBe(true);
    destroyableFormGroup.destroy();
    controls.a.setValue(2);
    expect(controls.b.disabled).toBe(true);
  });
});

describe('toFormFieldViews', () => {
  it('should filter out excluded fields', () => {
    const fields = [fieldA];

    expect(toFormFieldViews(fields).length).toBe(1);

    expect(
      toFormFieldViews([
        {
          ...fieldA,
          excluded: true
        }
      ])
    ).toEqual([]);
  });
});

describe('toFormFieldView', () => {
  it('should set form control', () => {
    const view = toFormFieldView(fieldA);
    expect(view.control).toBeDefined();
  });

  it('should apply overrides', () => {
    const name = 'A';
    const view = toFormFieldView(fieldA, undefined, {
      fields: {
        a: {
          name
        }
      }
    });
    expect(view.name).toBe(name);
  });

  it('should apply readonly when set true', () => {
    const view = toFormFieldView(fieldA, undefined, {
      readonly: true
    });
    expect(view.readonly).toBe(true);
  });

  it('should apply readonly when set to field names', () => {
    const view = toFormFieldView(fieldA, undefined, {
      readonly: ['a']
    });
    expect(view.readonly).toBe(true);
  });

  it('should not apply readonly when set to different field names', () => {
    const view = toFormFieldView(fieldA, undefined, {
      readonly: ['b']
    });
    expect(view.readonly).toBe(false);
  });

  it('should not compute readonly value when readonly is true', () => {
    const value = 1;
    const view = toFormFieldView(fieldA, value, {
      readonly: true
    });
    expect(view.readonlyValue).toBe(value);
  });

  it('should not compute readonly value as option label when readonly is true and options are set', () => {
    const value = 1;
    const option = {
      value,
      text: 'one'
    };
    const view = toFormFieldView(
      {
        ...fieldA,
        options: [option]
      },
      value,
      {
        readonly: true
      }
    );
    expect(view.readonlyValue).toBe(option.text);
  });
});
