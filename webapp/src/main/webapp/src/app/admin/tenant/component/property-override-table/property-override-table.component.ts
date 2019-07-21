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
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Property } from '../../model/property';

export function localizationsFormGroup(
  defaults: any,
  overrides: any
): FormGroup {
  return new FormGroup(
    Object.entries(defaults).reduce((controlsByName, [key, defaultValue]) => {
      const overrideValue = overrides[key];
      const value = overrideValue != null ? overrideValue : defaultValue;
      const validators = []; // TODO?
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
  ]
})
export class PropertyOverrideTableComponent implements ControlValueAccessor {
  readonly rowTrackBy = rowTrackBy;

  @Input()
  defaults: any;

  @Input()
  rows: Property[];

  @Input()
  readonly = true;

  // TODO still need this?
  first = 0;

  constructor(public controlContainer: ControlContainer) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
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

  // internals

  onResetButtonClick(property: Property): void {
    this.formGroup.patchValue({
      [property.key]: property.defaultValue
    });
  }
}
