import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input
} from '@angular/core';
import { OldConfigProp } from '../../model/old-config-prop';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Property } from '../../model/property';

export function localizationOverridesFormGroup(
  defaults: any,
  overrides: any
): FormGroup {
  return new FormGroup(
    Object.entries(defaults).reduce((controlsByName, [key, defaultValue]) => {
      const overrideValue = overrides[key];
      const value = overrideValue != null ? overrideValue : defaultValue;

      // TODO apply metadata
      const validators = [];

      controlsByName[key] = new FormControl(value, validators);

      return controlsByName;
    }, {})
  );
}

function rowTrackBy(index: number, value: OldConfigProp) {
  return value.key;
}

@Component({
  selector: 'property-override-table',
  templateUrl: './property-override-table.component.html',
  styleUrls: ['./property-override-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PropertyOverrideTableComponent),
      multi: true
    }
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: forwardRef(() => PropertyOverrideTableComponent),
    //   multi: true
    // }
  ]
})
//TODO: Implement ControlValueAccessor
export class PropertyOverrideTableComponent implements ControlValueAccessor {
  readonly rowTrackBy = rowTrackBy;

  @Input()
  defaults: any;

  @Input()
  properties: Property[];

  @Input()
  readonly = true;

  first = 0;

  constructor(public controlContainer: ControlContainer) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  onResetButtonClick(property: Property): void {
    this.formGroup.patchValue({
      [property.key]: property.defaultValue
    });
  }

  // control value accessor implementation:

  public onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value) {
      this.formGroup.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.formGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable() : this.formGroup.enable();
  }
}
