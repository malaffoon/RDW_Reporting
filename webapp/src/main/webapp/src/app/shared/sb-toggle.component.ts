import { Component, forwardRef } from "@angular/core";
import { Utils } from "./Utils";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

const NOOP: () => void = () => {};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SBToggleComponent),
  multi: true
};

@Component({
  selector: 'sb-toggle',
  template: `
    <div class="btn-group btn-group-sm toggle-group" data-toggle="buttons">
      <label class="btn btn-primary" [ngClass]="{'active': value}">
        <input [value]="true" [(ngModel)]="value" type="radio" [name]="name">{{'buttons.visibility.show' | translate}}
      </label>
      <label class="btn btn-primary" [ngClass]="{'active': !value}">
        <input [value]="false" [(ngModel)]="value" type="radio" [name]="name">{{'buttons.visibility.hide' | translate}}
      </label>
    </div>
  `,
  providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ]
})
export class SBToggleComponent implements ControlValueAccessor {

  private _value: boolean;
  private _name: string = Utils.newGuid();
  private _onTouchedCallback: () => void = NOOP;
  private _onChangeCallback: (_: any) => void = NOOP;

  get value(): boolean {
    return this._value;
  }

  set value(value: boolean) {
    if (this._value !== value) {
      this._value = value;
      this._onChangeCallback(value);
    }
  }

  get name(): string {
    return this._name;
  }

  writeValue(value: any): void {
    if (this._value !== value) {
      this._value = value;
    }
  }

  registerOnChange(callback: any): void {
    this._onChangeCallback = (callback !== null ? callback : NOOP);
  }

  registerOnTouched(callback: any): void {
    this._onTouchedCallback = (callback !== null ? callback : NOOP);
  }

}
