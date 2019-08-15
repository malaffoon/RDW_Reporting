import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Property } from '../../model/property';
import { formFieldModified } from '../../model/form/form-fields';

function rowTrackBy(index: number, value: Property) {
  return value.configuration.name;
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
  readonly = true;

  _rows: Property[];
  _first = 0;

  constructor(public controlContainer: ControlContainer) {}

  @Input()
  set rows(values: Property[]) {
    this._rows = values;
    // reset the page back to the first page when the search changes
    this._first = 0;
  }

  modified(property: Property): boolean {
    return formFieldModified(
      property.configuration.dataType.inputType,
      this.formGroup.value[property.configuration.name],
      property.originalValue
    );
  }

  readonlyValue(property: Property): any {
    const { name } = property.configuration;
    // needs to be raw value because these fields will be disabled
    // and disabled field values do not appear in formGroup.value
    const value = this.formGroup.getRawValue()[name];
    if (value != null) {
      return value;
    }
    const defaultValue = this.defaults[name]; // property.originalValue?
    if (defaultValue != null) {
      return defaultValue;
    }
    return '';
  }

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
      [property.configuration.name]: property.originalValue
    });
  }
}
