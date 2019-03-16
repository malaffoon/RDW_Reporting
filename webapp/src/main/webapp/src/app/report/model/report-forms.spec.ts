import { createFormGroup } from './report-forms';
import { Subject } from 'rxjs';
import { FormField } from './form';
import { FormGroup, Validators } from '@angular/forms';

describe('createFormGroup', () => {
  const fieldA: FormField = {
    name: 'a',
    type: 'input'
  };

  const fieldB: FormField = {
    name: 'b',
    type: 'input'
  };

  it('should create an empty form group when provided no fields', () => {
    const formGroup = createFormGroup([], {}, new Subject());
    expect(formGroup.value).toEqual({});
  });

  it('should have default value of undefined and not-disabled', () => {
    const fields: FormField[] = [fieldA];
    const formGroup = createFormGroup(fields, {}, new Subject());
    expect(formGroup.value).toEqual({
      a: undefined
    });
  });

  it('should apply default value based on field config', () => {
    const fields: FormField[] = [
      {
        ...fieldA,
        defaultValue: 1
      }
    ];
    const formGroup = createFormGroup(fields, {}, new Subject());
    expect(formGroup.value).toEqual({
      a: fields[0].defaultValue
    });
  });

  it('should apply disabled based on field config and current state', () => {
    const fields: FormField[] = [
      fieldA,
      {
        ...fieldB,
        disabled: (formGroup: FormGroup) => formGroup.value.a === 1
      }
    ];
    const formGroup = createFormGroup(fields, {}, new Subject());
    expect(formGroup.controls.b.disabled).toBe(false);
    formGroup.controls.a.setValue(1);
    expect(formGroup.controls.b.disabled).toBe(true);
    formGroup.controls.a.setValue(2);
    expect(formGroup.controls.b.disabled).toBe(false);
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
    const formGroup = createFormGroup(fields, state, new Subject());
    expect(formGroup.value).toEqual(state);
  });

  it('should apply validators', () => {
    const fields: FormField[] = [
      {
        ...fieldA,
        validators: [Validators.required]
      },
      fieldB
    ];
    const formGroup = createFormGroup(fields, {}, new Subject());
    expect(formGroup.controls.a.errors).toEqual({ required: true });
    expect(formGroup.controls.b.errors).toEqual({});
  });
});
