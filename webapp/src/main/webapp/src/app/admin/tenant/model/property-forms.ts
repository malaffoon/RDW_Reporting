import { Property } from './property';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export function propertyForm(
  properties: Property[],
  values: any = {},
  validators: ValidatorFn | ValidatorFn[] = []
): FormGroup {
  // in case it is explicitly returned as null
  // TODO move this logic to tenants.ts
  values = values || {};

  const formGroup = new FormGroup(
    (properties || []).reduce((controlsByName, property) => {
      // don't populate form control values for inputs
      // show a placeholder instead to indicate that entering nothing will
      // result in that default value
      const {
        originalValue,
        validators,
        configuration: {
          name,
          readonly,
          dataType: { inputType }
        }
      } = property;

      const value =
        inputType !== 'input' ? values[name] || originalValue : values[name];

      controlsByName[name] = new FormControl(
        {
          value,
          disabled: readonly
        },
        validators
      );
      return controlsByName;
    }, {}),
    validators
  );

  return formGroup;
}
