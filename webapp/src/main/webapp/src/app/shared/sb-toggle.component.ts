import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Utils } from "./support/support";
import { AbstractControlValueAccessor } from "./form/abstract-control-value-accessor";

const DefaultStyleClasses = {'btn-group-sm': true};
const DefaultButtonStyleClasses = {'btn-primary': true};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SBToggleComponent),
  multi: true
};

/**
 * TODO rename to sb-radio-button-group
 *
 * A two state switch component that can be used in place of a checkbox
 * @example <code><sb-toggle [options]="[{value: true, text: 'On'}, {value: false, text: 'Off'}]" [(ngModel)]="myModel"></sb-toggle></code>
 */
@Component({
  selector: 'sb-toggle',
  template: `
    <div class="btn-group toggle-group"
         [ngClass]="ngClass"
         data-toggle="buttons">
      <label *ngFor="let option of options"
             class="btn"
             [ngClass]="computeButtonClassesInternal({active: option.value === value, disabled: disabled})">
        <input type="radio"
               [id]="name"
               [name]="name"
               [disabled]="disabled"
               [value]="option.value"
               [(ngModel)]="value"
               angulartics2On="click"
               [angularticsEvent]="analyticsEvent"
               [angularticsCategory]="analyticsCategory"
               [angularticsProperties]="option.analyticsProperties || {label: option.text}">{{option.text}}
      </label>
    </div>
  `,
  providers: [ CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ]
})
export class SBToggleComponent extends AbstractControlValueAccessor<any> implements OnInit {

  @Input()
  disabled: boolean = false;

  @Input()
  name: string = Utils.newGuid();

  /**
   *  The analytics event to send when clicked
   */
  @Input()
  public analyticsEvent: string;

  /**
   * The analytics category to use
   */
  @Input()
  public analyticsCategory: string;

  private _options: Option[];
  private _ngClass: any = DefaultStyleClasses;
  private _buttonNgClass: any = DefaultButtonStyleClasses;

  get ngClass(): any {
    return this._ngClass;
  }

  @Input()
  set ngClass(value: any) {
    this._ngClass = value;
      typeof value === 'string'
      ? `${Object.keys(DefaultStyleClasses).join(' ')} ${value}`
      : Object.assign({}, DefaultStyleClasses, );
  }

  get buttonNgClass(): any {
    return this._buttonNgClass;
  }

  @Input()
  set buttonNgClass(value: any) {
    this._buttonNgClass = value;
      typeof value === 'string'
      ? `${Object.keys(DefaultButtonStyleClasses).join(' ')} ${value}`
      : Object.assign({}, DefaultButtonStyleClasses, value);
  }

  get options(): Option[] {
    return this._options;
  }

  @Input()
  set options(options: Option[]) {
    if (options == null || typeof options === 'undefined') {
      this.throwError('options must not be null or undefined');
    }
    this._options = options.map(option => <Option>{
      value: option.value,
      text: option.text ? option.text : option.value
    });
  }

  ngOnInit() {
    if (this.options === undefined) {
      this.throwError('options must not be null');
    }
  }

  computeClassesInternal(): any {
    return this._ngClass ? this._ngClass : DefaultStyleClasses;
  }

  computeButtonClassesInternal(classes: any): any {
    return Utils.toNgClass(this._buttonNgClass ? this._buttonNgClass : DefaultButtonStyleClasses, classes);
  }

  private throwError(message: string): void {
    throw new Error(this.constructor.name + ' ' + message);
  }

}

/**
 * Describes what properties to give to the toggle's options instances when initializing it.
 */
export interface Option {
  value: any;
  text?: string;
  analyticsProperties?: any;
}
